using System.Text.Json.Serialization;

namespace SearchEntities;

public class SearchResponse
{
    [JsonPropertyName("id")]
    public string? Response { get; set; }

    [JsonPropertyName("products")]
    public List<DataEntities.Product>? Products { get; set; }

    [JsonPropertyName("elapsedtime")]
    public TimeSpan ElapsedTime { get; set; }
}


[JsonSerializable(typeof(SearchResponse))]
public sealed partial class SearchResponseSerializerContext : JsonSerializerContext
{
}