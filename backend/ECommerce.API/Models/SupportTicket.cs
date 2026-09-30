namespace ECommerce.API.Models;

public class SupportTicket
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public string Subject { get; set; }
        = string.Empty;

    public string Status { get; set; }
        = "Open";

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime? ClosedAt { get; set; }

    public ICollection<SupportMessage>
        Messages { get; set; }
            = new List<SupportMessage>();
}