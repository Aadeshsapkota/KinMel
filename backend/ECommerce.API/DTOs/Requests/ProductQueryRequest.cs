namespace ECommerce.API.DTOs.Requests;

public class ProductQueryRequest
{
    public string? Search { get; set; }

    public List<int>? CategoryIds { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}