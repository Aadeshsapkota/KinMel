using ECommerce.API.Common;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(
        ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAll()
    {
        return Ok(await _categoryService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryResponse>> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category is null)
            return NotFound();

        return Ok(category);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CategoryResponse>>> Create(
        CreateCategoryRequest request)
    {
        var result = await _categoryService.CreateAsync(request);

        return Ok(new ApiResponse<CategoryResponse>
        {
            Success = true,
            Message = "Category created successfully.",
            Data = result
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CategoryResponse>>> Update(
        int id,
        UpdateCategoryRequest request)
    {
        var result =
            await _categoryService.UpdateAsync(id, request);

        if (result is null)
            return NotFound();

        return Ok(new ApiResponse<CategoryResponse>
        {
            Success = true,
            Message = "Category updated successfully.",
            Data = result
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _categoryService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Category deleted successfully."
        });
    }
}