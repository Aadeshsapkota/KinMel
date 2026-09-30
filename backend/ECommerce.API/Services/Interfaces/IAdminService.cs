using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<UserResponse>> GetUsersAsync();

    Task<IEnumerable<OrderResponse>> GetOrdersAsync();

    Task<AdminOrderDetailsResponse?>
    GetOrderByIdAsync(
        int id
    );

    Task<bool> UpdateOrderStatusAsync(
    int orderId,
    string status




);


    Task<bool> UpdateUserRoleAsync(
        int currentUserId,
        int userId,
        string role
    );

    Task<DashboardResponse> GetDashboardAsync();
}