using ECommerce.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<UserAddress> UserAddresses => Set<UserAddress>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Product> Products => Set<Product>();

    public DbSet<CartItem> CartItems => Set<CartItem>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    public DbSet<Review> Reviews { get; set; }

    public DbSet<ReturnRequest> ReturnRequests
    => Set<ReturnRequest>();

    public DbSet<SupportTicket> SupportTickets
    => Set<SupportTicket>();

    public DbSet<SupportMessage> SupportMessages
        => Set<SupportMessage>();

    public DbSet<PendingOrder> PendingOrders
    => Set<PendingOrder>();

    public DbSet<PendingOrderItem> PendingOrderItems
        => Set<PendingOrderItem>();
    public DbSet<DeliveryOtp> DeliveryOtps
    => Set<DeliveryOtp>();

    public DbSet<Seller> Sellers => Set<Seller>();

    public DbSet<PasswordResetOtp> PasswordResetOtps { get; set; }

    public DbSet<WishlistItem> Wishlists { get; set; }



    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Order>()
            .HasOne(x => x.User)
            .WithMany(x => x.Orders)
            .HasForeignKey(x => x.UserId);

        modelBuilder.Entity<UserAddress>()
            .HasOne(x => x.User)
            .WithMany(x => x.Addresses)
            .HasForeignKey(x => x.UserId);

        modelBuilder.Entity<Order>()
            .HasMany(x => x.OrderItems)
            .WithOne(x => x.Order)
            .HasForeignKey(x => x.OrderId);

        modelBuilder.Entity<Order>()
              .HasOne(x => x.DeliveryAgent)
           .WithMany(x => x.AssignedOrders)
           .HasForeignKey(x => x.DeliveryAgentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderItem>()
            .HasOne(x => x.Product)
            .WithMany()
            .HasForeignKey(x => x.ProductId);

        modelBuilder.Entity<PendingOrder>()
    .Property(p => p.TotalAmount)
    .HasPrecision(18, 2);

        modelBuilder.Entity<PendingOrderItem>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(o => o.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Seller>()
            .HasOne(s => s.User)
            .WithOne()
            .HasForeignKey<Seller>(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Seller)
            .WithMany(s => s.Products)
            .HasForeignKey(p => p.SellerId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Product>()
            .Property(p => p.CompareAtPrice)
            .HasPrecision(18, 2);


        modelBuilder.Entity<ReturnRequest>()
    .HasOne(x => x.Order)
    .WithMany()
    .HasForeignKey(x => x.OrderId)
    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ReturnRequest>()
            .HasOne(x => x.Product)
            .WithMany()
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ReturnRequest>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);


        modelBuilder.Entity<SupportTicket>()
    .HasOne(x => x.User)
    .WithMany()
    .HasForeignKey(x => x.UserId)
    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<SupportMessage>()
            .HasOne(x => x.Ticket)
            .WithMany(x => x.Messages)
            .HasForeignKey(x => x.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SupportMessage>()
            .HasOne(x => x.Sender)
            .WithMany()
            .HasForeignKey(x => x.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<WishlistItem>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WishlistItem>()
            .HasOne(x => x.Product)
            .WithMany()
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}