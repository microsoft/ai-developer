using Agents.Tools;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using ModelContextProtocol.Client;

namespace Agents.MultiAgent;
#pragma warning disable SKEXP0110
public static class AgentRegistry
{
    private static IMcpClient? _mcpClient = null;
    private static readonly Dictionary<string, Agent> _agents = [];
    private const string TaskTrackingAgentName = "TaskTrackingAgent";
    private const string DataImportAgent = "DataImportAgent";
    private const string MarketAnalystAgentName = "MarketAnalystAgent";
    private const string DatabaseSpecialistAgentName = "DatabaseSpecialistAgent";
    private const string MarketingAgentName = "MarketingAgent";
    private const string ContentCreatorAgentName = "ContentCreatorAgent";

    public static async Task SetupAgentsAsync(
        Kernel kernel, 
        IServiceProvider serviceProvider, 
        IConfiguration configuration, 
        ILogger logger)
    {
        if (_agents.Count > 0) // already setup, we can just skip.
            return;

        // Challenge 13 - Create the Task Tracking Agent
        logger.LogInformation("Creating Task Agent");
        await CreateTaskTrackingAgentAsync(kernel, configuration, logger).ConfigureAwait(false);
        logger.LogInformation("Creating Data Analyst Agent");
        CreateDataImportAgent(kernel, logger);
        logger.LogInformation("Creating Market Analyst Agent");
        CreateMarketAnalystAgent(kernel, logger);
        logger.LogInformation("Creating Content Creator Agent");
        CreateContentCreatorAgent(kernel, serviceProvider, logger);
        logger.LogInformation("Creating Database Specialist Agent");
        CreateDatabaseSpecialistAgent(kernel, serviceProvider, logger);
        logger.LogInformation("Creating Marketing Agent");
        CreateMarketingAgent(kernel, logger); ;
    }

    public static Dictionary<string, Agent> Agents => _agents;

    public static void ClearAgents()
    {
        _agents.Clear();
    }

    private static async Task CreateTaskTrackingAgentAsync(Kernel kernel, IConfiguration configuration, ILogger logger)
    {
        
    }

    private static void CreateDataImportAgent(Kernel kernel, ILogger logger)
    {
        
    }

    private static void CreateMarketAnalystAgent(Kernel kernel, ILogger logger)
    {
        
    }

    private static void CreateDatabaseSpecialistAgent(Kernel kernel, IServiceProvider serviceProvider, ILogger logger)
    {
        
    }

    private static void CreateMarketingAgent(Kernel kernel, ILogger logger)
    {
        
    }

    private static void CreateContentCreatorAgent(Kernel kernel, IServiceProvider serviceProvider, ILogger logger)
    {
        
    }
}