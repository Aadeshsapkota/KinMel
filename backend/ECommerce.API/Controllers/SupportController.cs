using System.Security.Claims;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/support")]
[Authorize]
public class SupportController : ControllerBase
{
    private readonly ISupportTicketService
        _supportTicketService;

    public SupportController(
        ISupportTicketService supportTicketService)
    {
        _supportTicketService =
            supportTicketService;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }

    [HttpPost("tickets")]
    public async Task<IActionResult>
    CreateTicket(
        CreateSupportTicketRequest request)
    {
        var result =
            await _supportTicketService
                .CreateTicketAsync(
                    GetUserId(),
                    request);

        return Ok(result);
    }

    [HttpGet("tickets")]
    public async Task<IActionResult>
    GetMyTickets()
    {
        return Ok(
            await _supportTicketService
                .GetUserTicketsAsync(
                    GetUserId()));
    }

    [HttpGet("tickets/{id}")]
    public async Task<IActionResult>
    GetTicket(
        int id)
    {
        var ticket =
            await _supportTicketService
                .GetTicketAsync(id);

        if (ticket == null)
            return NotFound();

        return Ok(ticket);
    }

    [HttpPost("tickets/{id}/messages")]
    public async Task<IActionResult>
    AddMessage(
        int id,
        CreateSupportMessageRequest request)
    {
        await _supportTicketService
            .AddMessageAsync(
                GetUserId(),
                id,
                request);

        return Ok(
            new
            {
                Message =
                    "Reply added."
            });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin/tickets")]
    public async Task<IActionResult>
    GetAllTickets()
    {
        return Ok(
            await _supportTicketService
                .GetAllTicketsAsync());
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("admin/tickets/{id}/close")]
    public async Task<IActionResult>
    CloseTicket(
        int id)
    {
        await _supportTicketService
            .CloseTicketAsync(id);

        return Ok(
            new
            {
                Message =
                    "Ticket closed."
            });
    }
}