namespace ECommerce.API.DTOs.Requests;

public class UpdateSellerRequest
{
    public string CompanyName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? LogoUrl { get; set; }

    public bool IsApproved { get; set; }

    public bool IsSuspended { get; set; }
}
