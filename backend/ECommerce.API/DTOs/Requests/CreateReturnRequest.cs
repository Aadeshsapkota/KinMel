namespace ECommerce.API.DTOs.Requests;

public class CreateReturnRequest
{
    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public string Reason { get; set; }
        = string.Empty;

    public string AdminRemarks { get; set; }
    = string.Empty;
}