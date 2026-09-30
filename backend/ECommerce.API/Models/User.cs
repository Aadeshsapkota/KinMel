namespace ECommerce.API.Models;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "User";

    public string? GoogleId { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public ICollection<Order> Orders { get; set; } = new List<Order>();

    public ICollection<Order> AssignedOrders { get; set; } = new List<Order>();

    public ICollection<Review> Reviews
    {
        get;
        set;
    } = new List<Review>();

    public string PhoneNumber { get; set; } = string.Empty;

    public ICollection<UserAddress> Addresses { get; set; } = new List<UserAddress>();
}