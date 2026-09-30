using ECommerce.API.Data;
using Microsoft.EntityFrameworkCore;
using ECommerce.API.Authentication;
using ECommerce.API.Services.Implementations;
using ECommerce.API.Services.Interfaces;
using ECommerce.API.Extensions;
using FluentValidation;
using ECommerce.API.Cloudinary;
using FluentValidation.AspNetCore;
using ECommerce.API.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;
using ECommerce.API.Email;
using ECommerce.API.Hubs;
using ECommerce.API.Mappings;
using ECommerce.API.Repositories.Interfaces;
using ECommerce.API.Repositories.Implementations;
using ECommerce.API.DTOs.Requests;
using DotNetEnv;
using ECommerce.API.Esewa;

Env.Load(); // Load environment variables from .env file

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "ECommerce API",
            Version = "v1"
        });


    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,

            Scheme = "bearer",

            BearerFormat = "JWT",

            Description = "Enter JWT token"
        });


    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecuritySchemeReference("Bearer", document),
                new List<string>()
            }
        });
});

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddScoped<
    ITurnstileService,
    TurnstileService>();

builder.Services.AddScoped<JwtTokenGenerator>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<
    IMarketingService,
    MarketingService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddAutoMapper(
    typeof(MappingProfile));

builder.Services.Configure<EsewaSettings>(
    builder.Configuration.GetSection("Esewa"));
builder.Services.AddHttpClient();

builder.Services.AddScoped<
    ISupportTicketService,
    SupportTicketService>();


var esewaSettings = builder.Configuration.GetSection("Esewa").Get<EsewaSettings>();

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection(
        "EmailSettings"));

builder.Services.AddScoped<IEmailService,
    EmailService>();

var jwtSettings = builder.Configuration
    .GetSection("JwtSettings")
    .Get<JwtSettings>();

builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings!.Issuer,
                ValidAudience = jwtSettings.Audience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings.SecretKey))
            };
    });

builder.Services.AddAuthorization();

builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

builder.Services.AddScoped<IValidator<RegisterRequest>,
    RegisterRequestValidator>();

builder.Services.AddScoped<IValidator<LoginRequest>,
    LoginRequestValidator>();

builder.Services.AddScoped(
    typeof(IGenericRepository<>),
    typeof(GenericRepository<>));

builder.Services.AddScoped<ICartService, CartService>();

builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IDeliveryService, DeliveryService>();
builder.Services.AddScoped<
    IReturnService,
    ReturnService>();

builder.Services.AddScoped<
    IReviewService,
    ReviewService>();

builder.Services.AddScoped<IPaymentService, PaymentService>();

builder.Services.AddScoped<IWishlistService, WishlistService>();

builder.Services.AddScoped<IAIShoppingAssistantService, AIShoppingAssistantService>();

builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings"));

var cloudinarySettings =
    builder.Configuration
        .GetSection("CloudinarySettings")
        .Get<CloudinarySettings>();

builder.Services.AddSingleton(
    cloudinarySettings!);

builder.Services.AddScoped<
    ICloudinaryService,
    CloudinaryService>();


builder.Services.AddScoped<
    IAdminService,
    AdminService>();

builder.Services.AddScoped<
    ISellerService,
    SellerService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

var app = builder.Build();

app.UseCors("Frontend");

app.UseGlobalExceptionMiddleware();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<SupportHub>(
    "/supportHub");

app.Run();