# **Exercise 7**: Image Generation using DALL-E

### Estimated Duration: 60 minutes

Now it's time to introduce Image generation to the reference application using DALL-E. DALL-E is an artificial intelligence (AI) model that generates images from textual descriptions. DALL-E can create images of objects, scenes, and even abstract concepts based on the descriptive text provided to it. This capability allows for a wide range of creative possibilities, from illustrating ideas to creating entirely new visual concepts that might not exist in the real world.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Deploy a DALL-E model
1. Navigate to [Azure AI Foundry](https://ai.azure.com/) portal.
1.  Click on **Models + endpoints** under **My assets** in the left pane.
1.  Click on **+ Deploy model**, and then select **Deploy Base model**.
1. Search for **dall-e-3**, select the model and click on **Confirm**.
1. Click on **Deploy**.

<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src` directory and open **.env** file.
1. Navigate to AI Foundry Portal and on **dall-e-3** page, copy the **Target URI**.
1. Paste it besides `AZURE_TEXT_TO_IMAGE_ENDPOINT`.
    >Note:- Ensure that every value in the **.env** file is enclosed in **double quotes (")**.
1. Copy the API key from AI Foundry Portal and paste it besides `AZURE_TEXT_TO_IMAGE_API_KEY`.
1. Save the file.
</details>

## Task 2: Create and import the Image Generation Plugin
<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src>plugins` directory and create a new file named **ImageGenerationPlugin.py**.
1. Add the following code in the file:
    ```
    import os
    import json
    from typing import Annotated
    from semantic_kernel.functions import kernel_function
    from semantic_kernel.kernel import Kernel
    import httpx
    from PIL import Image

    class ImageGenerationPlugin:
        """Plugin for generating images using DALL-E."""

        def __init__(self):
            """Initialize the ImageGenerationPlugin."""
            pass

        @kernel_function(
            description="Generates an image based on the text prompt",
            name="generate_image"
        )
        async def generate_image(
            self, 
            prompt: Annotated[str, "Text description of the image to generate"],
            size: Annotated[str, "Size of the image (default: 1024x1024)"] = "1024x1024"
        ) -> str:
            """
            Generate an image using DALL-E based on the provided text prompt.
            Returns the URL of the generated image.
            """
            try:
                kernel = self._kernel
                image_service = kernel.get_service_by_id("image-service")

                # Generate the image (with parameters similar to the reference code)
                # model and n can be adjusted as needed for your specific environment
                result = await image_service.generate_image_async(
                    prompt=prompt,
                    size=size,
                    model="dalle3",  # Example model name
                    n=1,         # Number of images to generate
                    
                )

                image_dir = os.path.join(os.curdir, 'images')

                # If the directory doesn't exist, create it
                if not os.path.isdir(image_dir):
                    os.mkdir(image_dir)

                # Initialize the image path (note the filetype should be png)
                image_path = os.path.join(image_dir, 'generated_image.png')

                # Retrieve the generated image
                json_response = json.loads(result.model_dump_json())
                image_url = json_response["data"][0]["url"]  # extract image URL from response
                generated_image = httpx.get(image_url).content  # download the image

                with open(image_path, "wb") as image_file:
                    image_file.write(generated_image)

                # Display the image in the default image viewer
                image = Image.open(image_path)
                image.show()

                return f"Image generated successfully! URL: {image_url}"

            except Exception as e:
                return f"Error generating image: {str(e)}"
    ```
1. Navigate to `Python>src` directory and open **chat.py** file.
1. Add the following code in the `#Import Modules` section of the file.
    ```
    from plugins.ImageGenerationPlugin import ImageGenerationPlugin
    from semantic_kernel.connectors.ai.open_ai import AzureTextToImage
    ```
1. Add the following code in the `#Challenge 07 - Add DALL-E image generation service` section of the file.
    ```
    image_generation_service = AzureTextToImage(
        deployment_name=os.getenv("AZURE_TEXT_TO_IMAGE_DEPLOYMENT_NAME"),
        api_key=os.getenv("AZURE_TEXT_TO_IMAGE_API_KEY"),
        endpoint=os.getenv("AZURE_TEXT_TO_IMAGE_ENDPOINT"),
        service_id="image-service"
    )
    kernel.add_service(image_generation_service)
    ```
1. Add the following code in the `# Placeholder for Text To Image plugin` section of the file.
    ```
    image_plugin = ImageGenerationPlugin()
    image_plugin.set_kernel(kernel)
    kernel.add_plugin(
        image_plugin,
        plugin_name="ImageGeneration",
    )
    logger.info("Image Generation plugin loaded")
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
    from plugins.ImageGenerationPlugin import ImageGenerationPlugin
    from semantic_kernel.connectors.ai.open_ai import AzureTextToImage


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
        image_generation_service = AzureTextToImage(
            deployment_name=os.getenv("AZURE_TEXT_TO_IMAGE_DEPLOYMENT_NAME"),
            api_key=os.getenv("AZURE_TEXT_TO_IMAGE_API_KEY"),
            endpoint=os.getenv("AZURE_TEXT_TO_IMAGE_ENDPOINT"),
            service_id="image-service"
        )
        kernel.add_service(image_generation_service)
        logger.info("DALL-E image generation service added")
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
        image_plugin = ImageGenerationPlugin()
        image_plugin.set_kernel(kernel)
        kernel.add_plugin(
            image_plugin,
            plugin_name="ImageGeneration",
        )
        logger.info("Image Generation plugin loaded")

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
    Create a picture of a cute kitten wearing a hat.
    ```
</details>
