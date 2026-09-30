namespace ECommerce.API.Models;

public class DeliveryOtp
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public string Otp { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public bool IsUsed { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;
}