using ECommerce.API.DTOs.Requests;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/marketing")]
[Authorize(Roles = "Admin")]
public class MarketingController
    : ControllerBase
{
    private readonly IMarketingService
        _marketingService;

    public MarketingController(
        IMarketingService marketingService)
    {
        _marketingService =
            marketingService;
    }

    [HttpPost("campaign")]
    public async Task<IActionResult>
    SendCampaign(
        SendMarketingCampaignRequest request)
    {
        await _marketingService
            .SendCampaignAsync(request);

        return Ok(
            new
            {
                Success = true,
                Message =
                    "Campaign sent successfully."
            });
    }
}