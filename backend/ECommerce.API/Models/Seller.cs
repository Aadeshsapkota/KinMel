namespace ECommerce.API.Models;

public class Seller
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? LogoUrl { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public bool IsApproved { get; set; } = true;

    public bool IsSuspended { get; set; } = false;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
