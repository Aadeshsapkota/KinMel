namespace ECommerce.API.DTOs.Responses;

public class EsewaCheckoutResponse
{
    public string PaymentUrl { get; set; } = string.Empty;
    public Dictionary<string, string> FormData { get; set; } = new();
}