using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.Email;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Implementations;

public class MarketingService
    : IMarketingService
{
    private readonly ApplicationDbContext
        _context;

    private readonly IEmailService
        _emailService;

    public MarketingService(
        ApplicationDbContext context,
        IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task SendCampaignAsync(
        SendMarketingCampaignRequest request)
    {
        var users =
            await _context.Users
                .Where(x =>
                    !string.IsNullOrWhiteSpace(
                        x.Email))
                .ToListAsync();

        var html =
            $@"
            <!DOCTYPE html>
            <html>
            <body style='
                font-family:Arial,sans-serif;
                background:#f8fafc;
                padding:20px;
            '>

                <div style='
                    max-width:700px;
                    margin:auto;
                    background:white;
                    border-radius:16px;
                    overflow:hidden;
                    box-shadow:0 4px 20px rgba(0,0,0,.08);
                '>

                    <img
                        src='{request.BannerImageUrl}'
                        style='
                            width:100%;
                            display:block;
                        '
                    />

                    <div style='padding:32px;'>

                        <h1 style='
                            margin-top:0;
                            color:#111827;
                        '>
                            {request.Subject}
                        </h1>

                        <div style='
                            color:#4b5563;
                            line-height:1.8;
                            font-size:15px;
                        '>
                            {request.Message}
                        </div>

                        <hr style='margin:30px 0;' />

                        <p style='
                            color:#6b7280;
                            font-size:13px;
                        '>
                            Sent from Velocity.Shop
                        </p>

                    </div>

                </div>

            </body>
            </html>";

        foreach (var user in users)
        {
            try
            {
                await _emailService
                    .SendEmailAsync(
                        user.Email,
                        request.Subject,
                        html);

                Console.WriteLine(
                    $"Campaign sent to: {user.Email}");
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Failed sending to {user.Email}");

                Console.WriteLine(
                    ex.Message);
            }

            await Task.Delay(
                TimeSpan.FromSeconds(5));
        }
    }
}