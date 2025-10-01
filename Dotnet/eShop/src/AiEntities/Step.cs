using System.Text.Json.Serialization;

namespace AiEntities;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Step
{
    Starting,
    ImportingNewProductFromEmailAttachments,
    AnalyzingSupplyChain,
    AnalyzingPricing,
    AnalyzingMarketDemand,
    AnalyzingCompetition,
    ChoosingProducts,
    GeneratingContent,
    AwaitingUserApproval,
    UpdatingDatabase,
    GeneratingMarketingContent,
    AwaitingMarketingApproval,
    SendingMarketingEmail,
    FinalizingReport,
    Completed
}