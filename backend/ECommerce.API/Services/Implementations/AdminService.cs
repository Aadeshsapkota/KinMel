using ECommerce.API.Data;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Implementations;

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _context;

    public AdminService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserResponse>> GetUsersAsync()
    {
        return await _context.Users
            .Select(x => new UserResponse
            {
                Id = x.Id,
                Name = x.Name,
                Email = x.Email,
                Role = x.Role,
                CreatedDate = x.CreatedDate
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<OrderResponse>> GetOrdersAsync()
    {
        return await _context.Orders
            .Include(x => x.User)
            .Select(x => new OrderResponse
            {
                Id = x.Id,
                TotalAmount = x.TotalAmount,
                Status = x.Status,
                CreatedDate = x.CreatedDate,
                CustomerName = x.User != null ? x.User.Name : "Unknown"
            })
            .ToListAsync();
    }

    public async Task<DashboardResponse> GetDashboardAsync()
    {
        return new DashboardResponse
        {
            TotalUsers =
                await _context.Users.CountAsync(),

            TotalProducts =
                await _context.Products.CountAsync(),

            TotalOrders =
                await _context.Orders.CountAsync(),

            TotalRevenue =
                await _context.Orders.SumAsync(
                    x => (decimal?)x.TotalAmount) ?? 0
        };
    }



    public async Task<AdminOrderDetailsResponse?>
    GetOrderByIdAsync(
        int id
    )
    {
        return await _context.Orders

            .Include(x => x.User)

            .Include(x => x.OrderItems)
            .ThenInclude(x => x.Product)

            .Where(x => x.Id == id)

            .Select(x =>
                new AdminOrderDetailsResponse
                {
                    Id = x.Id,

                    CustomerName =
                        x.User!.Name,

                    CustomerEmail =
                        x.User.Email,

                    TotalAmount =
                        x.TotalAmount,

                    Status =
                        x.Status,

                    CreatedDate =
                        x.CreatedDate,

                    Items =
                        x.OrderItems
                            .Select(i =>
                                new AdminOrderItemResponse
                                {
                                    ProductName =
                                        i.Product!.Name,

                                    Quantity =
                                        i.Quantity,

                                    Price =
                                        i.Price
                                })
                            .ToList()
                })
            .FirstOrDefaultAsync();
    }

    public async Task<bool>
        UpdateOrderStatusAsync(
            int orderId,
            string status
        )
    {
        var order =
            await _context.Orders
                .FirstOrDefaultAsync(
                    x => x.Id == orderId
                );

        if (order is null)
        {
            return false;
        }

        order.Status = status;

        await _context.SaveChangesAsync();

        return true;
    }



    public async Task<bool>
UpdateUserRoleAsync(
    int currentUserId,
    int userId,
    string role
)
    {
        var validRoles = new[] { "Admin", "User", "DeliveryAgent", "Seller" };

        if (!validRoles.Contains(role))
        {
            return false;
        }

        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id == userId
                );

        if (user is null)
        {
            return false;
        }

        // Prevent admin from removing their own admin access
        if (currentUserId == userId && user.Role == "Admin" && role != "Admin")
        {
            throw new Exception(
                "You cannot remove your own Admin role.");
        }

        user.Role = role;

        await _context.SaveChangesAsync();

        return true;
    }



}