using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using System.Text.Json.Serialization;
using Agents.Tools.Models;
using AiEntities;
using eShopMcpTool.Entities;
using ModelContextProtocol.Server;

namespace eShopMcpTool;

[JsonSerializable(typeof(ToolRequestDTOs))]
[JsonSerializable(typeof(AddProductsToCreateMemoryRequest))]
[JsonSerializable(typeof(CreateProductDTO))]
[JsonSerializable(typeof(ProductAnalysisDTO))]
[JsonSerializable(typeof(WorkflowState))]
[JsonSerializable(typeof(Step))]
internal partial class eShopMcpServerJsonContext : JsonSerializerContext
{
}

internal static partial class McpJsonExtension
{
    [DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes.PublicMethods)]
    internal static IMcpServerBuilder WithToolsAndJsonObjectContext(this IMcpServerBuilder builder, Type toolType)
    {
        Debug.Assert(builder != null);
        Debug.Assert(toolType != null);

        foreach (var toolMethod in toolType.GetMethods(BindingFlags.Static | BindingFlags.Public))
        {
            if (toolMethod.GetCustomAttribute<McpServerToolAttribute>() is not null)
            {
                builder.Services.AddSingleton(services => McpServerTool.Create(
                    toolMethod,
                    options: new McpServerToolCreateOptions()
                    {
                        Services = services,
                        SerializerOptions = eShopMcpServerJsonContext.Default.Options
                    }));
            }
        }
        return builder;
    }
    
}