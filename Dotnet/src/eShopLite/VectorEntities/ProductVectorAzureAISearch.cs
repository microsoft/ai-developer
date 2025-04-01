using Microsoft.Extensions.VectorData;

namespace VectorEntities
{
    public class ProductVectorAzureAISearch 
    {
        [VectorStoreRecordKey]
        public string Id { get; set; }

        [VectorStoreRecordData]
        public string? Name { get; set; }

        [VectorStoreRecordData]
        public string? Description { get; set; }

        [VectorStoreRecordData]
        public string Price { get; set; }

        [VectorStoreRecordData]
        public string ImageUrl { get; set; }

        [VectorStoreRecordVector(1536, DistanceFunction.CosineSimilarity)]
        public ReadOnlyMemory<float> Vector { get; set; }
    }
}
