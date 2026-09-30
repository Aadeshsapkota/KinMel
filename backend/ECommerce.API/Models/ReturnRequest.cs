namespace ECommerce.API.Models;

public class ReturnRequest
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order? Order { get; set; }

    public int ProductId { get; set; }

    public Product? Product { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public string Reason { get; set; }
        = string.Empty;

    public string Status { get; set; }
        = "Pending";

    public DateTime RequestedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime? ProcessedAt { get; set; }
}