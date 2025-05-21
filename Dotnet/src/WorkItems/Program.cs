using Scalar.AspNetCore;
using System.Globalization;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Any;

namespace WorkItems
{
    public class Program
    {
        private static readonly List<WorkItemsDTO> workitems;
        private static readonly List<string> workItemTypes;
        private static readonly List<string> workItemStates;

        static Program()
        {
            workitems = new List<WorkItemsDTO>();
            workItemTypes = new List<string>();
            workItemStates = new List<string>();
            LoadWorkItemsFromCsv(@"data\workitems.csv");
        }

        private static void LoadWorkItemsFromCsv(string filePath)
        {
            if (File.Exists(filePath))
            {
                var lines = File.ReadAllLines(filePath);
                foreach (var line in lines.Skip(1)) // Skip header line
                {
                    var values = line.Split(',');
                    //ID,WorkItemType,Title,AssignedTo,State,Tags
                    var workItem = new WorkItemsDTO
                    {
                        ID = int.Parse(values[0], CultureInfo.InvariantCulture),
                        WorkItemType = values[1],
                        Title = values[2],
                        AssignedTo = values[3],
                        State = values[4],
                        Tags = values[5]
                    };
                    workitems.Add(workItem);

                    if (!workItemTypes.Contains(workItem.WorkItemType))
                    {
                        workItemTypes.Add(workItem.WorkItemType);
                    }

                    if (!workItemStates.Contains(workItem.State))
                    {
                        workItemStates.Add(workItem.State);
                    }
                }
            }
        }

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.AddServiceDefaults();

            // Add services to the container.
            builder.Services.AddAuthorization();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            // Configure OpenAPI and endpoints
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference(options =>
                {
                    options
                        .WithTitle("Work Items API")
                        .WithTheme(ScalarTheme.Alternate)
                        .WithDarkMode(true)
                        .WithLayout(ScalarLayout.Classic)
                        .WithClientButton(false);
                });
            }

            app.UseCors("AllowAll");
            app.UseAuthorization();
            app.MapGet("/workitems", () => Results.Ok(workitems))
                .WithName("get_all_work_items")
                .WithOpenApi(operation => new(operation)
                {
                    Summary = "Gets all work items",
                    Description = "Retrieves all work items including Bug, Epic, Feature, Task, Test Case, Test Plan, Test Suite, or User Story for all users.",
                    Tags = new List<OpenApiTag> { new() { Name = "WorkItems" } },
                    Responses =
                    {
                        ["200"] = new() { Description = "A list of work items" }
                    }
                });

            app.MapGet("/myworkitems", () => Results.Ok(workitems.Where(wi => wi.AssignedTo == "User1")))
                .WithName("get_my_work_items")
                .WithOpenApi(operation => new(operation)
                {
                    Summary = "Gets current user's work items",
                    Description = "Retrieves work items assigned to the current user including Bug, Epic, Feature, Task, Test Case, Test Plan, Test Suite, or User Story.",
                    Tags = new List<OpenApiTag> { new() { Name = "WorkItems" } },
                    Responses =
                    {
                        ["200"] = new() { Description = "A list of work items assigned to the current user" }
                    }
                });

