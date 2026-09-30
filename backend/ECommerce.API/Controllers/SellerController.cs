using System.Security.Claims;
using ECommerce.API.Common;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/seller")]
[Authorize(Roles = "Seller")]
public class SellerController : ControllerBase
{
    private readonly ISellerService _sellerService;

    public SellerController(ISellerService sellerService)
    {
        _sellerService = sellerService;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var dashboard = await _sellerService
            .GetDashboardAsync(GetUserId());

        return Ok(dashboard);
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var seller = await _sellerService
            .GetSellerByUserIdAsync(GetUserId());

        if (seller is null)
            return NotFound();

        return Ok(seller);
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _sellerService
            .GetSellerProductsAsync(GetUserId());

        return Ok(products);
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct(
        CreateProductRequest request)
    {
        var result = await _sellerService
            .CreateProductAsync(GetUserId(), request);

        return Ok(new ApiResponse<ProductResponse>
        {
            Success = true,
            Message = "Product created successfully.",
            Data = result
        });
    }

    [HttpPut("products/{id}")]
    public async Task<IActionResult> UpdateProduct(
        int id, UpdateProductRequest request)
    {
        var result = await _sellerService
            .UpdateProductAsync(GetUserId(), id, request);

        if (result is null)
            return NotFound();

        return Ok(new ApiResponse<ProductResponse>
        {
            Success = true,
            Message = "Product updated successfully.",
            Data = result
        });
    }

    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var deleted = await _sellerService
            .DeleteProductAsync(GetUserId(), id);

        if (!deleted)
            return NotFound();

        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Product deleted successfully."
        });
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _sellerService
            .GetSellerOrdersAsync(GetUserId());

        return Ok(orders);
    }
}
