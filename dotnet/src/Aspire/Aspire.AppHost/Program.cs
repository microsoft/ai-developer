var builder = DistributedApplication.CreateBuilder(args);

var workitems = builder.AddProject<Projects.WorkItems>("workitems-api");

builder.AddProject<Projects.BlazorAI>("blazor-aichat")
    .WithExternalHttpEndpoints()
    .WithReference(workitems);

builder.Build().Run();
