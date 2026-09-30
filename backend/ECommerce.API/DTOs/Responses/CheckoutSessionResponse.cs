namespace ECommerce.API.DTOs.Responses;

public class CheckoutSessionResponse
{
    public string SessionId { get; set; }
        = string.Empty;

    public string Url { get; set; }
        = string.Empty;
}