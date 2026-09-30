using AutoMapper;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;

namespace ECommerce.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductResponse>()
            .ForMember(dest => dest.SellerName,
                opt => opt.MapFrom(src =>
                    src.Seller != null ? src.Seller.CompanyName : null));

        CreateMap<Category, CategoryResponse>();

        CreateMap<User, UserResponse>();

        CreateMap<Order, OrderResponse>();

        
    }
}