namespace ECommerce.API.DTOs.Requests;

public class UpdateProfileRequest
{
    public string Name { get; set; }
        = string.Empty;

    public string PhoneNumber { get; set; }
        = string.Empty;
}