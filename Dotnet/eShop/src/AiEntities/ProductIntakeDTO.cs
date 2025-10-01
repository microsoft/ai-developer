using System.Text.Json.Serialization;

namespace AiEntities;

public record ProductIntakeDTO
{
    [JsonPropertyName("product_name")]
    public string ProductName { get; init; }

    [JsonPropertyName("sku")]
    public string Sku { get; init; }

    [JsonPropertyName("price_per_unit")]
    public decimal PricePerUnit { get; init; }

    [JsonPropertyName("moq")]
    public int MinimumOrderQuantity { get; init; }

    [JsonPropertyName("shipping_cost_per_unit")]
    public decimal ShippingCostPerUnit { get; init; }

    [JsonPropertyName("available_colors")]
    public IEnumerable<string> AvailableColors { get; init; } = new List<string>();

    [JsonPropertyName("lead_time_in_days")]
    public string LeadTimeInDays { get; init; }

    [JsonPropertyName("additional_details")]
    public string AdditionalDetails { get; init; }

    [JsonPropertyName("supplier_name")]
    public string SupplierName { get; init; }
}
