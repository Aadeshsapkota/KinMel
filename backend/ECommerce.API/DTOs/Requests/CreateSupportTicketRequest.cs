namespace ECommerce.API.DTOs.Requests;

public class CreateSupportTicketRequest
{
    public string Subject { get; set; }
        = string.Empty;

    public string Message { get; set; }
        = string.Empty;
}