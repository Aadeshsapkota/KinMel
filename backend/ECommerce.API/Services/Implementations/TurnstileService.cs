
using System.Text.Json;
using ECommerce.API.Services.Interfaces;

namespace ECommerce.API.Services.Implementations;

public class TurnstileService : ITurnstileService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TurnstileService> _logger;
    private readonly IConfiguration _configuration;

    public TurnstileService(
        HttpClient httpClient,
        ILogger<TurnstileService> logger,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<bool> VerifyAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            _logger.LogWarning(
                "Turnstile token is null or empty.");
            return false;
        }

        // Read from appsettings or environment variables.
        var secret =
            _configuration["Turnstile:SecretKey"]
            ?? _configuration["TURNSTILE_SECRET_KEY"];

        if (string.IsNullOrWhiteSpace(secret))
        {
            _logger.LogError(
                "Turnstile secret key is not configured.");
            return false;
        }

        try
        {
            var content = new FormUrlEncodedContent(
                new Dictionary<string, string>
                {
                    ["secret"] = secret,
                    ["response"] = token
                });

            using var response = await _httpClient.PostAsync(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                content);

            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "Turnstile returned HTTP status {StatusCode}.",
                    (int)response.StatusCode);

                return false;
            }

            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;

            var success =
                root.TryGetProperty("success", out var successElement)
                && successElement.ValueKind == JsonValueKind.True;

            if (!success)
            {
                var errors = root.TryGetProperty(
                    "error-codes", out var errorsElement)
                    && errorsElement.ValueKind == JsonValueKind.Array
                    ? string.Join(", ", errorsElement
                        .EnumerateArray()
                        .Select(e => e.GetString()))
                    : "No error codes returned";

                _logger.LogWarning(
                    "Turnstile verification failed. Error codes: {Errors}",
                    errors);
            }

            return success;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(
                ex,
                "Unable to contact Cloudflare Turnstile.");

            return false;
        }
        catch (JsonException ex)
        {
            _logger.LogError(
                ex,
                "Invalid JSON response from Turnstile.");

            return false;
        }
    }
}