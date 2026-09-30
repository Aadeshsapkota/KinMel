namespace ECommerce.API.DTOs.Requests;

public class UpdateCategoryRequest
{
    public string Name { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string IconName { get; set; } = "category";
}