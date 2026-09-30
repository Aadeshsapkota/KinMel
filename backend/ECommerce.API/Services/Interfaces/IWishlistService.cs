using System.Collections.Generic;
using System.Threading.Tasks;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces
{
    public interface IWishlistService
    {
        Task<IEnumerable<WishlistResponse>> GetWishlistAsync(int userId);
        Task<WishlistResponse> AddToWishlistAsync(int userId, int productId);
        Task RemoveFromWishlistAsync(int userId, int productId);
    }
}
