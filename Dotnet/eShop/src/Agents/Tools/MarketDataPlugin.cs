using System.ComponentModel;
using Microsoft.SemanticKernel;

namespace Agents.Tools
{
    public class MarketDataPlugin
    {
        [KernelFunction, Description("Loads supply chain data and returns it in CSV format.")]
        public async Task<string> LoadSupplyChainData()
        {
            string filePath = Path.Combine("data", "ai_supply_chain.csv");

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"The file '{filePath}' was not found.");
            }

            using (var reader = new StreamReader(filePath))
            {
                return await reader.ReadToEndAsync();
            }
        }

        [KernelFunction, Description("Loads pricing data from competitors and returns it in CSV format.")]
        public async Task<string> LoadPricingData()
        {
            string filePath = Path.Combine("data", "ai_price.csv");

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"The file '{filePath}' was not found.");
            }

            using (var reader = new StreamReader(filePath))
            {
                return await reader.ReadToEndAsync();
            }
        }
    }
}
