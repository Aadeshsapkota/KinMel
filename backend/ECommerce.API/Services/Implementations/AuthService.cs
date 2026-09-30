using ECommerce.API.Authentication;
using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using Google.Apis.Auth;
using ECommerce.API.Services.Interfaces;
using ECommerce.API.Email;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
namespace ECommerce.API.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly ITurnstileService _turnstileService;

    private readonly IEmailService _emailService;
    private readonly JwtTokenGenerator _tokenGenerator;
    private readonly IValidator<RegisterRequest> _registerValidator;
    private readonly IValidator<LoginRequest> _loginValidator;
    private readonly IWebHostEnvironment _environment;

    public AuthService(
        ApplicationDbContext context,
        JwtTokenGenerator tokenGenerator,
        IValidator<RegisterRequest> registerValidator,
        IValidator<LoginRequest> loginValidator,
        ITurnstileService turnstileService,
        IEmailService emailService,
        IWebHostEnvironment environment)
    {
        _context = context;
        _tokenGenerator = tokenGenerator;
        _registerValidator = registerValidator;
        _loginValidator = loginValidator;
        _turnstileService = turnstileService;
        _emailService = emailService;
        _environment = environment;

    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var validationResult =
            await _registerValidator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            throw new Exception(
                string.Join(", ",
                    validationResult.Errors
                        .Select(x => x.ErrorMessage)));
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser is not null)
            throw new Exception("Email already exists.");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User"
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var token = _tokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            Role = user.Role,
            Name = user.Name
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var validationResult =
            await _loginValidator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            throw new Exception(
                string.Join(", ",
                    validationResult.Errors
                        .Select(x => x.ErrorMessage)));
        }


        if (!string.IsNullOrWhiteSpace(request.CaptchaToken))
        {
            var captchaValid =
                await _turnstileService
                    .VerifyAsync(request.CaptchaToken);

            if (!captchaValid)
            {
                throw new Exception(
                    "Captcha verification failed.");
            }
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null)
            throw new Exception("Invalid credentials.");

        var isValidPassword =
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);

        if (!isValidPassword)
            throw new Exception("Invalid credentials.");

        if (_environment.IsDevelopment() &&
        user.Name == "admin")
        {
            user.Role = "Admin";

            await _context.SaveChangesAsync();
        }


         if (_environment.IsDevelopment() &&
        user.Name == "seller")
        {
            user.Role = "Seller";

            await _context.SaveChangesAsync();
        }
        var token = _tokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            Role = user.Role,
            Name = user.Name
        };
    }

    public async Task ForgotPasswordAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (user == null)
            throw new Exception("User not found.");

        var otp =
            Random.Shared.Next(100000, 999999)
                .ToString();

        var otpHash =
            BCrypt.Net.BCrypt.HashPassword(otp);

        _context.PasswordResetOtps.Add(
            new PasswordResetOtp
            {
                Email = email,
                Otp = otpHash,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            });

        await _context.SaveChangesAsync();

        var body = $@"
            <h2>Password Reset OTP</h2>
            <p>Your OTP is:</p>
            <h1>{otp}</h1>
            <p>This OTP expires in 5 minutes.</p>";

        await _emailService.SendEmailAsync(
            email,
            "Velocity.Shop Password Reset",
            body);
    }
    public async Task VerifyOtpAsync(
    string email,
    string otp)
    {
        var record =
            await _context.PasswordResetOtps
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync(x =>
                    x.Email == email &&
                    !x.IsUsed);

        if (record == null)
            throw new Exception("Invalid OTP.");

        if (record.ExpiresAt < DateTime.UtcNow)
            throw new Exception("OTP expired.");

        var isValidOtp =
            BCrypt.Net.BCrypt.Verify(
                otp,
                record.Otp);

        if (!isValidOtp)
            throw new Exception("Invalid OTP.");
    }

    public async Task ResetPasswordAsync(
        string email,
        string otp,
        string newPassword)
    {
        var record =
            await _context.PasswordResetOtps
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync(x =>
                    x.Email == email &&
                    !x.IsUsed);

        if (record == null)
            throw new Exception("Invalid OTP.");

        if (record.ExpiresAt < DateTime.UtcNow)
            throw new Exception("OTP expired.");

        var isValidOtp =
            BCrypt.Net.BCrypt.Verify(
                otp,
                record.Otp);

        if (!isValidOtp)
            throw new Exception("Invalid OTP.");

        var user =
            await _context.Users
                .FirstOrDefaultAsync(x => x.Email == email);

        if (user == null)
            throw new Exception("User not found.");

        user.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(
                newPassword);

        record.IsUsed = true;

        await _context.SaveChangesAsync();
    }

    public async Task<AuthResponse> GoogleLoginAsync(
    string idToken)
    {
        var payload =
            await GoogleJsonWebSignature
                .ValidateAsync(idToken);

        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == payload.Email);

        if (user == null)
        {
            user = new User
            {
                Name = payload.Name,
                Email = payload.Email,
                Role = "User",
                PasswordHash = string.Empty,
                GoogleId = payload.Subject,
                ProfilePictureUrl = payload.Picture
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();
        }
        else
        {
            if (string.IsNullOrEmpty(user.GoogleId))
            {
                user.GoogleId =
                    payload.Subject;

                user.ProfilePictureUrl =
                    payload.Picture;

                await _context.SaveChangesAsync();
            }
        }

        var token =
            _tokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            Role = user.Role,
            Name = user.Name
        };
    }
}