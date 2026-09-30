using ECommerce.API.Common;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(
        RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);

        return Ok(new ApiResponse<AuthResponse>
        {
            Success = true,
            Message = "User registered successfully.",
            Data = result
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(
        LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        return Ok(new ApiResponse<AuthResponse>
        {
            Success = true,
            Message = "Login successful.",
            Data = result
        });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
    ForgotPasswordRequest request)
    {
        await _authService.ForgotPasswordAsync(
            request.Email);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "OTP sent successfully."
        });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp(
    VerifyOtpRequest request)
    {
        await _authService.VerifyOtpAsync(
            request.Email,
            request.Otp);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "OTP verified."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
    ResetPasswordRequest request)
    {
        await _authService.ResetPasswordAsync(
            request.Email,
            request.Otp,
            request.NewPassword);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Password reset successful."
        });
    }

    [HttpPost("google")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>>
    GoogleLogin(
        GoogleLoginRequest request)
    {
        var result =
            await _authService.GoogleLoginAsync(
                request.IdToken);

        return Ok(
            new ApiResponse<AuthResponse>
            {
                Success = true,
                Message = "Google login successful.",
                Data = result
            });
    }
}