using System.Security.Claims;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeliveryController : ControllerBase
{
    private readonly IDeliveryService _deliveryService;

    public DeliveryController(
        IDeliveryService deliveryService)
    {
        _deliveryService = deliveryService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("orders/{orderId}/assign")]
    public async Task<IActionResult> AssignOrder(
        int orderId,
        AssignDeliveryAgentRequest request)
    {
        await _deliveryService.AssignOrderAsync(
            orderId,
            request.DeliveryAgentId);

        return Ok(
            new
            {
                Message =
                    "Order assigned successfully."
            });
    }

    [Authorize(Roles = "DeliveryAgent")]
    [HttpGet("orders")]
    public async Task<IActionResult> GetAssignedOrders()
    {
        var deliveryAgentId =
            int.Parse(
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)!);

        var orders =
            await _deliveryService
                .GetAssignedOrdersAsync(
                    deliveryAgentId);

        return Ok(orders);
    }

    [Authorize(Roles = "DeliveryAgent")]
    [HttpPost("orders/{orderId}/send-otp")]
    public async Task<IActionResult> SendOtp(
    int orderId)
    {
        await _deliveryService.SendOtpAsync(
            orderId);

        return Ok(
            new
            {
                Message =
                    "OTP sent successfully."
            });
    }


    [Authorize(Roles = "DeliveryAgent")]
    [HttpPost("orders/{orderId}/verify-otp")]
    public async Task<IActionResult> VerifyOtp(
    int orderId,
    VerifyDeliveryOtpRequest request)
    {
        await _deliveryService.VerifyOtpAsync(
            orderId,
            request.Otp);

        return Ok(
            new
            {
                Message =
                    "Delivery confirmed."
            });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("agents")]
    public async Task<IActionResult>
GetAgents()
    {
        var agents =
            await _deliveryService
                .GetDeliveryAgentsAsync();

        return Ok(agents);
    }

    [Authorize(Roles = "DeliveryAgent")]
    [HttpPost("orders/{orderId}/start")]
    public async Task<IActionResult>
StartDelivery(
    int orderId)
    {
        await _deliveryService
            .MarkOutForDeliveryAsync(
                orderId);

        return Ok(
            new
            {
                Message =
                    "Delivery started."
            });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("orders/all")]
    public async Task<IActionResult>
GetAllDeliveries()
    {
        var deliveries =
            await _deliveryService
                .GetAllDeliveriesAsync();


        return Ok(deliveries);
    }


}

