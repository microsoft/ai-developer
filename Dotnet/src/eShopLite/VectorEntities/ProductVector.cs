using DataEntities;
using Microsoft.Extensions.VectorData;

namespace VectorEntities
{
    public class ProductVector : Product
    {
        [VectorStoreRecordKey]
        public override int Id { get => base.Id; set => base.Id = value; }

        [VectorStoreRecordData]
        public override string? Name { get => base.Name; set => base.Name = value; }

        [VectorStoreRecordData]
        public override string? Description { get => base.Description; set => base.Description = value; }

        [VectorStoreRecordData]
        public override decimal Price { get => base.Price; set => base.Price = value; }

        [VectorStoreRecordVector(384, DistanceFunction.CosineSimilarity)]
        public ReadOnlyMemory<float> Vector { get; set; }
    }
}
