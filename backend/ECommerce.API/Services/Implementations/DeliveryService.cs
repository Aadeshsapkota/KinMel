using ECommerce.API.Data;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using ECommerce.API.Email;
using ECommerce.API.Models;

namespace ECommerce.API.Services.Implementations;

public class DeliveryService : IDeliveryService
{
    private readonly ApplicationDbContext _context;

    private readonly IEmailService _emailService;

    public DeliveryService(
    ApplicationDbContext context,
    IEmailService emailService)
    {
        _context = context;

        _emailService = emailService;
    }

    public async Task AssignOrderAsync(
        int orderId,
        int deliveryAgentId)
    {
        var order =
            await _context.Orders
                .FirstOrDefaultAsync(
                    x => x.Id == orderId);

        if (order == null)
            throw new Exception(
                "Order not found.");

        var deliveryAgent =
            await _context.Users
                .FirstOrDefaultAsync(
                    x =>
                        x.Id == deliveryAgentId &&
                        x.Role == "DeliveryAgent");

        if (deliveryAgent == null)
            throw new Exception(
                "Delivery agent not found.");

        order.DeliveryAgentId =
            deliveryAgentId;

        order.Status =
            "Assigned";

        await _context.SaveChangesAsync();
    }

    public async Task<
        IEnumerable<DeliveryOrderResponse>>
        GetAssignedOrdersAsync(
            int deliveryAgentId)
    {
        return await _context.Orders
            .Where(x =>
                x.DeliveryAgentId ==
                deliveryAgentId)
            .Select(x =>
                new DeliveryOrderResponse
                {
                    OrderId = x.Id,

                    CustomerName =
                        x.FullName,

                    PhoneNumber =
                        x.PhoneNumber,

                    Address =
                        $"{x.AddressLine1}, {x.City}, {x.State}",

                    TotalAmount =
                        x.TotalAmount,

                    Status =
                        x.Status
                })
            .ToListAsync();
    }

    public async Task SendOtpAsync(
    int orderId)
    {
        var order =
            await _context.Orders
                .Include(x => x.User)
                .FirstOrDefaultAsync(
                    x => x.Id == orderId);

        if (order == null)
            throw new Exception(
                "Order not found.");

        var otp =
            Random.Shared
                .Next(100000, 999999)
                .ToString();

        var otpHash =
            BCrypt.Net.BCrypt
                .HashPassword(otp);

        _context.DeliveryOtps.Add(
            new DeliveryOtp
            {
                OrderId = orderId,

                Otp = otpHash,

                ExpiresAt =
                    DateTime.UtcNow
                        .AddMinutes(10),

                IsUsed = false
            });

        await _context.SaveChangesAsync();

        var body = $@"
        <h2>Delivery OTP</h2>
        <p>Your delivery OTP is:</p>
        <h1>{otp}</h1>
        <p>Expires in 10 minutes.</p>";

        await _emailService.SendEmailAsync(
            order.User!.Email,
            "Velocity.Shop Delivery OTP",
            body);
    }

    public async Task VerifyOtpAsync(
    int orderId,
    string otp)
    {
        var record =
            await _context.DeliveryOtps
                .Where(x =>
                    x.OrderId == orderId &&
                    !x.IsUsed)
                .OrderByDescending(
                    x => x.Id)
                .FirstOrDefaultAsync();

        if (record == null)
            throw new Exception(
                "OTP not found.");

        if (record.ExpiresAt <
            DateTime.UtcNow)
        {
            throw new Exception(
                "OTP expired.");
        }

        var isValid =
            BCrypt.Net.BCrypt.Verify(
                otp,
                record.Otp);

        if (!isValid)
        {
            throw new Exception(
                "Invalid OTP.");
        }

        var order =
            await _context.Orders
                .FirstOrDefaultAsync(
                    x => x.Id == orderId);

        if (order == null)
            throw new Exception(
                "Order not found.");

        order.Status =
            "Delivered";

        order.DeliveredAt =
            DateTime.UtcNow;

        record.IsUsed = true;

        await _context.SaveChangesAsync();
    }

    public async Task<
    IEnumerable<DeliveryAgentResponse>>
    GetDeliveryAgentsAsync()
    {
        return await _context.Users
            .Where(x =>
                x.Role ==
                "DeliveryAgent")
            .Select(x =>
                new DeliveryAgentResponse
                {
                    Id = x.Id,

                    Name = x.Name,

                    Email = x.Email
                })
            .ToListAsync();
    }


    public async Task
    MarkOutForDeliveryAsync(
        int orderId)
    {
        var order =
            await _context.Orders
                .FirstOrDefaultAsync(
                    x => x.Id == orderId);

        if (order == null)
            throw new Exception(
                "Order not found.");

        order.Status =
            "OutForDelivery";

        await _context.SaveChangesAsync();
    }

    public async Task<
IEnumerable<AdminDeliveryResponse>>
GetAllDeliveriesAsync()
    {
        return await _context.Orders

            .Include(x =>
                x.DeliveryAgent)

            .Select(x =>
                new AdminDeliveryResponse
                {
                    OrderId =
                        x.Id,


                    CustomerName =
                        x.FullName,


                    TotalAmount =
                        x.TotalAmount,


                    Status =
                        x.Status,


                    DeliveryAgentId =
                        x.DeliveryAgentId,


                    DeliveryAgentName =
                        x.DeliveryAgent != null
                        ?
                        x.DeliveryAgent.Name
                        :
                        "Not Assigned"
                })

            .ToListAsync();
    }
}