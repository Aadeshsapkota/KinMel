using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface IDeliveryService
{
    Task AssignOrderAsync(
        int orderId,
        int deliveryAgentId);

    Task<IEnumerable<DeliveryOrderResponse>>
        GetAssignedOrdersAsync(
            int deliveryAgentId);

    Task SendOtpAsync(
    int orderId);

    Task VerifyOtpAsync(
        int orderId,
        string otp);

    Task<IEnumerable<DeliveryAgentResponse>>
    GetDeliveryAgentsAsync();

    Task MarkOutForDeliveryAsync(
    int orderId);

    Task<IEnumerable<AdminDeliveryResponse>>
    GetAllDeliveriesAsync();
}