var builder = DistributedApplication.CreateBuilder(args);

var workitems = builder.AddProject<Projects.WorkItems>("workitems-api");

builder.AddProject<Projects.BlazorAI>("blazor-aichat")
    .WithExternalHttpEndpoints()
    .WithReference(workitems)
    .WaitFor(workitems)
    .WithEnvironment("WORKITEMS_BASE_URL", workitems.GetEndpoint("https"))
    .WithEnvironment("OPEN_API_DOC_ROUTE", "/openapi/v1.json"); 

builder.Build().Run();
