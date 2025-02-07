namespace WorkItems;

public class WorkItemsDTO
{
    public int ID { get; set; }
    public string WorkItemType { get; set; }
    public string Title { get; set; }
    public string AssignedTo { get; set; }
    public string State { get; set; }
    public string Tags { get; set; }
}
