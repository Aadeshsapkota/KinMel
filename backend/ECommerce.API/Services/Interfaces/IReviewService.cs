using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface IReviewService
{
    Task CreateReviewAsync(
        int userId,
        CreateReviewRequest request);

    Task<IEnumerable<ReviewResponse>>
        GetReviewsByProductAsync(
            int productId);
}