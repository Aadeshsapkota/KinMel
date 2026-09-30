namespace ECommerce.API.Models;

public class PendingOrder
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string AddressLine1 { get; set; } = string.Empty;

    public string AddressLine2 { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string PostalCode { get; set; } = string.Empty;

    public string PaymentMethod { get; set; } = "eSewa";

    public string TransactionUuid { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public DateTime CreatedDate { get; set; }
        = DateTime.UtcNow;

    public ICollection<PendingOrderItem>
        PendingOrderItems { get; set; }
        = new List<PendingOrderItem>();
}