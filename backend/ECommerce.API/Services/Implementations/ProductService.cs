using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Repositories.Interfaces;
using ECommerce.API.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Implementations;

public class ProductService : IProductService
{
    private readonly IGenericRepository<Product> _productRepository;
    private readonly IMapper _mapper;
    private readonly IGenericRepository<Category> _categoryRepository;
    private readonly ApplicationDbContext _context;

    public ProductService(
    IGenericRepository<Product> productRepository,
    IGenericRepository<Category> categoryRepository,
    ApplicationDbContext context,
    IMapper mapper)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _context = context;
        _mapper = mapper;
    }
    public async Task<IEnumerable<ProductResponse>> GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();

        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<IEnumerable<ProductResponse>>
        GetFilteredAsync(ProductQueryRequest request)
    {
        var query = _context.Products
            .Include(p => p.Seller)
            .Include(p => p.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchTerm = request.Search.ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(searchTerm) || 
                (x.Category != null && x.Category.Name.ToLower().Contains(searchTerm)));
        }

        if (request.CategoryIds != null &&
    request.CategoryIds.Any())
        {
            query = query.Where(x =>
                request.CategoryIds.Contains(x.CategoryId));
        }

        if (request.MinPrice.HasValue)
        {
            query = query.Where(x =>
                x.Price >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(x =>
                x.Price <= request.MaxPrice.Value);
        }

        query = query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize);

        var products = await query.ToListAsync();

        return _mapper.Map<IEnumerable<ProductResponse>>(products);
    }

    public async Task<ProductResponse?> GetByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Seller)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null)
            return null;

        return _mapper.Map<ProductResponse>(product);
    }

    public async Task<ProductResponse> CreateAsync(
        CreateProductRequest request)
    {
        var category = await _categoryRepository
            .GetByIdAsync(request.CategoryId);

        if (category is null)
            throw new Exception("Category not found.");

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            ImageUrl = request.ImageUrl,
            CategoryId = request.CategoryId,
            CompareAtPrice = request.CompareAtPrice,
            InstallmentPlan = request.InstallmentPlan,
            Images = request.Images,
            Brand = request.Brand,
            IsActive = request.IsActive,
            SKU = request.SKU,
            TrackQuantity = request.TrackQuantity,
            ContinueSellingWhenOutOfStock = request.ContinueSellingWhenOutOfStock,
            UrlHandle = request.UrlHandle,
            MetaDescription = request.MetaDescription,
            ProductType = request.ProductType,
            Vendor = request.Vendor,
            Tags = request.Tags,
            Variants = request.Variants,
            Specifications = request.Specifications,
            Features = request.Features
        };

        await _productRepository.AddAsync(product);

        return _mapper.Map<ProductResponse>(product);
    }

    public async Task<ProductResponse?> UpdateAsync(
        int id,
        UpdateProductRequest request)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
            return null;

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.ImageUrl = request.ImageUrl;
        product.CategoryId = request.CategoryId;
        product.CompareAtPrice = request.CompareAtPrice;
        product.InstallmentPlan = request.InstallmentPlan;
        product.Images = request.Images;
        product.Brand = request.Brand;
        product.IsActive = request.IsActive;
        product.SKU = request.SKU;
        product.TrackQuantity = request.TrackQuantity;
        product.ContinueSellingWhenOutOfStock = request.ContinueSellingWhenOutOfStock;
        product.UrlHandle = request.UrlHandle;
        product.MetaDescription = request.MetaDescription;
        product.ProductType = request.ProductType;
        product.Vendor = request.Vendor;
        product.Tags = request.Tags;
        product.Variants = request.Variants;
        product.Specifications = request.Specifications;
        product.Features = request.Features;

        await _productRepository.UpdateAsync(product);

        return _mapper.Map<ProductResponse>(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product is null)
            return false;

        await _productRepository.DeleteAsync(product);

        return true;
    }
}