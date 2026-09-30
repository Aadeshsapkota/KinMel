using ECommerce.API.Common;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(
        IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] ProductQueryRequest request)
    {
        return Ok(
            await _productService.GetFilteredAsync(
                request));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetByIdAsync(id);

        if (product is null)
            return NotFound();

        return Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateProductRequest request)
    {
        var result =
            await _productService.CreateAsync(request);

        return Ok(new ApiResponse<ProductResponse>
        {
            Success = true,
            Message = "Product created successfully.",
            Data = result
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateProductRequest request)
    {
        var result =
            await _productService.UpdateAsync(id, request);

        if (result is null)
            return NotFound();

        return Ok(new ApiResponse<ProductResponse>
        {
            Success = true,
            Message = "Product updated successfully.",
            Data = result
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _productService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Product deleted successfully."
        });
    }
}