using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace ECommerce.API.Cloudinary;

public class CloudinaryService : ICloudinaryService
{
    private readonly CloudinaryDotNet.Cloudinary _cloudinary;

    public CloudinaryService(CloudinarySettings settings)
    {
        var account = new Account(
            settings.CloudName,
            settings.ApiKey,
            settings.ApiSecret);

        _cloudinary = new CloudinaryDotNet.Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(IFormFile file)
    {
        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(
                file.FileName,
                stream)
        };

        var result =
            await _cloudinary.UploadAsync(uploadParams);

        return result.SecureUrl.ToString();
    }
}