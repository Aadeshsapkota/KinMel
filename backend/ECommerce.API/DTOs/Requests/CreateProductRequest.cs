namespace ECommerce.API.DTOs.Requests;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int CategoryId { get; set; }

    public decimal? CompareAtPrice { get; set; }
    public string? InstallmentPlan { get; set; }
    public List<string> Images { get; set; } = new List<string>();
    public string? Brand { get; set; }
    public bool IsActive { get; set; } = true;
    public string? SKU { get; set; }
    public bool TrackQuantity { get; set; } = true;
    public bool ContinueSellingWhenOutOfStock { get; set; } = false;
    public string? UrlHandle { get; set; }
    public string? MetaDescription { get; set; }
    public string? ProductType { get; set; }
    public string? Vendor { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public string? Variants { get; set; }
    public string? Specifications { get; set; }
    public List<string> Features { get; set; } = new List<string>();
}