using System.Security.Claims;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(
        IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }

    [HttpPost("create-session")]
    public async Task<IActionResult>
        CreateSession(
            CheckoutRequest request)
    {
        var result =
            await _paymentService
                .CreateCheckoutSessionAsync(
                    GetUserId(),
                    request);

        return Ok(result);
    }

    [HttpPost("confirm/{sessionId}")]
    public async Task<IActionResult>
        ConfirmPayment(
            string sessionId)
    {
        var success =
            await _paymentService
                .ConfirmPaymentAsync(
                    sessionId);

        return Ok(success);
    }
}