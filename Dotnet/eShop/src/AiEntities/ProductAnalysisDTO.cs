using System.Text.Json.Serialization;

namespace AiEntities
{
    public record ProductAnalysisDTO
    {
        [JsonPropertyName("productName")]
        public string ProductName { get; init; }

        [JsonPropertyName("analysisReasoning")]
        public string AnalysisReasoning { get; init; }

        [JsonPropertyName("price")]
        public decimal Price { get; init; }
        [JsonPropertyName("expectedProfitMargin")]
        public decimal ExpectedProfitMargin { get; init; }
    }
}