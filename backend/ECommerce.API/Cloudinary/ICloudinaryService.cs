namespace ECommerce.API.Cloudinary;

public interface ICloudinaryService
{
    Task<string> UploadImageAsync(IFormFile file);
}