using Azure.Search.Documents.Indexes;
using Microsoft.Extensions.VectorData;
using Microsoft.SemanticKernel.Connectors.AzureAISearch;
using Microsoft.SemanticKernel.Embeddings;
using Products.Models;
using VectorEntities;

#pragma warning disable SKEXP0001 


namespace Products.Memory;

public class AiSearchInitializer
{
    private ILogger _logger;
    public ITextEmbeddingGenerationService? _embeddingClient;
    public SearchIndexClient? _azureSearchIndexClient;
    public IVectorStoreRecordCollection<string, ProductVectorAzureAISearch> _productsCollection;

    public AiSearchInitializer(ILogger logger, ITextEmbeddingGenerationService? textEmbeddingGenerationService, SearchIndexClient? azureSearchIndexClient)
    {
        _logger = logger;
        _embeddingClient = textEmbeddingGenerationService;
        _azureSearchIndexClient = azureSearchIndexClient;

        _logger.LogInformation("Memory context created");
        _logger.LogInformation($"Embedding Client is null: {_embeddingClient is null}");
        _logger.LogInformation($"Azure Search Index Client  is null: {_azureSearchIndexClient is null}");
    }

    public async Task<bool> InitAiSearchAsync(Context db)
    {
        _logger.LogInformation("Initializing memory context with AI Search Vector Store");
        if (_embeddingClient is null) {
            _logger.LogError("Embedding client is null");
            return false;
        }
        if (_azureSearchIndexClient is null) {
            _logger.LogError("Azure Search Index client is null");
            return false;
        }
        var vectorProductStore = new AzureAISearchVectorStore(_azureSearchIndexClient);
        _productsCollection = vectorProductStore.GetCollection<string, ProductVectorAzureAISearch>("products");
        await _productsCollection.CreateCollectionIfNotExistsAsync();

        _logger.LogInformation("Get a copy of the list of products");
        // iterate over the products and add them to the memory
        foreach (var product in db.GetAll()) {
            try {
                _logger.LogInformation("Adding product to AI Search: {Product}", product.Name);
                var productInfo = $"[{product.Name}] is a product that costs [{product.Price}] and is described as [{product.Description}]";

                // new product vector
                var productVector = new ProductVectorAzureAISearch {
                    Id = product.Id.ToString(),
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price.ToString(),
                    ImageUrl = product.ImageUrl,
                    Vector = await _embeddingClient.GenerateEmbeddingAsync(productInfo)
                };
                var recordId = await _productsCollection.UpsertAsync(productVector);
                _logger.LogInformation("Product added to memory: {Product} with recordId: {RecordId}", product.Name, recordId);
            } catch (Exception exc) {
                _logger.LogError(exc, "Error adding product to memory");
            }
        }

        _logger.LogInformation("DONE! Updating AI Search");
        return true;
    }


}