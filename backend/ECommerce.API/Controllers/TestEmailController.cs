using ECommerce.API.Email;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/test-email")]
public class TestEmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public TestEmailController(
        IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpGet]
    public async Task<IActionResult> SendTest()
    {
        await _emailService.SendEmailAsync(
            "niyas36et@gmail.com",
            "Velocity Shop Test",
            "<h1>Email Working 🎉</h1><p>Brevo is configured correctly.</p>");

        return Ok(
            "Email sent successfully.");
    }
}