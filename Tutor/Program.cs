using Microsoft.EntityFrameworkCore;
using Tutor.Context;
using Tutor.Controllers;
using DotNetEnv;
using Microsoft.Extensions.Configuration;

DotNetEnv.Env.Load();
var supabasePassword = Environment.GetEnvironmentVariable("SUPABASE_PASSWORD");

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddControllers().AddNewtonsoftJson();

var connectionString = $"User Id=postgres.bqqagzkdpxggygcmauvr;Password={supabasePassword};Server=aws-0-ap-southeast-1.pooler.supabase.com;Port=5432;Database=postgres;";
builder.Services.AddDbContext<DBContext>(options =>
    options.UseNpgsql(connectionString)
);
builder.Services.AddScoped<TutorController>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
