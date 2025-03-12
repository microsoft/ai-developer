# **Exercise 4**: Import Plugin using OpenAPI

### Estimated Duration: 60 minutes

OpenAPI is a widely adopted standard for describing RESTful APIs in a way that is both human-readable and machine-friendly. It streamlines API integration by providing automatic documentation, client SDK generation, and reduced manual coding efforts. By leveraging OpenAPI specifications, Semantic Kernel can dynamically load external services as plugins, letting your AI-driven apps discover, invoke, and orchestrate these APIs more effectively.

As developers, we can enrich our applications by integrating various APIs through OpenAPI specifications. In this challenge, you will learn how to import the provided WorkItems API as an OpenAPI plugin in Semantic Kernel and interact with it through AI-driven prompts.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Try the app without the Time Plugin

<details>
<summary><strong>Python</strong></summary>

1. Launch your AI Chat app, and submit the following prompt, and see how it responds:
    ```
    What are my work items?
    ```
</details>

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
1. In case you encounter any indentation error, use the below code:
    ```
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
2. Since the AI have the **Geocoding Plugin**, it will be able to provide real-time information, you will get a response similar to the following:
    ```
    The geo-coordinates for Tampa, FL are:

    Latitude: 27.9477595
    Longitude: -82.458444 
    ```
</details>