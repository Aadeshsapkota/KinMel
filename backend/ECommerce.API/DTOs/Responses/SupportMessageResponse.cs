namespace ECommerce.API.DTOs.Responses;

public class SupportMessageResponse
{
    public int Id { get; set; }

    public int SenderId { get; set; }

    public string SenderName { get; set; }
        = string.Empty;

    public string Message { get; set; }
        = string.Empty;

    public DateTime CreatedAt { get; set; }
}