            app.MapGet("/workitems/{id}", (int id) =>
            {
                var workItem = workitems.FirstOrDefault(wi => wi.ID == id);
                return workItem is not null ? Results.Ok(workItem) : Results.NotFound();
            })
            .WithName("get_work_item_by_id")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Gets a work item by ID",
                Description = "Retrieves a specific work item by its ID.",
                Tags = new List<OpenApiTag> { new() { Name = "WorkItems" } },
                Parameters =
                {
                    new()
                    {
                        Name = "id",
                        In = ParameterLocation.Path,
                        Required = true,
                        Description = "The ID of the work item",
                        Schema = new() { Type = "integer" }
                    }
                },
                Responses =
                {
                    ["200"] = new() { Description = "The requested work item" },
                    ["404"] = new() { Description = "Work item not found" }
                }
            });

            app.MapPost("/workitems", (WorkItemsDTO newWorkItem) =>
            {
                workitems.Add(newWorkItem);
                if (!workItemTypes.Contains(newWorkItem.WorkItemType))
                {
                    workItemTypes.Add(newWorkItem.WorkItemType);
                }
                if (!workItemStates.Contains(newWorkItem.State))
                {
                    workItemStates.Add(newWorkItem.State);
                }
                return Results.Created($"/workitems/{newWorkItem.ID}", newWorkItem);
            })
            .WithName("create_work_item")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Creates a new work item",
                Description = "Creates a new work item with the provided details.",
                Tags = new List<OpenApiTag> { new() { Name = "WorkItems" } },
                RequestBody = new()
                {
                    Description = "The work item to create",
                    Required = true,
                    Content =
                    {
                        ["application/json"] = new()
                        {
                            Schema = new() { Reference = new() { Id = "WorkItemsDTO", Type = ReferenceType.Schema } }
                        }
                    }
                },
                Responses =
                {
                    ["201"] = new() { Description = "The created work item" }
                }
            });

            app.MapPut("/workitems/{id}", (int id, WorkItemsDTO updatedWorkItem) =>
            {
                var workItem = workitems.FirstOrDefault(wi => wi.ID == id);
                if (workItem is null)
                {
                    return Results.NotFound();
                }

                if (!string.IsNullOrEmpty(updatedWorkItem.WorkItemType))
                {
                    workItem.WorkItemType = updatedWorkItem.WorkItemType;
                    if (!workItemTypes.Contains(updatedWorkItem.WorkItemType))
                    {
                        workItemTypes.Add(updatedWorkItem.WorkItemType);
                    }
                }
                if (!string.IsNullOrEmpty(updatedWorkItem.Title))
                {
                    workItem.Title = updatedWorkItem.Title;
                }
                if (!string.IsNullOrEmpty(updatedWorkItem.AssignedTo))
                {
                    workItem.AssignedTo = updatedWorkItem.AssignedTo;
                }
                if (!string.IsNullOrEmpty(updatedWorkItem.State))
                {
                    workItem.State = updatedWorkItem.State;
                    if (!workItemStates.Contains(updatedWorkItem.State))
                    {
                        workItemStates.Add(updatedWorkItem.State);
                    }
                }
                if (!string.IsNullOrEmpty(updatedWorkItem.Tags))
                {
                    workItem.Tags = updatedWorkItem.Tags;
                }

                return Results.Ok(workItem);
            })
            .WithName("update_work_item")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Updates an existing work item",
                Description = "Updates the details of an existing work item by its ID. Only the provided fields will be updated.",
                Tags = new List<OpenApiTag> { new() { Name = "WorkItems" } },
                Parameters =
                {
                    new()
                    {
                        Name = "id",
                        In = ParameterLocation.Path,
                        Required = true,
                        Description = "The ID of the work item to update",
                        Schema = new() { Type = "integer" }
                    }
                },
                RequestBody = new()
                {
                    Description = "The updated work item details",
                    Required = true,
                    Content =
                    {
                        ["application/json"] = new()
                        {
                            Schema = new() { Reference = new() { Id = "WorkItemsDTO", Type = ReferenceType.Schema } }
                        }
                    }
                },
                Responses =
                {
                    ["200"] = new() { Description = "The updated work item" },
                    ["404"] = new() { Description = "Work item not found" }
                }
            });

            app.MapDelete("/workitems/{id}", (int id) =>
            {
                var workItem = workitems.FirstOrDefault(wi => wi.ID == id);
                if (workItem is null)
                {
                    return Results.NotFound();
                }

                workitems.Remove(workItem);
                return Results.NoContent();
            })
            .WithName("delete_work_item")
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Deletes a work item",
                Description = "Deletes a specific work item by its ID.",
                Tags = new List<OpenApiTag> { new() { Name = "WorkItems" } },
                Parameters =
                {
                    new()
                    {
                        Name = "id",
                        In = ParameterLocation.Path,
                        Required = true,
                        Description = "The ID of the work item to delete",
                        Schema = new() { Type = "integer" }
                    }
                },
                Responses =
                {
                    ["204"] = new() { Description = "Work item deleted" },
                    ["404"] = new() { Description = "Work item not found" }
                }
            });

            app.MapGet("/workitemtypes", () => Results.Ok(workItemTypes))
                .WithName("get_work_item_types")
                .WithOpenApi(operation => new(operation)
                {
                    Summary = "Gets all work item types",
                    Description = "Retrieves a list of distinct work item types.",
                    Tags = new List<OpenApiTag> { new() { Name = "WorkItems" } },
                    Responses =
                    {
                        ["200"] = new() { Description = "A list of work item types" }
                    }
                });

            app.MapGet("/workitemstates", () => Results.Ok(workItemStates))
                .WithName("get_work_item_states")
                .WithOpenApi(operation => new(operation)
                {
                    Summary = "Gets all work item states",
                    Description = "Retrieves a list of distinct work item states.",
                    Tags = new List<OpenApiTag> { new() { Name = "WorkItems" } },
                    Responses =
                    {
                        ["200"] = new() { Description = "A list of work item states" }
                    }
                });

            app.Run();
        }
    }
}

