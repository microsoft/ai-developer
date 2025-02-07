using BlazorAI.Components.Models;
using Markdig;
using Microsoft.AspNetCore.Components;
using Microsoft.FluentUI.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BlazorAI.Components.Pages;

#pragma warning disable SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
#pragma warning disable SKEXP0050 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
#pragma warning disable SKEXP0010 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
#pragma warning disable SKEXP0040 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
#pragma warning disable SKEXP0020 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

public partial class Chat
{
    private const int MIN_ROWS = 2;
    private const int MAX_ROWS = 6;
    private string newMessage = string.Empty;
    private int textRows = 0;
    bool loading = false;
    private FluentButton submitButton;
    private FluentTextArea inputTextArea;
    private int messagesLastScroll = 0;
    private bool displayToolMessages = false;

    [Inject]
    private IKeyCodeService KeyCodeService { get; set; }

    [Inject]
    IJSRuntime JsRuntime { get; set; } = null!;

    [Inject]
    public AppState AppState { get; set; } = null!;


    private MarkdownPipeline pipeline = new MarkdownPipelineBuilder()
        .UseAdvancedExtensions()
        .UseBootstrap()
        .UseEmojiAndSmiley()
        .Build();

    protected override async Task OnInitializedAsync()
    {
        // This is used by Blazor to capture the user input for shortcut keys.
        KeyCodeService.Clear();
        KeyCodeService.RegisterListener(OnKeyDownAsync);
        // Initialize the chat history here
        await InitializeSemanticKernel();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await base.OnAfterRenderAsync(firstRender);
        await JsRuntime.InvokeVoidAsync("highlightCode");

        if (!firstRender && chatHistory != null && chatHistory.Any() && messagesLastScroll != chatHistory.Count)
        {
            messagesLastScroll = chatHistory.Count;
            await JsRuntime.InvokeVoidAsync("scrollToBottom");
        }
    }

    protected string MessageInput
    {
        get => newMessage;
        set
        {
            newMessage = value;
            CalculateTextRows(value);
        }
    }

    private void ClearChat()
    {
        chatHistory?.Clear();
    }

    private void CalculateTextRows(string value)
    {
        textRows = Math.Max(value.Split('\n').Length, value.Split('\r').Length);
        textRows = Math.Max(textRows, MIN_ROWS);
        textRows = Math.Min(textRows, MAX_ROWS);
    }

    private async Task OnKeyDownAsync(FluentKeyCodeEventArgs args)
    {
        if (args.CtrlKey && args.Value == "Enter")
        {
            Console.WriteLine("Ctrl+Enter Pressed");
            await InvokeAsync(async () =>
            {
                StateHasChanged();
                await Task.Delay(180);
                Console.WriteLine("Value in TextArea: {0}", MessageInput);
                await submitButton.OnClick.InvokeAsync();
            });
        }
    }
}
