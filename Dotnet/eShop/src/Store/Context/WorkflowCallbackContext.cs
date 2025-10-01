using System.Diagnostics;
using Microsoft.FluentUI.AspNetCore.Components;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace Store.Context;

public class WorkflowCallbackContext
{
    public required Kernel ScopedKernel { get; init; }
    public required ILogger Logger { get; init; }
    public required IDialogService DialogService { get; init; }
    public required ChatHistory ChatHistory { get; init; }
    public required ActivitySource ActivitySource { get; init; }
    public required Func<Task> InvokeStateHasChanged { get; init; }
    public required Func<bool> GetUserApprovalStatus { get; init; }
    public required Action<bool> SetUserApprovalStatus { get; init; }
    public required Action<DateTime> SetWorkflowUpdated { get; init; }
    public required Action<string> SetResultSummary { get; init; }
}