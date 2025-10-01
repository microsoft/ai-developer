using System.Text.Json.Serialization;
using Agents.Tools.Models;
using AiEntities;

namespace eShopMcpTool.Entities;

public class ToolRequestDTOs
{
    [JsonPropertyName("products")]
    public ProductIntakeDTO[] Products { get; set; }
}

public class AddProductsToCreateMemoryRequest
{
    [JsonPropertyName("products")]
    public CreateProductDTO[] Products { get; set; }
}

