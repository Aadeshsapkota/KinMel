using System.Security.Claims;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(
        IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetReviews(
        int productId)
    {
        var reviews =
            await _reviewService
                .GetReviewsByProductAsync(
                    productId);

        return Ok(reviews);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateReview(
        CreateReviewRequest request)
    {
        await _reviewService
            .CreateReviewAsync(
                GetUserId(),
                request);

        return Ok(new
        {
            Message =
                "Review added successfully."
        });
    }
}