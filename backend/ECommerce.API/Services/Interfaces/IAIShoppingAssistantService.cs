using System.Threading.Tasks;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces
{
    public interface IAIShoppingAssistantService
    {
        Task<AIChatResponse> ProcessChatAsync(AIChatRequest request, int? userId);
    }
}
