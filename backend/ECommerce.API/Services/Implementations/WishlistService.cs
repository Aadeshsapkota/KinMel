using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ECommerce.API.Data;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Implementations
{
    public class WishlistService : IWishlistService
    {
        private readonly ApplicationDbContext _context;

        public WishlistService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WishlistResponse>> GetWishlistAsync(int userId)
        {
            var wishlist = await _context.Wishlists
                .Include(w => w.Product)
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.CreatedAt)
                .Select(w => new WishlistResponse
                {
                    ProductId = w.ProductId,
                    ProductName = w.Product.Name,
                    ImageUrl = w.Product.ImageUrl,
                    Price = w.Product.Price,
                    CompareAtPrice = w.Product.CompareAtPrice,
                    Brand = w.Product.Brand,
                    Stock = w.Product.Stock,
                    AddedDate = w.CreatedAt
                })
                .ToListAsync();

            return wishlist;
        }

        public async Task<WishlistResponse> AddToWishlistAsync(int userId, int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                throw new Exception("Product not found");
            }

            var existing = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (existing != null)
            {
                throw new Exception("Product already in wishlist");
            }

            var wishlistItem = new WishlistItem
            {
                UserId = userId,
                ProductId = productId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Wishlists.Add(wishlistItem);
            await _context.SaveChangesAsync();

            return new WishlistResponse
            {
                ProductId = product.Id,
                ProductName = product.Name,
                ImageUrl = product.ImageUrl,
                Price = product.Price,
                CompareAtPrice = product.CompareAtPrice,
                Brand = product.Brand,
                Stock = product.Stock,
                AddedDate = wishlistItem.CreatedAt
            };
        }

        public async Task RemoveFromWishlistAsync(int userId, int productId)
        {
            var item = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (item == null)
            {
                throw new Exception("Product not found in wishlist");
            }

            _context.Wishlists.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}
