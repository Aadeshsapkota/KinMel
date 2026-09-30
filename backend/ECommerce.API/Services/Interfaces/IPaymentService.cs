using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface IPaymentService
{
    Task<EsewaCheckoutResponse> CreateCheckoutSessionAsync(int userId, CheckoutRequest request);
    Task<bool> ConfirmPaymentAsync(string transactionUuid);
}