using Agents.Queue;
using Agents.Service;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;

namespace Agents.Extensions;

[Experimental("SKEXP0110")]
public static class MultiAgentExtensions
{
    /// <summary>
    /// Adds the OverlordAgent to the service collection as a singleton.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configureAgents">Optional action to configure agents for the Overlord.</param>
    /// <returns>The service collection for method chaining.</returns>
    public static async Task<IServiceCollection> RegisterBackgroundServices(
        this IServiceCollection services)
    {
        services.AddHostedService<CoordinatorQueueService>();

        services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>(sp => new BackgroundTaskQueue(5));

        return services;
    }
} 