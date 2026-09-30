namespace ECommerce.API.DTOs.Responses;

public class DeliveryOrderResponse
{
    public int OrderId { get; set; }

    public string CustomerName { get; set; }
        = string.Empty;

    public string PhoneNumber { get; set; }
        = string.Empty;
    
    public string Address { get; set; }
        = string.Empty;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; }
        = string.Empty;
}