namespace ECommerce.API.DTOs.Requests;

public class CreateSellerRequest
{
    public string CompanyName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? LogoUrl { get; set; }

    public int UserId { get; set; }
}
