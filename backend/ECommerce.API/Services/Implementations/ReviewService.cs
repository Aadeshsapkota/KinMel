using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Implementations;

public class ReviewService : IReviewService
{
    private readonly ApplicationDbContext _context;

    public ReviewService(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CreateReviewAsync(
        int userId,
        CreateReviewRequest request)
    {
        var hasPurchased =
            await _context.OrderItems
                .AnyAsync(x =>
                    x.ProductId ==
                    request.ProductId &&
                    x.Order.UserId ==
                    userId);

        if (!hasPurchased)
        {
            throw new Exception(
                "You can only review products you have purchased.");
        }

        var existingReview =
            await _context.Reviews
                .FirstOrDefaultAsync(x =>
                    x.ProductId ==
                    request.ProductId &&
                    x.UserId ==
                    userId);

        if (existingReview is not null)
        {
            throw new Exception(
                "You have already reviewed this product.");
        }

        var review = new Review
        {
            ProductId =
                request.ProductId,

            UserId =
                userId,

            Rating =
                request.Rating,

            Comment =
                request.Comment
        };

        _context.Reviews.Add(review);

        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ReviewResponse>>
        GetReviewsByProductAsync(
            int productId)
    {
        return await _context.Reviews
            .Where(x =>
                x.ProductId ==
                productId)
            .OrderByDescending(x =>
                x.CreatedDate)
            .Select(x =>
                new ReviewResponse
                {
                    Id =
                        x.Id,

                    UserName =
                        x.User.Name,

                    Rating =
                        x.Rating,

                    Comment =
                        x.Comment,

                    CreatedDate =
                        x.CreatedDate
                })
            .ToListAsync();
    }
}