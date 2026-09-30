namespace ECommerce.API.DTOs.Responses;

public class SellerDashboardResponse
{
    public int TotalProducts { get; set; }

    public int TotalOrders { get; set; }

    public decimal TotalRevenue { get; set; }

    public List<SellerOrderResponse> RecentOrders { get; set; } = new();
}
