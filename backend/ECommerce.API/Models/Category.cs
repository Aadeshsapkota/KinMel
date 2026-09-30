namespace ECommerce.API.Models;

public class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
    public string IconName { get; set; } = "category";

    public ICollection<Product> Products { get; set; } = new List<Product>();
}