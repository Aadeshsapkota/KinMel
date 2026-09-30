using ECommerce.API.DTOs.Responses;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.Models;
namespace ECommerce.API.Services.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderResponse>> GetOrdersAsync(
        int userId);

    Task<OrderDetailsResponse?> GetOrderByIdAsync(
    int userId,
    int orderId);



    Task<OrderResponse> CreateOrderAsync(
        int userId,
        CheckoutRequest request);

    Task<OrderResponse> CreateOrderFromPendingOrderAsync(
    PendingOrder pendingOrder);


    Task<bool> DeleteOrderAsync(
    int userId,
    int orderId);

    Task<bool> CancelOrderAsync(
    int userId,
    int orderId);
}