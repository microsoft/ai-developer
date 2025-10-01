using Azure.Provisioning.Search;
using Microsoft.Extensions.Configuration;
using Azure.Core;
using Azure.Provisioning.Storage;

var builder = DistributedApplication.CreateBuilder(args);

var deployWithAspire = builder.Configuration.GetValue<bool?>("Azure:Deploy") ?? true;
var useStorageEmulator = builder.Configuration.GetValue<bool?>("UseStorageEmulator") ?? false;
IResourceBuilder<IResourceWithConnectionString> imageStorageContainer = null!;

if (deployWithAspire)
{
    imageStorageContainer = builder.AddAzureStorage("storage")
        .ConfigureInfrastructure(infra =>
        {
            var storageAccount = infra.GetProvisionableResources()
                .OfType<StorageAccount>()
                .Single();

            storageAccount.AccessTier = StorageAccountAccessTier.Hot;
            storageAccount.Sku = new StorageSku() { Name = StorageSkuName.StandardLrs };
            storageAccount.AllowBlobPublicAccess = true;
            storageAccount.EnableHttpsTrafficOnly = true;
        })
        .AddBlobs("images");
}
else if (useStorageEmulator)
{
    imageStorageContainer = builder.AddAzureStorage("storage")
        .RunAsEmulator(azureite =>
        {
            azureite.WithLifetime(ContainerLifetime.Persistent);
            azureite.WithDataVolume();
        })
        .AddBlobs("images");
}
else
{
    var storageName = builder.AddParameterFromConfiguration("existingStorageName", "Azure:Storage:Name");
    var storageResourceGroup = builder.AddParameterFromConfiguration("existingStorageResourceGroup", "Azure:Storage:ResourceGroup");
    imageStorageContainer = builder.AddAzureStorage("storage")
        .AsExisting(storageName, storageResourceGroup)
        .AddBlobs("images");
}

IResourceBuilder<IResourceWithConnectionString> openAI = null!;

var chatModel = builder.AddParameterFromConfiguration("chatModel", "AOI_DEPLOYMODEL");
var imageModel = builder.AddParameterFromConfiguration("imageModel", "DALLE_DEPLOYMODEL");
var embeddingModel = builder.AddParameterFromConfiguration("embeddingModel", "EMBEDDINGS_DEPLOYMODEL");

if (deployWithAspire)
{
    var oai = builder.AddAzureOpenAI("openai");
    openAI = oai;
    var chat = oai.AddDeployment("gpt-4o", "gpt-4o", "2024-11-20");
    oai.AddDeployment("dall-e-3", "dall-e-3", "3.0");
    oai.AddDeployment("text-embedding-3-small", "text-embedding-3-small", "1");
}
else
{
    var openaiEndpoint = builder.AddParameterFromConfiguration("openaiEndpoint", "AOI_ENDPOINT");
    var openaiKey = builder.AddParameterFromConfiguration("openaiKey", "AOI_API_KEY", secret: true);
    openAI = builder.AddConnectionString("openai", ReferenceExpression.Create($"Endpoint={openaiEndpoint};Key={openaiKey}"));
}

// Create or Register Azure Search Resource
IResourceBuilder<IResourceWithConnectionString> search;
if (deployWithAspire)
{
    search = builder.AddAzureSearch("search")
        .ConfigureInfrastructure(infra =>
        {
            var searchService = infra.GetProvisionableResources()
                .OfType<SearchService>()
                .Single();
            searchService.Location = AzureLocation.EastUS;
            searchService.PartitionCount = 1;
            searchService.ReplicaCount = 1;
            searchService.SearchSkuName = SearchServiceSkuName.Free;
        });
}
else
{
    var searchUrl = builder.AddParameterFromConfiguration("aiSearchUrl","AI_SEARCH_URL");
    var searchKey = builder.AddParameterFromConfiguration("aiSearchKey", "AI_SEARCH_KEY", secret: true);
    search = builder.AddConnectionString("search", ReferenceExpression.Create($"Endpoint={searchUrl};Key={searchKey}"));   
}

var mcpTools = builder.AddProject<Projects.eShopMcpTool>("mcp")
    .WithEndpoint(scheme: "http", name: "mcp");


var products = builder.AddProject<Projects.Products>("products")
    .WithReference(openAI)
    .WithReference(search)
    .WithReference(imageStorageContainer)
    .WithEnvironment("OAI_CHATMODEL", chatModel)
    .WithEnvironment("OAI_CHATMODEL_NANO", builder.Configuration["OAI_CHATMODEL_NANO"])
    .WithEnvironment("OAI_CHATMODEL_MINI", builder.Configuration["OAI_CHATMODEL_MINI"])
    .WithEnvironment("OAI_IMAGEMODEL", imageModel)
    .WithEnvironment("OAI_EMBEDMODEL", embeddingModel)
    .WaitFor(imageStorageContainer)
    .WaitFor(search)
    .WaitFor(chatModel)
    .WaitFor(imageModel)
    .WaitFor(embeddingModel);

var store = builder.AddProject<Projects.Store>("store")
    .WithReference(openAI)
    .WithReference(products)
    .WithReference(imageStorageContainer)
    .WithReference(mcpTools)
    .WithEnvironment("MCP_ENDPOINT", mcpTools.GetEndpoint("mcp"))
    .WithEnvironment("OAI_CHATMODEL", chatModel)
    .WithEnvironment("OAI_CHATMODEL_NANO", builder.Configuration["OAI_CHATMODEL_NANO"])
    .WithEnvironment("OAI_CHATMODEL_MINI", builder.Configuration["OAI_CHATMODEL_MINI"])
    .WithEnvironment("OAI_IMAGEMODEL", imageModel)
    .WithEnvironment("OAI_EMBEDMODEL", embeddingModel)
    .WithExternalHttpEndpoints()
    .WaitFor(mcpTools)
    .WaitFor(imageStorageContainer)
    .WaitFor(products)
    .WaitFor(chatModel)
    .WaitFor(imageModel)
    .WaitFor(embeddingModel);

builder.Build().Run();