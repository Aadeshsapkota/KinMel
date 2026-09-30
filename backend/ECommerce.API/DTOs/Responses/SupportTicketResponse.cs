namespace ECommerce.API.DTOs.Responses;

public class SupportTicketResponse
{
    public int Id { get; set; }

    public string Subject { get; set; }
        = string.Empty;

    public string Status { get; set; }
        = string.Empty;

    public string CustomerName { get; set; }
        = string.Empty;

    public DateTime CreatedAt { get; set; }

    public List<SupportMessageResponse>
        Messages
    { get; set; }
            = new();
}