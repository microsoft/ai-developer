using Agents.Tools;
using Agents.Extensions;
using Agents.Service;
using Microsoft.FluentUI.AspNetCore.Components;
using Microsoft.SemanticKernel;
using Store.Components;
using Store.Services;

var builder = WebApplication.CreateBuilder(args);

// add aspire service defaults
builder.AddServiceDefaults();

builder.Services.AddHttpClient();
builder.Services.AddSingleton<ProductService>();
builder.Services.AddHttpClient<ProductService>(
    static client => client.BaseAddress = new("https+http://products"));

builder.Services.AddHttpClient<DatabasePlugin>(
    static client => client.BaseAddress = new("https+http://products"));

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddFluentUIComponents();

// Add Blob storage
builder.AddAzureBlobClient("images");

// Add the AI Selection Service


// Add Semantic Kernel
builder.AddAzureOpenAIServices();

// Setup Background Services
await builder.Services.RegisterBackgroundServices();

var app = builder.Build();

// aspire map default endpoints
app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();


app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
