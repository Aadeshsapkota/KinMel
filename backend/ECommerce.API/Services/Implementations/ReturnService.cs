using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Implementations;

public class ReturnService : IReturnService
{
    private readonly ApplicationDbContext _context;

    public ReturnService(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ReturnRequestResponse>
    CreateReturnRequestAsync(
        int userId,
        CreateReturnRequest request)
    {
        var order =
            await _context.Orders
                .FirstOrDefaultAsync(x =>
                    x.Id == request.OrderId &&
                    x.UserId == userId);

        if (order == null)
            throw new Exception(
                "Order not found.");

        if (order.Status != "Delivered")
            throw new Exception(
                "Only delivered orders can be returned.");

        var orderItem =
            await _context.OrderItems
                .FirstOrDefaultAsync(x =>
                    x.OrderId == request.OrderId &&
                    x.ProductId == request.ProductId);

        if (orderItem == null)
        {
            throw new Exception(
                "Product does not belong to this order.");
        }

        var existingRequest =
            await _context.ReturnRequests
                .AnyAsync(x =>
                    x.OrderId == request.OrderId &&
                    x.ProductId == request.ProductId &&
                    x.UserId == userId &&
                    (
                        x.Status == "Pending" ||
                        x.Status == "Approved"
                    ));

        if (existingRequest)
        {
            throw new Exception(
                "A return request already exists for this item.");
        }

        var returnRequest =
            new ReturnRequest
            {
                OrderId = request.OrderId,

                ProductId = request.ProductId,

                UserId = userId,

                Reason = request.Reason
            };

        _context.ReturnRequests.Add(
            returnRequest);
        order.Status = "ReturnRequested";

        await _context.SaveChangesAsync();

        var product =
            await _context.Products
                .FirstOrDefaultAsync(
                    x => x.Id ==
                    request.ProductId);

        return new ReturnRequestResponse
        {
            Id = returnRequest.Id,

            OrderId =
                returnRequest.OrderId,

            ProductId =
                returnRequest.ProductId,

            ProductName =
                product?.Name ??
                "Unknown Product",

            Reason =
                returnRequest.Reason,

            Status =
                returnRequest.Status,

            RequestedAt =
                returnRequest.RequestedAt
        };
    }

    public async Task<
IEnumerable<ReturnRequestResponse>>
GetAllReturnRequestsAsync()
    {
        return await _context.ReturnRequests
            .Include(x => x.Product)
            .Include(x => x.User)
            .OrderByDescending(x => x.RequestedAt)
            .Select(x =>
                new ReturnRequestResponse
                {
                    Id = x.Id,

                    OrderId = x.OrderId,

                    ProductId = x.ProductId,

                    ProductName =
                        x.Product != null
                        ? x.Product.Name
                        : "Unknown Product",

                    Reason = x.Reason,

                    Status = x.Status,

                    RequestedAt =
                        x.RequestedAt,

                    ProcessedAt =
                        x.ProcessedAt,

                    CustomerName =
                        x.User != null
                        ? x.User.Name
                        : "Unknown"
                })
            .ToListAsync();
    }

    public async Task
ApproveReturnAsync(
    int returnRequestId)
    {
        var request =
            await _context.ReturnRequests
                .FirstOrDefaultAsync(
                    x => x.Id ==
                    returnRequestId);

        if (request == null)
            throw new Exception(
                "Return request not found.");

        if (request.Status != "Pending")
            throw new Exception(
                "Request already processed.");

        var orderItem =
            await _context.OrderItems
                .FirstOrDefaultAsync(x =>
                    x.OrderId ==
                    request.OrderId &&

                    x.ProductId ==
                    request.ProductId);

        if (orderItem == null)
            throw new Exception(
                "Order item not found.");

        var product =
            await _context.Products
                .FirstOrDefaultAsync(
                    x => x.Id ==
                    request.ProductId);

        if (product == null)
            throw new Exception(
                "Product not found.");

        product.Stock +=
            orderItem.Quantity;

        var order =
    await _context.Orders
        .FirstOrDefaultAsync(
            x => x.Id ==
            request.OrderId);

        if (order != null)
        {
            order.Status =
                "Returned";
        }

        request.Status =
            "Approved";

        request.ProcessedAt =
            DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task
RejectReturnAsync(
    int returnRequestId)
    {
        var request =
            await _context.ReturnRequests
                .FirstOrDefaultAsync(
                    x => x.Id ==
                    returnRequestId);

        if (request == null)
            throw new Exception(
                "Return request not found.");

        if (request.Status != "Pending")
            throw new Exception(
                "Request already processed.");

        var order =
    await _context.Orders
        .FirstOrDefaultAsync(
            x => x.Id ==
            request.OrderId);

        if (order != null)
        {
            order.Status =
                "Delivered";
        }

        request.Status =
            "Rejected";

        request.ProcessedAt =
            DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }
}