namespace ECommerce.API.DTOs.Responses;

public class OrderDetailsResponse
{
    public int Id { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; }
        = string.Empty;

    public string PaymentStatus { get; set; }
        = string.Empty;

    public string PaymentMethod { get; set; }
        = string.Empty;

    public string FullName { get; set; }
        = string.Empty;

    public string PhoneNumber { get; set; }
        = string.Empty;

    public string AddressLine1 { get; set; }
        = string.Empty;

    public string AddressLine2 { get; set; }
        = string.Empty;

    public string City { get; set; }
        = string.Empty;

    public string State { get; set; }
        = string.Empty;

    public string Country { get; set; }
        = string.Empty;

    public string PostalCode { get; set; }
        = string.Empty;

    public DateTime CreatedDate { get; set; }

    public List<OrderItemResponse> Items
        { get; set; } = new();
}