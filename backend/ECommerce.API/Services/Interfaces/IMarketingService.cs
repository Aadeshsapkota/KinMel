using ECommerce.API.DTOs.Requests;

namespace ECommerce.API.Services.Interfaces;

public interface IMarketingService
{
    Task SendCampaignAsync(
        SendMarketingCampaignRequest request);
}