namespace BlazorAI.Components.Models
{
    public class AppState
    {
        public event Action OnChange;

        public void NotifyStateChanged() => OnChange?.Invoke();
    }
}
