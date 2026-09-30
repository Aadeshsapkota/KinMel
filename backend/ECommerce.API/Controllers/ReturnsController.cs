using System.Security.Claims;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReturnsController : ControllerBase
{
    private readonly IReturnService _returnService;

    public ReturnsController(
        IReturnService returnService)
    {
        _returnService = returnService;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }

    [HttpPost]
    public async Task<IActionResult>
    CreateReturnRequest(
        CreateReturnRequest request)
    {
        var result =
            await _returnService
                .CreateReturnRequestAsync(
                    GetUserId(),
                    request);

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult>
GetAll()
    {
        return Ok(
            await _returnService
                .GetAllReturnRequestsAsync());
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/approve")]
    public async Task<IActionResult>
Approve(int id)
    {
        await _returnService
            .ApproveReturnAsync(id);

        return Ok(
            new
            {
                Message =
                    "Return approved."
            });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/reject")]
    public async Task<IActionResult>
Reject(int id)
    {
        await _returnService
            .RejectReturnAsync(id);

        return Ok(
            new
            {
                Message =
                    "Return rejected."
            });
    }
}