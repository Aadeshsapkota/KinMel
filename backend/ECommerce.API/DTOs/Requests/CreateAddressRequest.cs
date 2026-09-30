using System.ComponentModel.DataAnnotations;

namespace ECommerce.API.DTOs.Requests;

public class CreateAddressRequest
{
    [Required]
    public string AddressLine1 { get; set; } = string.Empty;

    public string AddressLine2 { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    public string State { get; set; } = string.Empty;

    [Required]
    public string Country { get; set; } = string.Empty;

    [Required]
    public string PostalCode { get; set; } = string.Empty;

    public bool IsPrimary { get; set; }
}
