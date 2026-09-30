using System.Security.Claims;
using ECommerce.API.Common;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private int GetUserId()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        return int.Parse(userId!);
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();

        var cart =
            await _cartService.GetCartAsync(userId);

        return Ok(cart);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart(
        AddToCartRequest request)
    {
        var userId = GetUserId();

        var result =
            await _cartService.AddToCartAsync(
                userId,
                request);

        return Ok(new ApiResponse<CartItemResponse>
        {
            Success = true,
            Message = "Item added to cart.",
            Data = result
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCartItem(
        int id,
        UpdateCartItemRequest request)
    {
        var result =
            await _cartService.UpdateCartItemAsync(
                id,
                request);

        if (result is null)
            return NotFound();

        return Ok(new ApiResponse<CartItemResponse>
        {
            Success = true,
            Message = "Cart updated successfully.",
            Data = result
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveCartItem(
        int id)
    {
        var deleted =
            await _cartService.RemoveCartItemAsync(id);

        if (!deleted)
            return NotFound();

        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Item removed from cart."
        });
    }
}