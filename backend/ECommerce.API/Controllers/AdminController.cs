using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.API.DTOs.Requests;
using System.Security.Claims;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly ISellerService _sellerService;

    public AdminController(
        IAdminService adminService,
        ISellerService sellerService)
    {
        _adminService = adminService;
        _sellerService = sellerService;
    }

    private int GetCurrentUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        return Ok(
            await _adminService.GetUsersAsync());
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        return Ok(
            await _adminService.GetOrdersAsync());
    }

    [HttpGet("orders/{id}")]
    public async Task<IActionResult>
    GetOrderById(int id)
    {
        var order =
            await _adminService.GetOrderByIdAsync(id);

        if (order is null)
            return NotFound();

        return Ok(order);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        return Ok(
            await _adminService.GetDashboardAsync());
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult>
        UpdateOrderStatus(
            int id,
            UpdateOrderStatusRequest request)
    {
        var success =
            await _adminService.UpdateOrderStatusAsync(
                id, request.Status);

        if (!success)
            return NotFound();

        return Ok();
    }

    [HttpPut("users/{id}/role")]
    public async Task<IActionResult>
    UpdateUserRole(int id, UpdateUserRoleRequest request)
    {
        var success =
            await _adminService.UpdateUserRoleAsync(
                GetCurrentUserId(), id, request.Role);

        if (!success)
            return NotFound();

        return Ok();
    }

    // ─── Seller Management ───

    [HttpGet("sellers")]
    public async Task<IActionResult> GetSellers()
    {
        return Ok(
            await _sellerService.GetAllSellersAsync());
    }

    [HttpPost("sellers")]
    public async Task<IActionResult> CreateSeller(
        CreateSellerRequest request)
    {
        var result = await _sellerService
            .CreateSellerAsync(request);

        return Ok(result);
    }

    [HttpPut("sellers/{id}")]
    public async Task<IActionResult> UpdateSeller(
        int id, UpdateSellerRequest request)
    {
        var result = await _sellerService
            .UpdateSellerAsync(id, request);

        if (result is null)
            return NotFound();

        return Ok(result);
    }

    [HttpDelete("sellers/{id}")]
    public async Task<IActionResult> DeleteSeller(int id)
    {
        var deleted = await _sellerService
            .DeleteSellerAsync(id);

        if (!deleted)
            return NotFound();

        return Ok();
    }
}