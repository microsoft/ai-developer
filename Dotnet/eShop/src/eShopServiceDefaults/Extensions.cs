using System.Net;
using Aspire.Azure.AI.OpenAI;
using Azure.Identity;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Http.Resilience;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

namespace Microsoft.Extensions.Hosting
{
    // Adds common .NET Aspire services: service discovery, resilience, health checks, and OpenTelemetry.
    // This project should be referenced by each service project in your solution.
    // To learn more about using this project, see https://aka.ms/dotnet/aspire/service-defaults
    public static class Extensions
    {
        public static IHostApplicationBuilder AddServiceDefaults(this IHostApplicationBuilder builder)
        {
            builder.ConfigureOpenTelemetry();

            builder.AddDefaultHealthChecks();

            builder.Services.AddServiceDiscovery();

            builder.Services.ConfigureHttpClientDefaults(http =>
            {
                // Turn on resilience by default
                // http.AddStandardResilienceHandler();

                http.AddStandardResilienceHandler(config =>
                {
                    TimeSpan timeSpan = TimeSpan.FromMinutes(2);
                    config.AttemptTimeout.Timeout = timeSpan;
                    config.CircuitBreaker.SamplingDuration = timeSpan * 2;
                    config.TotalRequestTimeout.Timeout = timeSpan * 3;
                    config.Retry.MaxRetryAttempts = 3;
                });

                // Turn on service discovery by default
                http.AddServiceDiscovery();
            });

            // Uncomment the following to restrict the allowed schemes for service discovery.
            // Our MCP tools are set up for HTTP, so please don't uncomment this code.
            // builder.Services.Configure<ServiceDiscoveryOptions>(options =>
            // {
            //     options.AllowedSchemes = ["https"];
            // });

            return builder;
        }

        public static IHostApplicationBuilder AddAzureOpenAIServices(this IHostApplicationBuilder builder)
        {
            AppContext.SetSwitch("Microsoft.SemanticKernel.Experimental.GenAI.EnableOTelDiagnosticsSensitive", true);
            
            var openAiConnectionString = builder.Configuration.GetConnectionString("openai");
            if (string.IsNullOrWhiteSpace(openAiConnectionString))
            {
                throw new InvalidOperationException("The OpenAI connection string is not configured.");
            }
            AspireAzureOpenAIClientBuilder oaiClient;
            if (openAiConnectionString.Contains("Key="))
            {
                oaiClient = builder.AddAzureOpenAIClient("openai");
            }
            else
            {
                oaiClient = builder.AddAzureOpenAIClient("openai", options =>
                {
                    options.Credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
                    {
                        ExcludeManagedIdentityCredential = true,
                        ExcludeVisualStudioCredential = true,
                    });
                });
            }
            
            var chatModel = builder.Configuration["OAI_CHATMODEL"];
            var imageModel = builder.Configuration["OAI_IMAGEMODEL"];
            var embeddingModel = builder.Configuration["OAI_EMBEDMODEL"];
            
            oaiClient.AddEmbeddingGenerator(embeddingModel);
            oaiClient.AddKeyedChatClient("default", chatModel);
            oaiClient.AddKeyedChatClient("nano", builder.Configuration["OAI_CHATMODEL_NANO"]);
            oaiClient.AddKeyedChatClient("mini", builder.Configuration["OAI_CHATMODEL_MINI"]);

            // Add Semantic Kernel to the DI container
            var kernelBuilder = builder.Services.AddKernel()
                .AddAzureOpenAIChatCompletion(chatModel, serviceId: "full")
                .AddAzureOpenAIChatCompletion(builder.Configuration["OAI_CHATMODEL_NANO"], serviceId: "nano")
                .AddAzureOpenAIChatCompletion(builder.Configuration["OAI_CHATMODEL_MINI"], serviceId: "mini")
                .AddAzureOpenAIEmbeddingGenerator(embeddingModel)
                .AddAzureOpenAITextToImage(imageModel);
            
