namespace WorkItems;

public class WorkItemsDTO
{
    public int ID { get; set; }
    public required string WorkItemType { get; set; } = string.Empty;
    public required string Title { get; set; } = string.Empty;
    public required string AssignedTo { get; set; } = string.Empty;
    public required string State { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
}
