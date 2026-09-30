using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using ECommerce.API.Hubs;
using Microsoft.AspNetCore.SignalR;
namespace ECommerce.API.Services.Implementations;

public class SupportTicketService
    : ISupportTicketService
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<
    SupportHub> _hub;

    public SupportTicketService(
    ApplicationDbContext context,
    IHubContext<SupportHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    public async Task<SupportTicketResponse>
        CreateTicketAsync(
            int userId,
            CreateSupportTicketRequest request)
    {
        var ticket =
            new SupportTicket
            {
                UserId = userId,
                Subject = request.Subject,
                Status = "Open"
            };

        _context.SupportTickets.Add(ticket);

        await _context.SaveChangesAsync();

        var message =
            new SupportMessage
            {
                TicketId = ticket.Id,
                SenderId = userId,
                Message = request.Message
            };

        _context.SupportMessages.Add(message);

        await _context.SaveChangesAsync();

        var user =
            await _context.Users
                .FirstAsync(x => x.Id == userId);

        return new SupportTicketResponse
        {
            Id = ticket.Id,
            Subject = ticket.Subject,
            Status = ticket.Status,
            CustomerName = user.Name,
            CreatedAt = ticket.CreatedAt
        };
    }

    public async Task<IEnumerable<
        SupportTicketResponse>>
        GetUserTicketsAsync(
            int userId)
    {
        return await _context.SupportTickets
            .Where(x => x.UserId == userId)
            .Select(x =>
                new SupportTicketResponse
                {
                    Id = x.Id,
                    Subject = x.Subject,
                    Status = x.Status,
                    CreatedAt = x.CreatedAt
                })
            .ToListAsync();
    }

    public async Task<IEnumerable<
        SupportTicketResponse>>
        GetAllTicketsAsync()
    {
        return await _context.SupportTickets
            .Include(x => x.User)
            .Select(x =>
                new SupportTicketResponse
                {
                    Id = x.Id,
                    Subject = x.Subject,
                    Status = x.Status,
                    CustomerName =
                        x.User != null
                            ? x.User.Name
                            : "Unknown",

                    CreatedAt =
                        x.CreatedAt
                })
            .ToListAsync();
    }

    public async Task<
        SupportTicketResponse?>
        GetTicketAsync(
            int ticketId)
    {
        var ticket =
            await _context.SupportTickets
                .Include(x => x.User)
                .Include(x => x.Messages)
                    .ThenInclude(x => x.Sender)
                .FirstOrDefaultAsync(
                    x => x.Id == ticketId);

        if (ticket == null)
            return null;

        return new SupportTicketResponse
        {
            Id = ticket.Id,

            Subject =
                ticket.Subject,

            Status =
                ticket.Status,

            CustomerName =
                ticket.User?.Name ??
                "Unknown",

            CreatedAt =
                ticket.CreatedAt,

            Messages =
                ticket.Messages
                    .OrderBy(x =>
                        x.CreatedAt)
                    .Select(x =>
                        new SupportMessageResponse
                        {
                            Id = x.Id,

                            SenderId =
                                x.SenderId,

                            SenderName =
                                x.Sender?.Name ??
                                "Unknown",

                            Message =
                                x.Message,

                            CreatedAt =
                                x.CreatedAt
                        })
                    .ToList()
        };
    }

    public async Task AddMessageAsync(
        int senderId,
        int ticketId,
        CreateSupportMessageRequest request)
    {
        var ticket =
            await _context.SupportTickets
                .FirstOrDefaultAsync(
                    x => x.Id == ticketId);

        if (ticket == null)
            throw new Exception(
                "Ticket not found.");

        if (ticket.Status == "Closed")
            throw new Exception(
                "Ticket is closed.");

        var message =
            new SupportMessage
            {
                TicketId = ticketId,

                SenderId = senderId,

                Message = request.Message
            };

        _context.SupportMessages.Add(
            message);

        await _context.SaveChangesAsync();

        var sender =
    await _context.Users
        .FirstOrDefaultAsync(
            x => x.Id == senderId);

        await _hub.Clients
            .Group($"ticket-{ticketId}")
            .SendAsync(
                "ReceiveMessage",
                new
                {
                    Id = message.Id,
                    SenderId = message.SenderId,
                    SenderName =
                        sender?.Name ??
                        "Unknown",
                    Message =
                        message.Message,
                    CreatedAt =
                        message.CreatedAt
                });
    }

    public async Task CloseTicketAsync(
        int ticketId)
    {
        var ticket =
            await _context.SupportTickets
                .FirstOrDefaultAsync(
                    x => x.Id == ticketId);

        if (ticket == null)
            throw new Exception(
                "Ticket not found.");

        ticket.Status =
            "Closed";

        ticket.ClosedAt =
            DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }
}