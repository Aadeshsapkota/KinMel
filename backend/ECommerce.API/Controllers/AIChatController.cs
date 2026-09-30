using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AIChatController : ControllerBase
    {
        private readonly IAIShoppingAssistantService _aiService;

        public AIChatController(IAIShoppingAssistantService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> ProcessChat([FromBody] AIChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { message = "Message cannot be empty." });
            }

            int? userId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (int.TryParse(idClaim, out var id))
                {
                    userId = id;
                }
            }

            try
            {
                var response = await _aiService.ProcessChatAsync(request, userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while communicating with the AI assistant.", details = ex.Message });
            }
        }
    }
}
