namespace ECommerce.API.Models;

public class SupportMessage
{
    public int Id { get; set; }

    public int TicketId { get; set; }

    public SupportTicket? Ticket { get; set; }

    public int SenderId { get; set; }

    public User? Sender { get; set; }

    public string Message { get; set; }
        = string.Empty;

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;
}