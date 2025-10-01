using Microsoft.Extensions.VectorData;


namespace VectorEntities
{
    public class ProductVectorAzureAISearch 
    {
        [VectorStoreKey]
        public string Id { get; set; } = string.Empty;

        [VectorStoreData]
        public string? Name { get; set; }

        [VectorStoreData]
        public string? Description { get; set; }

        [VectorStoreData]
        public string Price { get; set; } = string.Empty;

        [VectorStoreData]
        public string ImageUrl { get; set; } = string.Empty;

        [VectorStoreVector(1536,DistanceFunction=DistanceFunction.CosineSimilarity)]
        public ReadOnlyMemory<float> Vector { get; set; }
    }
}
