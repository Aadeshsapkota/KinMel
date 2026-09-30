namespace ECommerce.API.DTOs.Requests;

public class SendMarketingCampaignRequest
{
    public string Subject { get; set; }
        = string.Empty;

    public string Message { get; set; }
        = string.Empty;

    public string BannerImageUrl { get; set; }
        = string.Empty;
}