namespace ECommerce.API.Esewa;

public class EsewaSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string ProductCode { get; set; } = string.Empty;
    public string PaymentUrl { get; set; } = string.Empty;
    public string StatusUrl { get; set; } = string.Empty;
    public string SuccessUrl { get; set; } = string.Empty;
    public string FailureUrl { get; set; } = string.Empty;
}