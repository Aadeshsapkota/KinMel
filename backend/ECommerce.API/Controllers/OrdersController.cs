using System.Security.Claims;
using ECommerce.API.Common;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.API.DTOs.Requests;
namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(
        IOrderService orderService)
    {
        _orderService = orderService;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        return Ok(
            await _orderService.GetOrdersAsync(
                GetUserId()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(
        int id)
    {
        var order =
            await _orderService.GetOrderByIdAsync(
                GetUserId(),
                id);

        if (order is null)
            return NotFound();

        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(
    CheckoutRequest request)
    {
        var result =
            await _orderService.CreateOrderAsync(
                GetUserId(),
                request);

        return Ok(
            new ApiResponse<OrderResponse>
            {
                Success = true,
                Message = "Order created successfully.",
                Data = result
            });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(
    int id)
    {
        var deleted =
            await _orderService.DeleteOrderAsync(
                GetUserId(),
                id);

        if (!deleted)
            return BadRequest(
                "Only delivered, returned or cancelled orders can be deleted.");

        return Ok();
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelOrder(int id)
    {
        var cancelled = await _orderService.CancelOrderAsync(GetUserId(), id);

        if (!cancelled)
            return BadRequest("Order cannot be cancelled. It may have already been dispatched or does not exist.");

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Message = "Order cancelled successfully.",
            Data = true
        });
    }
}