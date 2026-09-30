using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface ICartService
{
    Task<IEnumerable<CartItemResponse>> GetCartAsync(int userId);

    Task<CartItemResponse> AddToCartAsync(
        int userId,
        AddToCartRequest request);

    Task<CartItemResponse?> UpdateCartItemAsync(
        int cartItemId,
        UpdateCartItemRequest request);

    Task<bool> RemoveCartItemAsync(int cartItemId);
}