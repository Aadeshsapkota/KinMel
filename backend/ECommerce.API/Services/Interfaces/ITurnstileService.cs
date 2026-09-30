namespace ECommerce.API.Services.Interfaces;

public interface ITurnstileService
{
    Task<bool> VerifyAsync(
        string token);
}