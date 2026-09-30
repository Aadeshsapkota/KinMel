using System;

namespace ECommerce.API.DTOs.Responses
{
    public class WishlistResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? CompareAtPrice { get; set; }
        public string Brand { get; set; } = string.Empty;
        public int Stock { get; set; }
        public DateTime AddedDate { get; set; }
    }
}
