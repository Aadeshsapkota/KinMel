using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductResponse>> GetAllAsync();

    Task<IEnumerable<ProductResponse>> GetFilteredAsync(
        ProductQueryRequest request);

    Task<ProductResponse?> GetByIdAsync(int id);

    Task<ProductResponse> CreateAsync(
        CreateProductRequest request);

    Task<ProductResponse?> UpdateAsync(
        int id,
        UpdateProductRequest request);

    Task<bool> DeleteAsync(int id);
}