            kernelBuilder.Services.ConfigureHttpClientDefaults(c =>
            {
                c.AddStandardResilienceHandler().Configure(o =>
                {
                    o.Retry.ShouldRetryAfterHeader = true;
                    o.Retry.ShouldHandle = args => ValueTask.FromResult(args.Outcome.Result?.StatusCode is HttpStatusCode.TooManyRequests);
                });
            });
            return builder;
        }

        public static IHostApplicationBuilder ConfigureOpenTelemetry(this IHostApplicationBuilder builder)
        {
            builder.Logging.AddOpenTelemetry(logging =>
            {
                logging.IncludeFormattedMessage = true;
                logging.IncludeScopes = true;
            });

            // enable openai telemetry
            AppContext.SetSwitch("OpenAI.Experimental.EnableOpenTelemetry", true);
            AppContext.SetSwitch("Azure.Experimental.EnableActivitySource", true);
            AppContext.SetSwitch("Azure.Experimental.TraceGenAIMessageContent", true);

            builder.Services.AddOpenTelemetry()
                .WithMetrics(metrics =>
                {
                    metrics.AddAspNetCoreInstrumentation()
                        .AddHttpClientInstrumentation()
                        .AddRuntimeInstrumentation()
                        .AddMeter("*")
                        .AddMeter("OpenAI.*")
                        .AddMeter("Microsoft.SemanticKernel*");
                })
                .WithTracing(tracing =>
                {
                    tracing.AddAspNetCoreInstrumentation()
                        // Uncomment the following line to enable gRPC instrumentation (requires the OpenTelemetry.Instrumentation.GrpcNetClient package)
                        //.AddGrpcClientInstrumentation()
                        .AddHttpClientInstrumentation((options) =>
                        {
                            options.EnrichWithHttpRequestMessage = (activity, httpRequestMessage) =>
                            {
                                activity.SetTag("http.request.content",
                                    httpRequestMessage.Content?.ReadAsStringAsync().Result);
                            };

                            options.EnrichWithHttpResponseMessage = (activity, httpResponseMessage) =>
                            {
                                activity.SetTag("http.response.content",
                                    httpResponseMessage.Content?.ReadAsStringAsync().Result);
                            };
                        })
                        .AddSource("*")
                        .AddSource("OpenAI.*")
                        .AddSource("Microsoft.SemanticKernel*");
                })
                .WithLogging();

            builder.AddOpenTelemetryExporters();

            return builder;
        }

        private static IHostApplicationBuilder AddOpenTelemetryExporters(this IHostApplicationBuilder builder)
        {
            var useOtlpExporter = !string.IsNullOrWhiteSpace(builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"]);

            if (useOtlpExporter)
            {
                builder.Services.AddOpenTelemetry().UseOtlpExporter();
            }

            // Uncomment the following lines to enable the Azure Monitor exporter (requires the Azure.Monitor.OpenTelemetry.AspNetCore package)
            if (!string.IsNullOrEmpty(builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]))
            {
                builder.Services.AddOpenTelemetry()
                   .UseAzureMonitor();
            }

            return builder;
        }

        public static IHostApplicationBuilder AddDefaultHealthChecks(this IHostApplicationBuilder builder)
        {
            builder.Services.AddHealthChecks()
                // Add a default liveness check to ensure app is responsive
                .AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);

            return builder;
        }

        public static WebApplication MapDefaultEndpoints(this WebApplication app)
        {
            // Adding health checks endpoints to applications in non-development environments has security implications.
            // See https://aka.ms/dotnet/aspire/healthchecks for details before enabling these endpoints in non-development environments.
            if (app.Environment.IsDevelopment())
            {
                // All health checks must pass for app to be considered ready to accept traffic after starting
                app.MapHealthChecks("/health");

                // Only health checks tagged with the "live" tag must pass for app to be considered alive
                app.MapHealthChecks("/alive", new HealthCheckOptions
                {
                    Predicate = r => r.Tags.Contains("live")
                });
            }

            return app;
        }
    }
}
