namespace ECommerce.API.DTOs.Responses;

public class OrderResponse
{
    public int Id { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public string ProductName { get; set; }
        = string.Empty;

    public string ProductImage { get; set; }
        = string.Empty;

    public int ItemCount { get; set; }

    public string CustomerName { get; set; }
        = string.Empty;
}