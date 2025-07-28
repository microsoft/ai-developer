# Exercise 4: Import Plugin using OpenAPI

### Estimated Duration: 25 Minutes

This hands-on lab explores the integration of OpenAPI with Semantic Kernel to enhance AI-driven applications. Designed for developers new to API orchestration, the lab guides you through leveraging OpenAPI specifications to load external services as plugins dynamically. You will learn to import the provided WorkItems API as an OpenAPI plugin, enabling seamless interaction through AI-driven prompts. By the end of this lab, you will understand how OpenAPI simplifies API integration, reduces manual coding, and enhances the automation of external service calls.

## Objectives
In this exercise, you will be performing the following tasks:
- Task 1: Try the app without the OpenAPI Plugin
- Task 2: Create and import the OpenAPI Plugin

## Task 1: Try the app without the OpenAPI Plugin

In this task, you will explore different flow types in Azure AI Foundry by running the app without the OpenAPI Plugin to observe its default behavior.

1. Launch your AI Chat app in any of the languages, submit the following prompt, and see how it responds:
    ```
    What are my work items?
    ```
1. You will receive a response similar to the one shown below:

    ![](./media/image_073.png)

## Task 2: Create and import the OpenAPI Plugin

In this task, you will explore different flow types in Azure AI Foundry by creating and importing the OpenAPI Plugin to extend the app's capabilities.

<details>
<summary><strong>Python</strong></summary>

1. Right click on `Python>src>workitems` in the left pane and select **Open in Integrated Terminal (1)**.

    ![](./media/image_074.png)
1. Use the following command to run the app:
    ```
    python api.py
    ```
    >**Note**:- Please don't close the `terminal`.
1. You can find the OpenAPI spec in the following path `http://127.0.0.1:8000/openapi.json`.

    ![](./media/image_075.png)
1. The Swagger page can be found at `http://127.0.0.1:8000/docs`.

    ![](./media/image_076.png)
1. Navigate to `Python>src` directory and open **chat.py (1)** file.

    ![](./media/image_030.png)
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

    ![](./media/image_077.png)

     >**Note**: Please refer the screenshots to locate the code in proper position that helps you to avoid indentation error.

1. Refer to the code provided at the following URL. Please verify that your code matches the one below and correct any indentation errors if present

    - Open the provided link in your browser, press Ctrl + A to select all the content, then copy and paste it into Visual Studio Code

        ```
        https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/python/lab-04.py
        ```
1. Save the file.
1. Right-click on `Python>src` **(1)** in the left pane and select **Open in Integrated Terminal (2)**.

    ![](./media/image_035.png)
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
1. You will receive a response similar to the one shown below:

    ![](./media/sk33.png)
</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Right-click on `Dotnet>src>Aspire>Aspire.AppHost` **(1)** in the left pane and select **Open in Integrated Terminal (2)**.

    ![](./media/image_040.png)
1. Use the following command to run the app:
    ```
    dotnet run
    ```
    >**Note**:- Please don't close the `terminal`.
1. You can find the OpenAPI spec in the following path `http://localhost:5115/swagger/v1/swagger.json`.

    ![](./media/image_079.png)
1. The swagger page can be found at `http://localhost:5115/swagger/index.html`.

    ![](./media/image_080.png)
1. Navigate to `Dotnet>src>BlazorAI>Components>Pages` directory and open **Chat.razor.cs (1)** file.

    ![](./media/image_038.png)
1. Add the following code in the `// Import Models` section of the file.
    ```
    using Microsoft.SemanticKernel.Plugins.OpenApi;
    ```

    ![](./media/image_081.png)
1. Add the following code in the `// Challenge 04 - Import OpenAPI Spec` (1) section of the file.
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

    ![](./media/image_082.png)

     >**Note**: Please refer the screenshots to locate the code in proper position that helps you to avoid indentation error.

1. Refer to the code provided at the following URL. Please verify that your code matches the one below and correct any indentation errors if present

    - Open the provided link in your browser, press Ctrl + A to select all the content, then copy and paste it into Visual Studio Code

        ```
        https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/c%23/lab-04.cs
        ```
1. Save the file.
1. Right click on `Dotnet>src>Aspire>Aspire.AppHost` **(1)** in the left pane and select **Open in Integrated Terminal (2)**.

    ![](./media/image_040.png)
1. Use the following command to run the app:
    ```
    dotnet run
    ```
1. Open a new tab in the browser and navigate to the link for **blazor-aichat**, i.e. **https://localhost:7118/**.
    >**Note**: If you receive security warnings in the browser, close the browser and follow the link again.
1. Submit the following prompt and see how the AI responds:
    ```
    What are my work items?
    ```
1. You will receive a response similar to the one shown below:

    ![](./media/image_083.png)

1. Once you receive the response, navigate back to the Visual studio code terminal and then press **Ctrl+C** to stop the build process.

</details>

## Review

In this exercise, we utilized **OpenAPI integration with Semantic Kernel** to enhance AI-driven applications through dynamic API orchestration. We imported the **WorkItems API** as an OpenAPI plugin, enabling seamless interaction with external services using AI-generated prompts. This enhanced our proficiency in simplifying API integration, reducing manual coding, and automating external service calls within intelligent applications.

We have successfully completed the below tasks for **OpenAPI integration with Semantic Kernel**:  

- Integrated **OpenAPI with Semantic Kernel** to enable dynamic API orchestration.  
- Imported and configured the **WorkItems API** as an **OpenAPI plugin** for seamless external service interaction.  

### Congratulations on successfully completing the lab! Click Next >> to continue to the next lab.
