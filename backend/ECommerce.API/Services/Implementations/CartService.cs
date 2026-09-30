using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Repositories.Interfaces;
using ECommerce.API.Services.Interfaces;

namespace ECommerce.API.Services.Implementations;

public class CartService : ICartService
{
    private readonly IGenericRepository<CartItem> _cartRepository;
    private readonly IGenericRepository<Product> _productRepository;

    public CartService(
        IGenericRepository<CartItem> cartRepository,
        IGenericRepository<Product> productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<CartItemResponse>> GetCartAsync(
        int userId)
    {
        var cartItems =
            (await _cartRepository.GetAllAsync())
            .Where(x => x.UserId == userId)
            .ToList();

        var response = new List<CartItemResponse>();

        foreach (var item in cartItems)
        {
            var product =
                await _productRepository.GetByIdAsync(
                    item.ProductId);

            if (product is null)
                continue;

            response.Add(new CartItemResponse
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = product.Name,
                ImageUrl = product.ImageUrl,
                Price = product.Price,
                Quantity = item.Quantity,
                TotalPrice = product.Price * item.Quantity
            });
        }

        return response;
    }

    public async Task<CartItemResponse> AddToCartAsync(
        int userId,
        AddToCartRequest request)
    {
        var product =
            await _productRepository.GetByIdAsync(
                request.ProductId);

        if (product is null)
            throw new Exception("Product not found.");

        if (product.Stock <= 0)
            throw new Exception("Product is out of stock.");

        if (request.Quantity <= 0)
            throw new Exception(
                "Quantity must be greater than zero.");

        if (request.Quantity > product.Stock)
        {
            throw new Exception(
                $"Only {product.Stock} units of {product.Name} are available.");
        }

        var existingItem =
            (await _cartRepository.GetAllAsync())
            .FirstOrDefault(x =>
                x.UserId == userId &&
                x.ProductId == request.ProductId);

        if (existingItem is not null)
        {
            if (
                existingItem.Quantity +
                request.Quantity >
                product.Stock)
            {
                throw new Exception(
                    $"Only {product.Stock} units of {product.Name} are available.");
            }

            existingItem.Quantity +=
                request.Quantity;

            await _cartRepository.UpdateAsync(
                existingItem);

            return new CartItemResponse
            {
                Id = existingItem.Id,
                ProductId = product.Id,
                ProductName = product.Name,
                ImageUrl = product.ImageUrl,
                Price = product.Price,
                Quantity = existingItem.Quantity,
                TotalPrice = product.Price * existingItem.Quantity
            };
        }

        var cartItem = new CartItem
        {
            UserId = userId,
            ProductId = request.ProductId,
            Quantity = request.Quantity
        };

        await _cartRepository.AddAsync(cartItem);

        return new CartItemResponse
        {
            Id = cartItem.Id,
            ProductId = product.Id,
            ProductName = product.Name,
            ImageUrl = product.ImageUrl,
            Price = product.Price,
            Quantity = cartItem.Quantity,
            TotalPrice = product.Price * cartItem.Quantity
        };
    }

    public async Task<CartItemResponse?> UpdateCartItemAsync(
        int cartItemId,
        UpdateCartItemRequest request)
    {
        var cartItem =
            await _cartRepository.GetByIdAsync(
                cartItemId);

        if (cartItem is null)
            return null;

        var product =
            await _productRepository.GetByIdAsync(
                cartItem.ProductId);

        if (product is null)
            return null;

        if (request.Quantity <= 0)
        {
            throw new Exception(
                "Quantity must be greater than zero.");
        }

        if (request.Quantity > product.Stock)
        {
            throw new Exception(
                $"Only {product.Stock} units of {product.Name} are available.");
        }

        cartItem.Quantity =
            request.Quantity;

        await _cartRepository.UpdateAsync(
            cartItem);

        return new CartItemResponse
        {
            Id = cartItem.Id,
            ProductId = product.Id,
            ProductName = product.Name,
            ImageUrl = product.ImageUrl,
            Price = product.Price,
            Quantity = cartItem.Quantity,
            TotalPrice = product.Price * cartItem.Quantity
        };
    }

    public async Task<bool> RemoveCartItemAsync(
        int cartItemId)
    {
        var cartItem =
            await _cartRepository.GetByIdAsync(
                cartItemId);

        if (cartItem is null)
            return false;

        await _cartRepository.DeleteAsync(
            cartItem);

        return true;
    }
}