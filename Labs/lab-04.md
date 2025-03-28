# **Exercise 4**: Import Plugin using OpenAPI

### Estimated Duration: 25 minutes

This hands-on lab explores the integration of OpenAPI with Semantic Kernel to enhance AI-driven applications. Designed for developers new to API orchestration, the lab guides you through leveraging OpenAPI specifications to dynamically load external services as plugins. You will learn how to import the provided WorkItems API as an OpenAPI plugin, enabling seamless interaction through AI-driven prompts. By the end of this lab, you will understand how OpenAPI simplifies API integration, reduces manual coding, and enhances the automation of external service calls. Complete all prerequisites before starting, as the cloud-based environment allows you to complete the lab remotely.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Try the app without the Time Plugin

1. Launch your AI Chat app in any of the languange, and submit the following prompt, and see how it responds:
    ```
    What are my work items?
    ```

## Task 2: Create and import the OpenAPI Plugin

<details>
<summary><strong>Python</strong></summary>

1. Right click on `Python>src>workitems` in the left pane and select **Open in Integrated Terminal**.
1. Use the following command to run the app:
    ```
    python api.py
    ```
    >**Note**:- Please don,t close the `terminal`.
1. You can find the OpenAPI spec in following path `http://127.0.0.1:8000/openapi.json`.
1. Swagger page can be found in `http://127.0.0.1:8000/docs`.
1. Navigate to `Python>src` directory and open **chat.py** file.
1. Add the following code in the `# Placeholder for OpenAPI plugin` section of the file.
    ```
    kernel.add_plugin_from_openapi(
        plugin_name="get_tasks",
        openapi_document_path="http://127.0.0.1:8000/openapi.json",
        execution_settings=OpenAPIFunctionExecutionParameters(
            enable_payload_namespacing=True,
        )
    )
    ```
1. In case you encounter any indentation error, use the code from the following URL:
    ```
    https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/python/lab-04.py
    ```
1. Save the file.
1. Right click on `Python>src` in the left pane and select **Open in Integrated Terminal**.
1. Use the following command to run the app:
    ```
    streamlit run app.py
    ```
1. If the app does not open automatically in the browser, you can access it using the following **URL**:
    ```
    http://localhost:8501
    ```
1. Submit the following prompt and see how the AI responds:
    ```
    What are my work items?
    ```
</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Right click on `Dotnet>src>Aspire>Aspire.AppHost` in the left pane and select **Open in Integrated Terminal**.
1. Use the following command to run the app:
    ```
    dotnet run
    ```
    >**Note**:- Please don,t close the `terminal`.
1. You can find the OpenAPI spec in following path `http://localhost:5115/swagger/v1/swagger.json`.
1. Swagger page can be found in `http://localhost:5115/swagger/index.html`.
1. Navigate to `Dotnet>src>BlazorAI>Components>Pages` directory and open **Chat.razor.cs** file.
1. Add the following code in the `// Import Models` section of the file.
    ```
    using Microsoft.SemanticKernel.Plugins.OpenApi;
    ```
1. Add the following code in the `// Challenge 04 - Import OpenAPI Spec` section of the file.
    ```
    await kernel.ImportPluginFromOpenApiAsync(
        pluginName: "todo",
        uri: new Uri("http://localhost:5115/swagger/v1/swagger.json"),
        executionParameters: new OpenApiFunctionExecutionParameters()
        {
            EnablePayloadNamespacing = true
        }
    );
    ```
1. In case you encounter any indentation error, use the code from the following URL:
    ```
    https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/c%23/lab-04.cs
    ```
1. Save the file.
1. Right click on `Dotnet>src>Aspire>Aspire.AppHost` in the left pane and select **Open in Integrated Terminal**.
1. Use the following command to run the app:
    ```
    dotnet run
    ```
1. Navigate to the link that is in the output section of the terminal:
    >**Note**: The link can be found besides **Login to the dashboard at** in the terminal.

    >**Note**: If you recieve security warnings in the browser, close the browser and follow the link again.
1. Navigate to the link pointing towards **blazor-aichat** i.e **https://localhost:7118/**
1. Submit the following prompt an see how the AI responds:
    ```
    What are my work items?
    ```
</details>

## Summary

In this exercise, we utilized **OpenAPI integration with Semantic Kernel** to enhance AI-driven applications through dynamic API orchestration. We imported the **WorkItems API** as an OpenAPI plugin, enabling seamless interaction with external services using AI-generated prompts. This enhanced our proficiency in simplifying API integration, reducing manual coding, and automating external service calls within intelligent applications.