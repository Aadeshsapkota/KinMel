namespace ECommerce.API.DTOs.Responses;

public class DashboardResponse
{
    public int TotalUsers { get; set; }

    public int TotalProducts { get; set; }

    public int TotalOrders { get; set; }

    public decimal TotalRevenue { get; set; }
}