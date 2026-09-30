namespace ECommerce.API.DTOs.Responses;

public class CategoryResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string IconName { get; set; } = string.Empty;


    public string ImageUrl { get; set; } = string.Empty;
}