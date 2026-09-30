namespace ECommerce.API.Models;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Stock { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public int CategoryId { get; set; }

    public Category? Category { get; set; }

    // --- New Advanced Fields ---
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
    public string? Variants { get; set; } // JSON string representation
    public string? Specifications { get; set; } // JSON string representation
    public List<string> Features { get; set; } = new List<string>();

    public int? SellerId { get; set; }

    public Seller? Seller { get; set; }

    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}