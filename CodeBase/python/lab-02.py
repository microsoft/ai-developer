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

# Add Logger
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
    execution_settings = kernel.get_prompt_execution_settings_from_service_id("chat-service")
    #Challenge 05 - Add Text Embedding service for semantic search
    #Challenge 07 - Add DALL-E image generation service
    chat_completion_service = kernel.get_service(type=ChatCompletionClientBase)
    return kernel


async def process_message(user_input):
    kernel = initialize_kernel()

    #Challenge 03 and 04 - Services Required
    #Challenge 03 - Create Prompt Execution Settings



    # Challenge 03 - Add Time Plugin
    # Placeholder for Time plugin

    # Challenge 04 - Import OpenAPI Spec
    # Placeholder for OpenAPI plugin


    # Challenge 05 - Add Search Plugin


    # Challenge 06- Semantic kernel filters

    # Challenge 07 - Text To Image Plugin
    # Placeholder for Text To Image plugin

    # Start Challenge 02 - Sending a message to the chat completion service by invoking kernel
    global chat_history
    chat_history.add_user_message(user_input)
    chat_completion = kernel.get_service(type=ChatCompletionClientBase)
    execution_settings = kernel.get_prompt_execution_settings_from_service_id("chat-service")
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