namespace ECommerce.API.DTOs.Responses;

public class SellerResponse
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? LogoUrl { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string UserEmail { get; set; } = string.Empty;

    public int UserId { get; set; }

    public bool IsApproved { get; set; }

    public bool IsSuspended { get; set; }

    public DateTime CreatedDate { get; set; }

    public int TotalProducts { get; set; }

    public decimal TotalRevenue { get; set; }
}
