using System.Security.Claims;
using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProfileController(
        ApplicationDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id == GetUserId());

        if (user is null)
        {
            return NotFound();
        }

        return Ok(
            new ProfileResponse
            {
                Name = user.Name,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                CreatedDate = user.CreatedDate
            });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(
        UpdateProfileRequest request)
    {
        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id == GetUserId());

        if (user is null)
        {
            return NotFound();
        }

        user.Name =
            request.Name;

        user.PhoneNumber =
            request.PhoneNumber;

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("change-password")]
    public async Task<IActionResult>
    ChangePassword(
        ChangePasswordRequest request)
    {
        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id == GetUserId());

        if (user is null)
        {
            return NotFound();
        }

        var valid =
            BCrypt.Net.BCrypt.Verify(
                request.OldPassword,
                user.PasswordHash);

        if (!valid)
        {
            return BadRequest(
                "Old password is incorrect.");
        }

        if (
            request.NewPassword !=
            request.ConfirmPassword)
        {
            return BadRequest(
                "Passwords do not match.");
        }

        user.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(
                request.NewPassword);

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("addresses")]
    public async Task<IActionResult> GetAddresses()
    {
        var addresses = await _context.UserAddresses
            .Where(x => x.UserId == GetUserId())
            .Select(a => new AddressResponse
            {
                Id = a.Id,
                AddressLine1 = a.AddressLine1,
                AddressLine2 = a.AddressLine2,
                City = a.City,
                State = a.State,
                Country = a.Country,
                PostalCode = a.PostalCode,
                IsPrimary = a.IsPrimary
            })
            .ToListAsync();

        return Ok(addresses);
    }

    [HttpPost("addresses")]
    public async Task<IActionResult> AddAddress([FromBody] CreateAddressRequest request)
    {
        var userId = GetUserId();

        if (request.IsPrimary)
        {
            var existingPrimary = await _context.UserAddresses
                .Where(x => x.UserId == userId && x.IsPrimary)
                .ToListAsync();
            foreach (var addr in existingPrimary)
            {
                addr.IsPrimary = false;
            }
        }

        var address = new Models.UserAddress
        {
            UserId = userId,
            AddressLine1 = request.AddressLine1,
            AddressLine2 = request.AddressLine2,
            City = request.City,
            State = request.State,
            Country = request.Country,
            PostalCode = request.PostalCode,
            IsPrimary = request.IsPrimary
        };

        _context.UserAddresses.Add(address);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("addresses/{id}")]
    public async Task<IActionResult> DeleteAddress(int id)
    {
        var address = await _context.UserAddresses
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == GetUserId());

        if (address == null) return NotFound();

        _context.UserAddresses.Remove(address);
        await _context.SaveChangesAsync();

        return Ok();
    }
}