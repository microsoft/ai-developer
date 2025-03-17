# **Exercise 5**: Retrieval-Augmented Generation (RAG)

### Estimated Duration: 60 minutes

Retrieval-Augmented Generation (RAG)
The RAG (Retrieval-Augmented Generation) pattern is an AI model architecture that enhances the generation of text by integrating external, relevant information retrieved from a knowledge base or database, improving accuracy and context. It combines retrieval mechanisms with generative models to produce more informed and contextually relevant responses.
Your prompts (inputs), completions (outputs), embeddings, and training data are:
- NOT available to other customers.
- NOT available to OpenAI.
- NOT used to improve OpenAI models.
- NOT used to improve any Microsoft or 3rd party products or services.
- NOT used for automatically improving Azure AI Foundry models for your use in your resource (The models are stateless, unless you explicitly fine-tune models with your training data).

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Deploy a Text Embedding model
1. Navigate to [Azure AI Foundry](https://ai.azure.com/) portal.
1.  Click on **Models + endpoints** under **My assets** in the left pane.
1.  Click on **+ Deploy model**, and then select **Deploy Base model**.
1. Search for **text-embedding-ada-002**, select the model and click on **Confirm**.
1. Click on **Deploy**.
1. Navigate back and select **gpt-4o**, and click on **Open in playground**.
1. Click on **Add you data** and select **+ Add a new data source**.
1. On **Add your data** blade, select **Upload files** as the `Data source`.
1. Click on **Upload**, and select **Upload files**.
1. Navigtate to `C:\LabFiles\ai-developer\Dotnet\src\BlazorAI\data\` and select **employee_handbook.pdf**, and click on **Open**, followed by **Next**.
1. On the **Index settings** blade, specify the following configuration options and click on **Next**:
    - **Select Azure AI Search Service**: select **AzureAISearch**
    - **Vector index**: **employeehandbook**
1. CLick on **Next**, and select **Create vector index**.
    >**Note**: The data injection might take around 10-15 minutes.

## Task 3: Create a Semantic Search Plugin to query the AI Search Index

<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src` directory and open **.env** file.
1. Navigate to Azure Portal and search **Ai Search** and Click on it, open the **AI Search** resource located there.
1. On Overview page copy the URL.
1. Paste it besides `AI_SEARCH_URL` in **.env** file..
    >Note:- Ensure that every value in the **.env** file is enclosed in **double quotes (")**.
1. Navigate to **Keys** under Settings in the left pane.
1. Copy the Primary admin key from Azure Portal and paste it besides `AI_SEARCH_KEY`.
1. Save the file.
1. Navigate to `Python>src>plugins` directory and create a new file named **ContosoSearchPlugin.py**.
1. Add the following code in the file:
    ```
    import json
    import os
    from typing import Dict, List, Any, Optional

    import requests
    from azure.core.credentials import AzureKeyCredential
    from azure.search.documents import SearchClient
    from azure.search.documents.models import VectorizedQuery
    from dotenv import load_dotenv

    class ContosoSearchPlugin:
        def __init__(self):
            load_dotenv()
            
            self.openai_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
            self.openai_api_key = os.getenv("AZURE_OPENAI_API_KEY")
            self.embedding_deployment = os.getenv("AZURE_OPENAI_EMBED_DEPLOYMENT_NAME")
            self.embedding_api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2023-05-15")
            
            self.search_endpoint = os.getenv("AI_SEARCH_URL")
            self.search_key = os.getenv("AI_SEARCH_KEY")
            self.search_index_name = os.getenv("AZURE_SEARCH_INDEX", "employeehandbook")
            
            self.search_client = SearchClient(
                endpoint=self.search_endpoint,
                index_name=self.search_index_name,
                credential=AzureKeyCredential(self.search_key)
            )
            
        def generate_embedding(self, text: str) -> List[float]:
            if not text:
                raise ValueError("Input text cannot be empty")
                
            url = f"{self.openai_endpoint}/openai/deployments/{self.embedding_deployment}/embeddings?api-version={self.embedding_api_version}"
            headers = {
                "Content-Type": "application/json",
                "api-key": self.openai_api_key
            }
            payload = {
                "input": text,
                "dimensions": 1536  # Standard for text-embedding-ada-002
            }
            
            try:
                response = requests.post(url, headers=headers, json=payload)
                response.raise_for_status()
                embedding_data = response.json()
                return embedding_data["data"][0]["embedding"]
            except Exception as e:
                raise Exception(f"Failed to generate embedding: {str(e)}")
        
        def search_documents(self, query: str, top: int = 3) -> List[Dict[str, Any]]:
            try:
                # Generate embedding for the query
                query_embedding = self.generate_embedding(query)
                
                # Create a vectorized query
                vector_query = VectorizedQuery(
                    vector=query_embedding,
                    k_nearest_neighbors=top,
                    fields="contentVector"
                )
                
                # Execute the search
                results = self.search_client.search(
                    search_text=query,  # Also include text search for hybrid retrieval
                    vector_queries=[vector_query],
                    select=["id", "content", "page_num", "chunk_id"],
                    top=top
                )
                
                # Format the results
                search_results = []
                for result in results:
                    search_results.append({
                        "id": result["id"],
                        "content": result["content"],
                        "page_num": result.get("page_num", "Unknown"),
                        "chunk_id": result.get("chunk_id", "Unknown"),
                        "score": result["@search.score"]
                    })
                
                return search_results
                
            except Exception as e:
                raise Exception(f"Search failed: {str(e)}")
        
        def query_handbook(self, query: str, top: int = 3) -> str:
            try:
                results = self.search_documents(query, top)
                
                # Format the results into a nice response
                if not results:
                    return "No relevant information found in the Contoso Handbook."
                
                response = f"Here's what I found in the Contoso Handbook about '{query}':\n\n"
                for i, result in enumerate(results, 1):
                    response += f"Result {i} (Page {result['page_num']}):\n{result['content']}\n\n"
                
                return response
                
            except Exception as e:
                return f"Error querying the Contoso Handbook: {str(e)}"
    if __name__ == "__main__":
        search_plugin = ContosoSearchPlugin()
        query = "What is Contoso's vacation policy?"
        result = search_plugin.query_handbook(query)
        print(result)
    ```
1. Save the file.
1. Navigate to `Python>src` directory and open **chat.py** file.
1. Add the following code in the `#Import Modules` section of the file.
    ```
    from semantic_kernel.connectors.ai.open_ai import AzureTextEmbedding
    from plugins.ContosoSearchPlugin import ContosoSearchPlugin
    ```
1. Add the following code in the `#Challenge 05 - Add Text Embedding service for semantic search` section of the file.
    ```
    text_embedding_service = AzureTextEmbedding(
        deployment_name=os.getenv("AZURE_OPENAI_EMBED_DEPLOYMENT_NAME"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        service_id="embedding-service"
    )
    kernel.add_service(text_embedding_service)
    logger.info("Text Embedding service added")
    ```
1. Add the following code in the `# Challenge 05 - Add Search Plugin` section of the file.
    ```
    kernel.add_plugin(
        ContosoSearchPlugin(),
        plugin_name="ContosoSearch",
    )
    logger.info("Contoso Handbook Search plugin loaded")
    ```
1. In case you encounter any indentation error, use the below code:
    ```
    import asyncio
    import logging
    from dotenv import load_dotenv
    from semantic_kernel import Kernel
    from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion, OpenAITextToImage
    from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
    from semantic_kernel.connectors.openapi_plugin import OpenAPIFunctionExecutionParameters
    from semantic_kernel.contents.chat_history import ChatHistory
    from semantic_kernel.functions import KernelArguments
    #Import Modules
    from semantic_kernel.connectors.ai.chat_completion_client_base import ChatCompletionClientBase
    from semantic_kernel.connectors.ai.open_ai import OpenAIChatPromptExecutionSettings
    import os
    from semantic_kernel.connectors.ai.open_ai.prompt_execution_settings.azure_chat_prompt_execution_settings import (
        AzureChatPromptExecutionSettings,
    )
    from plugins.time_plugin import TimePlugin
    from plugins.geo_coding_plugin import GeoPlugin
    from plugins.weather_plugin import WeatherPlugin
    from semantic_kernel.connectors.ai.open_ai import AzureTextEmbedding
    from plugins.ContosoSearchPlugin import ContosoSearchPlugin

    #Add Logger
    logger = logging.getLogger(__name__)

    load_dotenv(override=True)

    chat_history = ChatHistory()

    def initialize_kernel():
    #Challene 02 - Add Kernel
        kernel = Kernel()
        #Challenge 02 - Chat Completion Service
        chat_completion_service = AzureChatCompletion(
            deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            service_id="chat-service",
        )
        kernel.add_service(chat_completion_service)
        #Challenge 05 - Add Text Embedding service for semantic search
        text_embedding_service = AzureTextEmbedding(
            deployment_name=os.getenv("AZURE_OPENAI_EMBED_DEPLOYMENT_NAME"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            service_id="embedding-service"
        )
        kernel.add_service(text_embedding_service)
        logger.info("Text Embedding service added")
        #Challenge 07 - Add DALL-E image generation service
        chat_completion_service = kernel.get_service(type=ChatCompletionClientBase)
        return kernel


    async def process_message(user_input):
        kernel = initialize_kernel()

        #Challenge 03 and 04 - Services Required
        #Challenge 03 - Create Prompt Execution Settings
        execution_settings = AzureChatPromptExecutionSettings()
        execution_settings.function_choice_behavior = FunctionChoiceBehavior.Auto()
        logger.info("Automatic function calling enabled")



        # Challenge 03 - Add Time Plugin
        # Placeholder for Time plugin
        time_plugin = TimePlugin()
        kernel.add_plugin(time_plugin, plugin_name="TimePlugin")
        logger.info("Time plugin loaded")

        kernel.add_plugin(
            GeoPlugin(),
            plugin_name="GeoLocation",
        )
        logger.info("GeoLocation plugin loaded")

        kernel.add_plugin(
            WeatherPlugin(),
            plugin_name="Weather",
        )
        logger.info("Weather plugin loaded")

        # Challenge 04 - Import OpenAPI Spec
        # Placeholder for OpenAPI plugin
        kernel.add_plugin_from_openapi(
            plugin_name="get_tasks",
            openapi_document_path="http://127.0.0.1:8000/openapi.json",
            execution_settings=OpenAPIFunctionExecutionParameters(
                enable_payload_namespacing=True,
            )
        )


        # Challenge 05 - Add Search Plugin
        kernel.add_plugin(
            ContosoSearchPlugin(),
            plugin_name="ContosoSearch",
        )
        logger.info("Contoso Handbook Search plugin loaded")

        # Challenge 06- Semantic kernel filters

        # Challenge 07 - Text To Image Plugin
        # Placeholder for Text To Image plugin

        # Start Challenge 02 - Sending a message to the chat completion service by invoking kernel
        global chat_history
        chat_history.add_user_message(user_input)
        chat_completion = kernel.get_service(type=ChatCompletionClientBase)
        response = await chat_completion.get_chat_message_content(
            chat_history=chat_history,
            settings=execution_settings,
            kernel=kernel
        )
        chat_history.add_assistant_message(str(response))

            #return result
        logger.info(f"Response: {response}")
        return response

    def reset_chat_history():
        global chat_history
        chat_history = ChatHistory()
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
    What are the steps for the Contoso Performance Reviews?
    ```
    ```
    What is Contoso's policy on Data Security?
    ```
    ```
    Who do I contact at Contoso for questions regarding workplace safety?
    ```

</details>