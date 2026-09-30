using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface ISellerService
{
    // Seller dashboard
    Task<SellerDashboardResponse> GetDashboardAsync(int userId);

    // Seller products
    Task<IEnumerable<ProductResponse>> GetSellerProductsAsync(int userId);
    Task<ProductResponse> CreateProductAsync(int userId, CreateProductRequest request);
    Task<ProductResponse?> UpdateProductAsync(int userId, int productId, UpdateProductRequest request);
    Task<bool> DeleteProductAsync(int userId, int productId);

    // Seller orders
    Task<IEnumerable<SellerOrderResponse>> GetSellerOrdersAsync(int userId);

    // Admin seller management
    Task<IEnumerable<SellerResponse>> GetAllSellersAsync();
    Task<SellerResponse> CreateSellerAsync(CreateSellerRequest request);
    Task<SellerResponse?> UpdateSellerAsync(int sellerId, UpdateSellerRequest request);
    Task<bool> DeleteSellerAsync(int sellerId);
    Task<SellerResponse?> GetSellerByUserIdAsync(int userId);
}
