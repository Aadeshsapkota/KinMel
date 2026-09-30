namespace ECommerce.API.DTOs.Responses;

public class AdminDeliveryResponse
{
    public int OrderId { get; set; }

    public string CustomerName { get; set; }
        = string.Empty;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; }
        = string.Empty;


    public int? DeliveryAgentId { get; set; }


    public string DeliveryAgentName { get; set; }
        = "Not Assigned";
}