using Agents.MultiAgent.Manager;
using Agents.Queue;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.FluentUI.AspNetCore.Components;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace Store.Components.Pages;

public partial class MultiAgentImport
{
    [Inject]
    private IDialogService DialogService { get; set; } = null!;

    [Inject]
    private ILogger<MultiAgentImport> Logger { get; set; } = null!;

    [Inject]
    private IBackgroundTaskQueue TaskQueue { get; set; } = null!;

    [Inject]
    private IConfiguration Configuration { get; set; } = null!;

    private bool _isProcessing = false;
    private string _emailFileName = string.Empty;
    private string _spreadsheetFileName = string.Empty;
    private IBrowserFile? _emailFile;
    private IBrowserFile? _spreadsheetFile;

    private void OnEmailFileSelected(InputFileChangeEventArgs e)
    {
        Console.WriteLine("Email file selected: {0}", e.File.Name);
        _emailFile = e.File;
        _emailFileName = e.File.Name;
        StateHasChanged();
    }

    private async void TimerCallbackAsync(object? _)
    {
        await RefreshWorkflowStatusAsync();
    }


    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await base.OnAfterRenderAsync(firstRender);
    }

    private async Task StartWorkflowAsync()
    {
        if (_emailFile == null || _spreadsheetFile == null) return;
        _currentWorkflowStarted = DateTime.Now;
        _isProcessing = true;
        _workflowId = Guid.NewGuid();
        try
        {
            Logger.LogInformation("Saving Files out to temp paths");
            // Save files to temp location
            var emailPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid() + ".eml");
            var spreadsheetPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid() + ".xlsx");

            Logger.LogInformation("Opening provided files.");

            await using (var emailStream = File.Create(emailPath))
            {
                await _emailFile.OpenReadStream(maxAllowedSize: 10 * 1024 * 1024).CopyToAsync(emailStream);
            }

            await using (var spreadsheetStream = File.Create(spreadsheetPath))
            {
                await _spreadsheetFile.OpenReadStream(maxAllowedSize: 10 * 1024 * 1024).CopyToAsync(spreadsheetStream);
            }

            // Start the workflow with the file paths
            Logger.LogInformation("Queueing workflow to run in background.");
            await TaskQueue.QueueBackgroundWorkItemAsync(async token =>
            {
                await ExecuteMultiAgentWorkflowAsync(token, emailPath, spreadsheetPath);
            });

            _isProcessing = true;
            StateHasChanged();
            // Start a timer to periodically refresh the workflow status
            _statusRefreshTimer ??= new Timer(TimerCallbackAsync, null, TimeSpan.FromSeconds(10), TimeSpan.FromSeconds(10));

            await RefreshWorkflowStatusAsync();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error starting workflow");
            _currentWorkflowErrorMessage = ex.Message;
        }
    }

    private async Task RefreshWorkflowStatusAsync()
    {
        await InvokeAsync(StateHasChanged);
    }

    private void OnSpreadsheetFileSelected(InputFileChangeEventArgs e)
    {
        _spreadsheetFile = e.File;
        _spreadsheetFileName = e.File.Name;
        StateHasChanged();
    }
}