using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;

    public OrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderResponse>> GetOrdersAsync(
    int userId)
    {
        return await _context.Orders
            .Include(x => x.OrderItems)
                .ThenInclude(x => x.Product)
            .Where(x => x.UserId == userId)
            .Select(x => new OrderResponse
            {
                Id = x.Id,

                TotalAmount =
                    x.TotalAmount,

                Status =
                    x.Status,

                CreatedDate =
                    x.CreatedDate,

                ProductName =
                    x.OrderItems
                        .Select(i =>
                            i.Product != null
                                ? i.Product.Name
                                : "Unknown Product")
                        .FirstOrDefault()
                        ?? "Unknown Product",

                ProductImage =
                    x.OrderItems
                        .Select(i =>
                            i.Product != null
                                ? i.Product.ImageUrl
                                : "")
                        .FirstOrDefault()
                        ?? "",

                ItemCount =
                    x.OrderItems.Count
            })
            .ToListAsync();
    }

    public async Task<OrderDetailsResponse?> GetOrderByIdAsync(
    int userId,
    int orderId)
    {
        var order = await _context.Orders
            .Include(x => x.OrderItems)
            .ThenInclude(x => x.Product)
            .FirstOrDefaultAsync(x =>
                x.Id == orderId &&
                x.UserId == userId);

        if (order is null)
            return null;

        return new OrderDetailsResponse
        {
            Id = order.Id,

            TotalAmount = order.TotalAmount,

            Status = order.Status,

            PaymentStatus = order.PaymentStatus,

            PaymentMethod = order.PaymentMethod,

            FullName = order.FullName,

            PhoneNumber = order.PhoneNumber,

            AddressLine1 = order.AddressLine1,

            AddressLine2 = order.AddressLine2,

            City = order.City,

            State = order.State,

            Country = order.Country,

            PostalCode = order.PostalCode,

            CreatedDate = order.CreatedDate,

            Items = order.OrderItems
                .Select(item => new OrderItemResponse
                {
                    ProductId = item.ProductId,

                    ProductName = item.Product?.Name ?? "Unknown Product",

                    Price = item.Price,

                    Quantity = item.Quantity
                })
                .ToList()
        };
    }

    public async Task<OrderResponse> CreateOrderAsync(
    int userId,
    CheckoutRequest request)
    {
        var cartItems = await _context.CartItems
            .Where(x => x.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
            throw new Exception("Cart is empty.");

        decimal totalAmount = 0;

        var deliveryAgent =
    await _context.Users
        .Where(x => x.Role == "DeliveryAgent")
        .FirstOrDefaultAsync();

        var order = new Order
        {
            DeliveryAgentId =
    deliveryAgent?.Id,

            UserId = userId,

            Status = "Assigned",

            PaymentStatus = "Pending",

            PaymentMethod = request.PaymentMethod,

            FullName = request.FullName,

            PhoneNumber = request.PhoneNumber,

            AddressLine1 = request.AddressLine1,

            AddressLine2 = request.AddressLine2,

            City = request.City,

            State = request.State,

            Country = request.Country,

            PostalCode = request.PostalCode
        };

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        foreach (var cartItem in cartItems)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(
                    x => x.Id == cartItem.ProductId);

            if (product is null)
                continue;

            if (product.Stock < cartItem.Quantity)
            {
                throw new Exception(
                    $"Only {product.Stock} units of {product.Name} are available."
                );
            }

            totalAmount +=
                product.Price * cartItem.Quantity;

            _context.OrderItems.Add(
                new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = product.Id,
                    Quantity = cartItem.Quantity,
                    Price = product.Price
                });

            product.Stock -= cartItem.Quantity;
        }

        order.TotalAmount = totalAmount;

        _context.CartItems.RemoveRange(cartItems);

        await _context.SaveChangesAsync();

        return new OrderResponse
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedDate = order.CreatedDate
        };
    }

    public async Task<OrderResponse>
    CreateOrderFromPendingOrderAsync(
        PendingOrder pendingOrder)
    {
        decimal totalAmount = 0;

        var deliveryAgent =
    await _context.Users
        .Where(x => x.Role == "DeliveryAgent")
        .FirstOrDefaultAsync();

        var order = new Order
        {
            UserId = pendingOrder.UserId,

            DeliveryAgentId = deliveryAgent?.Id,

            Status = "Assigned",

            PaymentStatus = "Paid",

            PaymentMethod =
                pendingOrder.PaymentMethod,

            FullName =
                pendingOrder.FullName,

            PhoneNumber =
                pendingOrder.PhoneNumber,

            AddressLine1 =
                pendingOrder.AddressLine1,

            AddressLine2 =
                pendingOrder.AddressLine2,

            City =
                pendingOrder.City,

            State =
                pendingOrder.State,

            Country =
                pendingOrder.Country,

            PostalCode =
                pendingOrder.PostalCode
        };

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        foreach (var pendingItem in
            pendingOrder.PendingOrderItems)
        {
            var product =
                await _context.Products
                    .FirstOrDefaultAsync(
                        x => x.Id ==
                        pendingItem.ProductId);

            if (product is null)
                continue;

            if (product.Stock <
                pendingItem.Quantity)
            {
                throw new Exception(
                    $"Only {product.Stock} units of {product.Name} are available."
                );
            }

            totalAmount +=
                pendingItem.Price *
                pendingItem.Quantity;

            _context.OrderItems.Add(
                new OrderItem
                {
                    OrderId = order.Id,

                    ProductId =
                        pendingItem.ProductId,

                    Quantity =
                        pendingItem.Quantity,

                    Price =
                        pendingItem.Price
                });

            product.Stock -=
                pendingItem.Quantity;
        }

        order.TotalAmount =
            totalAmount;

        await _context.SaveChangesAsync();

        return new OrderResponse
        {
            Id = order.Id,

            TotalAmount =
                order.TotalAmount,

            Status =
                order.Status,

            CreatedDate =
                order.CreatedDate
        };
    }


    public async Task<bool> DeleteOrderAsync(
    int userId,
    int orderId)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(x =>
    x.Id == orderId &&
    x.UserId == userId &&
    new[]
    {
        "Delivered",
        "Returned",
        "Cancelled"
    }.Contains(x.Status));

        if (order == null)
            return false;

        var orderItems = await _context.OrderItems
            .Where(x => x.OrderId == orderId)
            .ToListAsync();

        _context.OrderItems.RemoveRange(orderItems);

        _context.Orders.Remove(order);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CancelOrderAsync(
    int userId,
    int orderId)
    {
        var order = await _context.Orders
            .Include(x => x.OrderItems)
            .FirstOrDefaultAsync(x =>
                x.Id == orderId &&
                x.UserId == userId);

        if (order == null)
            return false;

        // Only allow cancellation before delivery starts
        if (order.Status != "Pending" &&
            order.Status != "Assigned")
        {
            return false;
        }

        // Restore stock for all items
        foreach (var item in order.OrderItems)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(
                    x => x.Id == item.ProductId);

            if (product != null)
            {
                product.Stock += item.Quantity;
            }
        }

        order.Status = "Cancelled";

        await _context.SaveChangesAsync();

        return true;
    }
}