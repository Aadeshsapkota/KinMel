using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.Google;

namespace ECommerce.API.Services.Implementations
{
    public class AIShoppingAssistantService : IAIShoppingAssistantService
    {
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _serviceProvider;

        public AIShoppingAssistantService(IConfiguration configuration, IServiceProvider serviceProvider)
        {
            _configuration = configuration;
            _serviceProvider = serviceProvider;
        }

        public async Task<AIChatResponse> ProcessChatAsync(AIChatRequest request, int? userId)
        {
            var apiKey = _configuration["GeminiApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return new AIChatResponse { Reply = "AI Assistant is currently unavailable due to missing configuration." };
            }

            var builder = Kernel.CreateBuilder();
            builder.AddGoogleAIGeminiChatCompletion(
                modelId: "gemini-flash-latest",
                apiKey: apiKey);

            // Add our E-Commerce Plugin
            builder.Plugins.AddFromObject(new ECommercePlugin(_serviceProvider, userId), "ECommerce");

            var kernel = builder.Build();
            var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();

            var history = new ChatHistory(
                "You are an expert AI Shopping Assistant, Customer Support Representative, and Sales Assistant for Velocity.Shop, a premium e-commerce platform. " +
                "You have access to the store's real-time inventory, product details, user orders, and wishlists via tools. " +
                "ALWAYS use tools to search for products or check order status. NEVER hallucinate products, prices, or stock. " +
                "Be concise, extremely helpful, and use Markdown for formatting (like bolding product names or prices). " +
                "If a user asks about their orders or wishlist, use the respective tools to fetch them."
            );

            if (request.History != null)
            {
                foreach (var msg in request.History)
                {
                    if (msg.Role.Equals("user", StringComparison.OrdinalIgnoreCase))
                    {
                        history.AddUserMessage(msg.Content);
                    }
                    else if (msg.Role.Equals("assistant", StringComparison.OrdinalIgnoreCase) || msg.Role.Equals("model", StringComparison.OrdinalIgnoreCase))
                    {
                        history.AddAssistantMessage(msg.Content);
                    }
                }
            }

            history.AddUserMessage(request.Message);

            var executionSettings = new GeminiPromptExecutionSettings
            {
                ToolCallBehavior = GeminiToolCallBehavior.AutoInvokeKernelFunctions,
                Temperature = 0.5,
                MaxTokens = 1000
            };

            var result = await chatCompletionService.GetChatMessageContentAsync(
                history,
                executionSettings: executionSettings,
                kernel: kernel);

            return new AIChatResponse { Reply = result.Content ?? "I couldn't generate a response." };
        }
    }

    public class ECommercePlugin
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly int? _userId;

        public ECommercePlugin(IServiceProvider serviceProvider, int? userId)
        {
            _serviceProvider = serviceProvider;
            _userId = userId;
        }

        [KernelFunction, Description("Searches the store catalog for products matching the query, price range, or category. ALWAYS use this when a user asks for recommendations or wants to find a product.")]
        public async Task<string> SearchProducts(
            [Description("The search keyword (e.g., 'laptop', 'gaming', 'phone')")] string query = "",
            [Description("The maximum price the user is willing to pay")] decimal? maxPrice = null,
            [Description("The exact name of the category if mentioned")] string category = "")
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var queryable = db.Products.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                var lowerQuery = query.ToLower();
                queryable = queryable.Where(p => p.Name.ToLower().Contains(lowerQuery) || p.Description.ToLower().Contains(lowerQuery) || p.Brand.ToLower().Contains(lowerQuery));
            }

            if (maxPrice.HasValue)
            {
                queryable = queryable.Where(p => p.Price <= maxPrice.Value);
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                var lowerCat = category.ToLower();
                queryable = queryable.Where(p => p.Category.Name.ToLower().Contains(lowerCat));
            }

            var products = await queryable
                .OrderByDescending(p => p.Stock > 0) // In stock first
                .Take(5) // Limit to 5 for context size
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.CompareAtPrice,
                    p.Stock,
                    p.Brand,
                    Category = p.Category.Name
                })
                .ToListAsync();

            if (!products.Any()) return "No products found matching the criteria.";

            return System.Text.Json.JsonSerializer.Serialize(products);
        }

        [KernelFunction, Description("Gets full, detailed information about a specific product including specifications and features. Use this when a user asks for details about a specific product they have already found.")]
        public async Task<string> GetProductDetails([Description("The numeric ID of the product")] int productId)
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var product = await db.Products
                .Where(p => p.Id == productId)
                .Select(p => new
                {
                    p.Name,
                    p.Description,
                    p.Price,
                    p.Stock,
                    p.Brand,
                    p.Features,
                    p.Specifications
                })
                .FirstOrDefaultAsync();

            if (product == null) return "Product not found.";

            return System.Text.Json.JsonSerializer.Serialize(product);
        }

        [KernelFunction, Description("Gets the current authenticated user's recent orders and their statuses. Use this when a user asks 'Where is my order?' or similar.")]
        public async Task<string> GetUserOrders()
        {
            if (!_userId.HasValue) return "User is not authenticated. Please tell them to log in to view orders.";

            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var orders = await db.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == _userId.Value)
                .OrderByDescending(o => o.CreatedDate)
                .Take(3)
                .Select(o => new
                {
                    o.Id,
                    o.Status,
                    o.TotalAmount,
                    o.CreatedDate,
                    Items = o.OrderItems.Select(oi => oi.Product.Name).ToList()
                })
                .ToListAsync();

            if (!orders.Any()) return "The user has no recent orders.";

            return System.Text.Json.JsonSerializer.Serialize(orders);
        }

        [KernelFunction, Description("Gets the current authenticated user's wishlist. Use this when a user asks what's in their wishlist or wants recommendations based on it.")]
        public async Task<string> GetUserWishlist()
        {
            if (!_userId.HasValue) return "User is not authenticated. Please tell them to log in to view their wishlist.";

            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var wishlist = await db.Wishlists
                .Include(w => w.Product)
                .Where(w => w.UserId == _userId.Value)
                .Select(w => new
                {
                    w.Product.Id,
                    w.Product.Name,
                    w.Product.Price
                })
                .ToListAsync();

            if (!wishlist.Any()) return "The user's wishlist is empty.";

            return System.Text.Json.JsonSerializer.Serialize(wishlist);
        }
    }
}
