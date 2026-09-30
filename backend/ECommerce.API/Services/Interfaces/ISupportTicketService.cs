using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface ISupportTicketService
{
    Task<SupportTicketResponse>
        CreateTicketAsync(
            int userId,
            CreateSupportTicketRequest request);

    Task<IEnumerable<SupportTicketResponse>>
        GetUserTicketsAsync(
            int userId);

    Task<IEnumerable<SupportTicketResponse>>
        GetAllTicketsAsync();

    Task<SupportTicketResponse?>
        GetTicketAsync(
            int ticketId);

    Task AddMessageAsync(
        int senderId,
        int ticketId,
        CreateSupportMessageRequest request);

    Task CloseTicketAsync(
        int ticketId);
}