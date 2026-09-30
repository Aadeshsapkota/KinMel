namespace ECommerce.API.Models;

public class PendingOrderItem
{
    public int Id { get; set; }

    public int PendingOrderId { get; set; }

    public PendingOrder? PendingOrder { get; set; }

    public int ProductId { get; set; }

    public Product? Product { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }
}