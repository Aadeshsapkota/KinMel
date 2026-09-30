namespace ECommerce.API.DTOs.Responses;

public class SellerOrderResponse
{
    public int OrderId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; }

    public string Status { get; set; } = string.Empty;

    public decimal SellerTotal { get; set; }

    public List<SellerOrderItemResponse> Items { get; set; } = new();
}

public class SellerOrderItemResponse
{
    public string ProductName { get; set; } = string.Empty;

    public string ProductImage { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public decimal Total { get; set; }
}
