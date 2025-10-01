//using eShopMcpTool;
//using eShopMcpTool.Tools;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add MCP Server Registration
// With HttpTransport
// and with Tools and Json object Context


// Add in-memory cache

var app = builder.Build();

// map MCP server to the app

app.Run();