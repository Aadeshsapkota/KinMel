namespace ECommerce.API.DTOs.Responses;

public class AdminOrderDetailsResponse
{
    public int Id { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerEmail { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public List<AdminOrderItemResponse> Items { get; set; }
        = new();
}

public class AdminOrderItemResponse
{
    public string ProductName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal Price { get; set; }
}