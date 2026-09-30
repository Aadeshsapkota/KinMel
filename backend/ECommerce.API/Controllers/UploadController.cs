using ECommerce.API.Cloudinary;
using ECommerce.API.Common;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly ICloudinaryService _cloudinaryService;

    public UploadController(
        ICloudinaryService cloudinaryService)
    {
        _cloudinaryService = cloudinaryService;
    }

    [HttpPost]
    public async Task<IActionResult> Upload(
        IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(
                new ApiResponse<string>
                {
                    Success = false,
                    Message = "No file provided."
                });
        }

        var imageUrl =
            await _cloudinaryService
                .UploadImageAsync(file);

        return Ok(
            new ApiResponse<string>
            {
                Success = true,
                Message = "Image uploaded successfully.",
                Data = imageUrl
            });
    }
}