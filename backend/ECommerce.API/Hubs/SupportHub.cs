using Microsoft.AspNetCore.SignalR;

namespace ECommerce.API.Hubs;

public class SupportHub : Hub
{
    public async Task JoinTicket(
        string ticketId)
    {
        await Groups.AddToGroupAsync(
            Context.ConnectionId,
            $"ticket-{ticketId}");
    }

    public async Task LeaveTicket(
        string ticketId)
    {
        await Groups.RemoveFromGroupAsync(
            Context.ConnectionId,
            $"ticket-{ticketId}");
    }
}