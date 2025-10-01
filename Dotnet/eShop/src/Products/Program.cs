using Azure.Search.Documents.Indexes;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel.Embeddings;
using Products.Endpoints;
using Products.Memory;
using Products.Models;

#pragma warning disable SKEXP0010
#pragma warning disable SKEXP0001

var builder = WebApplication.CreateBuilder(args);

// Disable Globalization Invariant Mode
Environment.SetEnvironmentVariable("DOTNET_SYSTEM_GLOBALIZATION_INVARIANT", "false");

// add aspire service defaults
builder.AddServiceDefaults();
builder.Services.AddProblemDetails();

// Add DbContext service
// Add DbContext service
builder.Services.AddDbContext<Context>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddSingleton<IConfiguration>(sp => {
    return builder.Configuration;
});


//Challenge 9 - Configure the Kernel in an ASP.NET Core app:


//Challenge 9 - Register the Azure AI Embedding model


//Challenge 9 - Register the Azure AI Search Resource


//Challenge 10 - Register a Chat Completion Model


//Add AI Search initializer
builder.Services.AddSingleton(sp => {
    var logger = sp.GetService<ILogger<Program>>();
    return new AiSearchInitializer(logger!, sp.GetService<ITextEmbeddingGenerationService>()!, sp.GetService<SearchIndexClient>());
});

// Add services to the container.
var app = builder.Build();

// Apply migrations at startup
using (var scope = app.Services.CreateScope()) {
    var dbContext = scope.ServiceProvider.GetRequiredService<Context>();
    dbContext.Database.Migrate();
}

// aspire map default endpoints
app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.MapProductEndpoints();

app.UseStaticFiles();


app.Run();