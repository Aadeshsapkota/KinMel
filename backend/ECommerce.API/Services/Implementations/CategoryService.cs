using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Repositories.Interfaces;
using ECommerce.API.Services.Interfaces;

namespace ECommerce.API.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly IGenericRepository<Category> _repository;

    public CategoryService(
        IGenericRepository<Category> repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllAsync()
    {
        var categories = await _repository.GetAllAsync();

        return categories.Select(c => new CategoryResponse
        {
            Id = c.Id,
            Name = c.Name,
            ImageUrl = c.ImageUrl,
            IconName = c.IconName
        });
    }

    public async Task<CategoryResponse?> GetByIdAsync(int id)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category is null)
            return null;

        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            ImageUrl = category.ImageUrl
        };
    }

    public async Task<CategoryResponse> CreateAsync(
        CreateCategoryRequest request)
    {

        var category = new Category
        {
            Name = request.Name,
            ImageUrl = request.ImageUrl,
            IconName = request.IconName
        };

        await _repository.AddAsync(category);

        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            ImageUrl = category.ImageUrl,
            IconName = category.IconName
        };
    }

    public async Task<CategoryResponse?> UpdateAsync(
        int id,
        UpdateCategoryRequest request)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category is null)
            return null;

        category.Name = request.Name;
        category.ImageUrl = request.ImageUrl;
        category.IconName = request.IconName;

        await _repository.UpdateAsync(category);

        return new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            ImageUrl = category.ImageUrl,
            IconName = category.IconName
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category is null)
            return false;

        await _repository.DeleteAsync(category);

        return true;
    }
}