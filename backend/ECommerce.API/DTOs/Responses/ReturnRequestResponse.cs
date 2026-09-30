namespace ECommerce.API.DTOs.Responses;

public class ReturnRequestResponse
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; }
        = string.Empty;

    public string Reason { get; set; }
        = string.Empty;

    public string Status { get; set; }
        = string.Empty;

    public DateTime RequestedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public string CustomerName { get; set; }
        = string.Empty;
}