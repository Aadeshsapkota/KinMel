using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using ECommerce.API.Esewa;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ECommerce.API.Email;

namespace ECommerce.API.Services.Implementations;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;
    private readonly IOrderService _orderService;
    private readonly IEmailService _emailService;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly EsewaSettings _esewaSettings;

    public PaymentService(
        ApplicationDbContext context,
        IOrderService orderService,
        IEmailService emailService,
        IHttpClientFactory httpClientFactory,
        IOptions<EsewaSettings> esewaOptions)
    {
        _context = context;
        _orderService = orderService;
        _emailService = emailService;
        _httpClientFactory = httpClientFactory;
        _esewaSettings = esewaOptions.Value;
    }

    // eSewa amounts must be formatted identically in the form, signature and status check
    private static string FormatAmount(decimal amount) =>
        amount.ToString("0.##", CultureInfo.InvariantCulture);

    private string GenerateSignature(string totalAmount, string transactionUuid)
    {
        var message =
            $"total_amount={totalAmount},transaction_uuid={transactionUuid},product_code={_esewaSettings.ProductCode}";

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_esewaSettings.SecretKey));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
        return Convert.ToBase64String(hash);
    }

    public async Task<EsewaCheckoutResponse>
    CreateCheckoutSessionAsync(
        int userId,
        CheckoutRequest request)
    {
        var cartItems = await _context.CartItems
            .Where(x => x.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
        {
            throw new Exception("Cart is empty.");
        }

        decimal totalAmount = 0;
        var pendingItems = new List<PendingOrderItem>();

        foreach (var cartItem in cartItems)
        {
            var product =
                await _context.Products
                    .FirstOrDefaultAsync(x => x.Id == cartItem.ProductId);

            if (product is null)
                continue;

            totalAmount += product.Price * cartItem.Quantity;

            pendingItems.Add(new PendingOrderItem
            {
                ProductId = product.Id,
                Quantity = cartItem.Quantity,
                Price = product.Price
            });
        }

        if (!pendingItems.Any())
        {
            throw new Exception("No valid products in cart.");
        }

        var transactionUuid = Guid.NewGuid().ToString();
        var amountString = FormatAmount(totalAmount);

        var pendingOrder =
            new PendingOrder
            {
                UserId = userId,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                AddressLine1 = request.AddressLine1,
                AddressLine2 = request.AddressLine2,
                City = request.City,
                State = request.State,
                Country = request.Country,
                PostalCode = request.PostalCode,
                PaymentMethod = "eSewa",
                TransactionUuid = transactionUuid,
                TotalAmount = totalAmount,
                PendingOrderItems = pendingItems
            };

        _context.PendingOrders.Add(pendingOrder);
        await _context.SaveChangesAsync();

        var formData = new Dictionary<string, string>
        {
            ["amount"] = amountString,
            ["tax_amount"] = "0",
            ["total_amount"] = amountString,
            ["transaction_uuid"] = transactionUuid,
            ["product_code"] = _esewaSettings.ProductCode,
            ["product_service_charge"] = "0",
            ["product_delivery_charge"] = "0",
            ["success_url"] = _esewaSettings.SuccessUrl,
            ["failure_url"] = _esewaSettings.FailureUrl,
            ["signed_field_names"] = "total_amount,transaction_uuid,product_code",
            ["signature"] = GenerateSignature(amountString, transactionUuid)
        };

        return new EsewaCheckoutResponse
        {
            PaymentUrl = _esewaSettings.PaymentUrl,
            FormData = formData
        };
    }

    public async Task<bool>
    ConfirmPaymentAsync(
        string transactionUuid)
    {
        var pendingOrder =
            await _context.PendingOrders
                .Include(x => x.PendingOrderItems)
                .FirstOrDefaultAsync(
                    x => x.TransactionUuid == transactionUuid);

        if (pendingOrder is null)
        {
            return false;
        }

        // Verify with eSewa server-side (never trust the redirect alone)
        var amountString = FormatAmount(pendingOrder.TotalAmount);

        var statusUrl =
            $"{_esewaSettings.StatusUrl}" +
            $"?product_code={Uri.EscapeDataString(_esewaSettings.ProductCode)}" +
            $"&total_amount={Uri.EscapeDataString(amountString)}" +
            $"&transaction_uuid={Uri.EscapeDataString(transactionUuid)}";

        var client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync(statusUrl);

        if (!response.IsSuccessStatusCode)
        {
            return false;
        }

        var json = await response.Content.ReadAsStringAsync();
        var status = JsonSerializer.Deserialize<EsewaStatusResponse>(json);

        if (status is null || status.Status != "COMPLETE")
        {
            return false;
        }

        var order =
            await _orderService
                .CreateOrderFromPendingOrderAsync(pendingOrder);

        var user =
            await _context.Users
                .FirstOrDefaultAsync(x => x.Id == pendingOrder.UserId);

        if (user is not null)
        {
            var body = $@"
        <h2>Payment Successful 🎉</h2>

        <p>Hello {user.Name},</p>

        <p>Your payment has been received successfully.</p>

        <hr/>

        <p><strong>Order ID:</strong> {order.Id}</p>

        <p><strong>Total Amount:</strong> Rs. {order.TotalAmount}</p>

        <p><strong>Payment Method:</strong> eSewa</p>

        <p><strong>Status:</strong> {order.Status}</p>

        <hr/>

        <p>Thank you for shopping with Velocity Shop.</p>
    ";

            try
            {
                await _emailService.SendEmailAsync(
                    user.Email,
                    $"Order #{order.Id} Confirmation",
                    body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WARNING] Failed to send order confirmation email to {user.Email}: {ex.Message}");
            }
        }

        var cartItems =
            await _context.CartItems
                .Where(x => x.UserId == pendingOrder.UserId)
                .ToListAsync();

        _context.CartItems.RemoveRange(cartItems);
        _context.PendingOrderItems.RemoveRange(pendingOrder.PendingOrderItems);
        _context.PendingOrders.Remove(pendingOrder);

        await _context.SaveChangesAsync();
        return true;
    }

    private class EsewaStatusResponse
    {
        [JsonPropertyName("status")]
        public string? Status { get; set; }

        [JsonPropertyName("ref_id")]
        public string? RefId { get; set; }
    }
}