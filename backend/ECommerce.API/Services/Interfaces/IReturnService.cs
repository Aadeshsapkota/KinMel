using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface IReturnService
{
    Task<ReturnRequestResponse>
    CreateReturnRequestAsync(
        int userId,
        CreateReturnRequest request);

    Task<IEnumerable<ReturnRequestResponse>>
    GetAllReturnRequestsAsync();

    Task ApproveReturnAsync(
    int returnRequestId);

    Task RejectReturnAsync(
        int returnRequestId);
}