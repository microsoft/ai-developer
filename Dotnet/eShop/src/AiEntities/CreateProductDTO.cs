using System.Text.Json.Serialization;

namespace Agents.Tools.Models
{
    public record CreateProductDTO
    {
        [JsonPropertyName("name")]
        public virtual string Name { get; init; }

        [JsonPropertyName("description")]
        public virtual string Description { get; init; }

        [JsonPropertyName("price")]
        public virtual decimal Price { get; init; }

        [JsonPropertyName("imageUrl")]
        public virtual string ImageUrl { get; init; }
    }
}

