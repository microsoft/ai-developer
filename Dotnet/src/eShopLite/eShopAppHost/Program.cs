using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);


var products = builder.AddProject<Projects.Products>("products");

var store = builder.AddProject<Projects.Store>("store")
    .WithReference(products)
    .WithExternalHttpEndpoints();

builder.Build().Run();
