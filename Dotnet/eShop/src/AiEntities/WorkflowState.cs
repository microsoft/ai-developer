using System.Text.Json.Serialization;
using Agents.Tools.Models;

namespace AiEntities;

public record WorkflowState
{
    [JsonPropertyName("workflowId")]
    public Guid WorkflowId { get; init; }

    [JsonPropertyName("step")]
    public Step Step { get; init; }

    [JsonPropertyName("inputEmail")]
    public string InputEmail { get; init; }

    [JsonPropertyName("inputProductCatalog")]
    public string InputProductCatalog { get; init; }

    [JsonPropertyName("chosenProducts")]
    public ProductAnalysisDTO[] ChosenProducts { get; init; } = [];

    [JsonPropertyName("analyzedProducts")]
    public ProductAnalysisDTO[] AnalyzedProducts { get; init; } = [];

    [JsonPropertyName("productsToCreate")]
    public CreateProductDTO[] ProductsToCreate { get; init; } = [];

    [JsonPropertyName("newProductsToAnalyze")]
    public ProductIntakeDTO[] NewProductsToAnalyze { get; init; } = [];
}