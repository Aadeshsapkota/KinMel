using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Options;

namespace ECommerce.API.Email;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(
        IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(
        string toEmail,
        string subject,
        string body)
    {
        var email = new MimeMessage();

        email.From.Add(
            new MailboxAddress(
                _settings.FromName,
                _settings.FromEmail));

        email.To.Add(
            MailboxAddress.Parse(toEmail));

        email.Subject = subject;

        email.Body = new TextPart("html")
        {
            Text = body
        };

        using var smtp =
            new SmtpClient();

        await smtp.ConnectAsync(
    "smtp-relay.brevo.com",
    587,
    SecureSocketOptions.Auto);

        try
        {
            await smtp.AuthenticateAsync(
                _settings.Username,
                _settings.Password);

            Console.WriteLine("AUTH SUCCESS");
        }
        catch (Exception ex)
        {
            Console.WriteLine("AUTH ERROR:");
            Console.WriteLine(ex.ToString());

            throw;
        }

        try
        {
            await smtp.SendAsync(email);

            Console.WriteLine("EMAIL SENT");
        }
        catch (Exception ex)
        {
            Console.WriteLine("SEND ERROR:");
            Console.WriteLine(ex.ToString());

            throw;
        }

        await smtp.DisconnectAsync(true);
    }
}