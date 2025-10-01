using Agents.Queue;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Agents.Service
{
    public class CoordinatorQueueService : BackgroundService
    {
        private readonly ILogger<CoordinatorQueueService> _logger;

        public CoordinatorQueueService(IBackgroundTaskQueue taskQueue,
            ILogger<CoordinatorQueueService> logger)
        {
            _logger = logger;
            TaskQueue = taskQueue;
        }

        public IBackgroundTaskQueue TaskQueue { get; }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("OverlordQueueService running.");
            await BackgroundProcessing(stoppingToken);
        }

        private async Task BackgroundProcessing(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var workItem = await TaskQueue.DequeueAsync(stoppingToken);
                try
                {
                    await workItem(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing {WorkItem}.", nameof(workItem));
                }
            }
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("OverlordQueueService is stopping.");
            return base.StopAsync(cancellationToken);
        }
    }
}
