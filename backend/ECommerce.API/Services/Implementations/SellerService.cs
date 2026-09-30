using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Implementations;

public class SellerService : ISellerService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SellerService(
        ApplicationDbContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    private async Task<Seller> GetSellerByUserIdOrThrowAsync(int userId)
    {
        var seller = await _context.Sellers
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (seller is null)
            throw new Exception("Seller profile not found.");

        if (seller.IsSuspended)
            throw new Exception("Your seller account has been suspended.");

        if (!seller.IsApproved)
            throw new Exception("Your seller account is pending approval.");

        return seller;
    }

    // ─── Dashboard ───

    public async Task<SellerDashboardResponse> GetDashboardAsync(int userId)
    {
        var seller = await GetSellerByUserIdOrThrowAsync(userId);

        var productIds = await _context.Products
            .Where(p => p.SellerId == seller.Id)
            .Select(p => p.Id)
            .ToListAsync();

        var totalProducts = productIds.Count;

        var orderItems = await _context.OrderItems
            .Include(oi => oi.Order)
            .Where(oi => productIds.Contains(oi.ProductId))
            .ToListAsync();

        var orderIds = orderItems
            .Select(oi => oi.OrderId)
            .Distinct()
            .ToList();

        var totalOrders = orderIds.Count;
        var totalRevenue = orderItems.Sum(oi => oi.Price * oi.Quantity);

        var recentOrders = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.OrderItems.Any(oi => productIds.Contains(oi.ProductId)))
            .OrderByDescending(o => o.CreatedDate)
            .Take(5)
            .Select(o => new SellerOrderResponse
            {
                OrderId = o.Id,
                CustomerName = o.FullName,
                OrderDate = o.CreatedDate,
                Status = o.Status,
                SellerTotal = o.OrderItems
                    .Where(oi => productIds.Contains(oi.ProductId))
                    .Sum(oi => oi.Price * oi.Quantity),
                Items = o.OrderItems
                    .Where(oi => productIds.Contains(oi.ProductId))
                    .Select(oi => new SellerOrderItemResponse
                    {
                        ProductName = oi.Product!.Name,
                        ProductImage = oi.Product.ImageUrl,
                        Quantity = oi.Quantity,
                        Price = oi.Price,
                        Total = oi.Price * oi.Quantity
                    }).ToList()
            })
            .ToListAsync();

        return new SellerDashboardResponse
        {
            TotalProducts = totalProducts,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            RecentOrders = recentOrders
        };
    }

    // ─── Products ───

    public async Task<IEnumerable<ProductResponse>> GetSellerProductsAsync(int userId)
    {
        var seller = await GetSellerByUserIdOrThrowAsync(userId);

        var products = await _context.Products
            .Include(p => p.Seller)
            .Where(p => p.SellerId == seller.Id)
            .ToListAsync();

        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<ProductResponse> CreateProductAsync(
        int userId, CreateProductRequest request)
    {
        var seller = await GetSellerByUserIdOrThrowAsync(userId);

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == request.CategoryId);

        if (category is null)
            throw new Exception("Category not found.");

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            ImageUrl = request.ImageUrl,
            CategoryId = request.CategoryId,
            SellerId = seller.Id,
            CompareAtPrice = request.CompareAtPrice,
            InstallmentPlan = request.InstallmentPlan,
            Images = request.Images,
            Brand = request.Brand,
            IsActive = request.IsActive,
            SKU = request.SKU,
            TrackQuantity = request.TrackQuantity,
            ContinueSellingWhenOutOfStock = request.ContinueSellingWhenOutOfStock,
            UrlHandle = request.UrlHandle,
            MetaDescription = request.MetaDescription,
            ProductType = request.ProductType,
            Vendor = request.Vendor,
            Tags = request.Tags,
            Variants = request.Variants,
            Specifications = request.Specifications,
            Features = request.Features
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Reload with seller
        product = await _context.Products
            .Include(p => p.Seller)
            .FirstAsync(p => p.Id == product.Id);

        return _mapper.Map<ProductResponse>(product);
    }

    public async Task<ProductResponse?> UpdateProductAsync(
        int userId, int productId, UpdateProductRequest request)
    {
        var seller = await GetSellerByUserIdOrThrowAsync(userId);

        var product = await _context.Products
            .Include(p => p.Seller)
            .FirstOrDefaultAsync(p => p.Id == productId && p.SellerId == seller.Id);

        if (product is null)
            return null;

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.ImageUrl = request.ImageUrl;
        product.CategoryId = request.CategoryId;
        product.CompareAtPrice = request.CompareAtPrice;
        product.InstallmentPlan = request.InstallmentPlan;
        product.Images = request.Images;
        product.Brand = request.Brand;
        product.IsActive = request.IsActive;
        product.SKU = request.SKU;
        product.TrackQuantity = request.TrackQuantity;
        product.ContinueSellingWhenOutOfStock = request.ContinueSellingWhenOutOfStock;
        product.UrlHandle = request.UrlHandle;
        product.MetaDescription = request.MetaDescription;
        product.ProductType = request.ProductType;
        product.Vendor = request.Vendor;
        product.Tags = request.Tags;
        product.Variants = request.Variants;
        product.Specifications = request.Specifications;
        product.Features = request.Features;

        await _context.SaveChangesAsync();

        return _mapper.Map<ProductResponse>(product);
    }

    public async Task<bool> DeleteProductAsync(int userId, int productId)
    {
        var seller = await GetSellerByUserIdOrThrowAsync(userId);

        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && p.SellerId == seller.Id);

        if (product is null)
            return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return true;
    }

    // ─── Orders ───

    public async Task<IEnumerable<SellerOrderResponse>> GetSellerOrdersAsync(int userId)
    {
        var seller = await GetSellerByUserIdOrThrowAsync(userId);

        var productIds = await _context.Products
            .Where(p => p.SellerId == seller.Id)
            .Select(p => p.Id)
            .ToListAsync();

        var orders = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.OrderItems.Any(oi => productIds.Contains(oi.ProductId)))
            .OrderByDescending(o => o.CreatedDate)
            .Select(o => new SellerOrderResponse
            {
                OrderId = o.Id,
                CustomerName = o.FullName,
                OrderDate = o.CreatedDate,
                Status = o.Status,
                SellerTotal = o.OrderItems
                    .Where(oi => productIds.Contains(oi.ProductId))
                    .Sum(oi => oi.Price * oi.Quantity),
                Items = o.OrderItems
                    .Where(oi => productIds.Contains(oi.ProductId))
                    .Select(oi => new SellerOrderItemResponse
                    {
                        ProductName = oi.Product!.Name,
                        ProductImage = oi.Product.ImageUrl,
                        Quantity = oi.Quantity,
                        Price = oi.Price,
                        Total = oi.Price * oi.Quantity
                    }).ToList()
            })
            .ToListAsync();

        return orders;
    }

    // ─── Admin: Seller Management ───

    public async Task<IEnumerable<SellerResponse>> GetAllSellersAsync()
    {
        return await _context.Sellers
            .Include(s => s.User)
            .Include(s => s.Products)
            .Select(s => new SellerResponse
            {
                Id = s.Id,
                CompanyName = s.CompanyName,
                Description = s.Description,
                LogoUrl = s.LogoUrl,
                UserName = s.User!.Name,
                UserEmail = s.User.Email,
                UserId = s.UserId,
                IsApproved = s.IsApproved,
                IsSuspended = s.IsSuspended,
                CreatedDate = s.CreatedDate,
                TotalProducts = s.Products.Count,
                TotalRevenue = s.Products
                    .SelectMany(p => p.Reviews)
                    .Count() >= 0
                    ? _context.OrderItems
                        .Where(oi => s.Products
                            .Select(p => p.Id)
                            .Contains(oi.ProductId))
                        .Sum(oi => (decimal?)(oi.Price * oi.Quantity)) ?? 0
                    : 0
            })
            .ToListAsync();
    }

    public async Task<SellerResponse> CreateSellerAsync(CreateSellerRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.UserId);

        if (user is null)
            throw new Exception("User not found.");

        var existingSeller = await _context.Sellers
            .FirstOrDefaultAsync(s => s.UserId == request.UserId);

        if (existingSeller is not null)
            throw new Exception("User already has a seller profile.");

        // Set user role to Seller
        user.Role = "Seller";

        var seller = new Seller
        {
            CompanyName = request.CompanyName,
            Description = request.Description,
            LogoUrl = request.LogoUrl,
            UserId = request.UserId,
            IsApproved = true,
            IsSuspended = false
        };

        _context.Sellers.Add(seller);
        await _context.SaveChangesAsync();

        return new SellerResponse
        {
            Id = seller.Id,
            CompanyName = seller.CompanyName,
            Description = seller.Description,
            LogoUrl = seller.LogoUrl,
            UserName = user.Name,
            UserEmail = user.Email,
            UserId = seller.UserId,
            IsApproved = seller.IsApproved,
            IsSuspended = seller.IsSuspended,
            CreatedDate = seller.CreatedDate,
            TotalProducts = 0,
            TotalRevenue = 0
        };
    }

    public async Task<SellerResponse?> UpdateSellerAsync(
        int sellerId, UpdateSellerRequest request)
    {
        var seller = await _context.Sellers
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == sellerId);

        if (seller is null)
            return null;

        seller.CompanyName = request.CompanyName;
        seller.Description = request.Description;
        seller.LogoUrl = request.LogoUrl;
        seller.IsApproved = request.IsApproved;
        seller.IsSuspended = request.IsSuspended;

        await _context.SaveChangesAsync();

        return new SellerResponse
        {
            Id = seller.Id,
            CompanyName = seller.CompanyName,
            Description = seller.Description,
            LogoUrl = seller.LogoUrl,
            UserName = seller.User!.Name,
            UserEmail = seller.User.Email,
            UserId = seller.UserId,
            IsApproved = seller.IsApproved,
            IsSuspended = seller.IsSuspended,
            CreatedDate = seller.CreatedDate,
            TotalProducts = await _context.Products
                .CountAsync(p => p.SellerId == seller.Id),
            TotalRevenue = 0
        };
    }

    public async Task<bool> DeleteSellerAsync(int sellerId)
    {
        var seller = await _context.Sellers
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == sellerId);

        if (seller is null)
            return false;

        // Reset user role back to User
        if (seller.User is not null)
            seller.User.Role = "User";

        _context.Sellers.Remove(seller);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<SellerResponse?> GetSellerByUserIdAsync(int userId)
    {
        var seller = await _context.Sellers
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (seller is null)
            return null;

        return new SellerResponse
        {
            Id = seller.Id,
            CompanyName = seller.CompanyName,
            Description = seller.Description,
            LogoUrl = seller.LogoUrl,
            UserName = seller.User!.Name,
            UserEmail = seller.User.Email,
            UserId = seller.UserId,
            IsApproved = seller.IsApproved,
            IsSuspended = seller.IsSuspended,
            CreatedDate = seller.CreatedDate,
            TotalProducts = await _context.Products
                .CountAsync(p => p.SellerId == seller.Id),
            TotalRevenue = 0
        };
    }
}
