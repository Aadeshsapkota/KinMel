using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponse>> GetAllAsync();

    Task<CategoryResponse?> GetByIdAsync(int id);

    Task<CategoryResponse> CreateAsync(
        CreateCategoryRequest request);

    Task<CategoryResponse?> UpdateAsync(
        int id,
        UpdateCategoryRequest request);

    Task<bool> DeleteAsync(int id);
}