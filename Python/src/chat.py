import asyncio
import logging
from dotenv import load_dotenv
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion, AzureTextToImage, AzureChatPromptExecutionSettings
from semantic_kernel.connectors.azure_ai_search import AzureAISearchCollection
from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
from semantic_kernel.connectors.openapi_plugin import OpenAPIFunctionExecutionParameters
from semantic_kernel.connectors.ai.open_ai import AzureTextEmbedding
from semantic_kernel.contents.chat_history import ChatHistory
from semantic_kernel.functions import KernelArguments
import os
from pathlib import Path

from plugins.ai_search_plugin import AiSearchPlugin
from plugins.geo_coding_plugin import GeoPlugin
# Challenge 03 - Import plugins you create
# from plugins.time_plugin import TimePlugin
# from plugins.weather_plugin import WeatherPlugin
# Challenge 07 - Import image plugin
# from plugins.image_plugin import ImagePlugin

# Add Logger
logger = logging.getLogger(__name__)

# Find and load the .env file from the src directory
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

# Direct console output that will always be visible
print("============ ENVIRONMENT VARIABLES ============")
print(f"Using .env from: {env_path}")
print(f"File exists: {env_path.exists()}")
print(f"AZURE_OPENAI_CHAT_DEPLOYMENT_NAME: {os.environ.get('AZURE_OPENAI_CHAT_DEPLOYMENT_NAME')}")
print(f"AZURE_OPENAI_ENDPOINT: {os.environ.get('AZURE_OPENAI_ENDPOINT')}")
print(f"AZURE_OPENAI_API_KEY: {'*****' if os.environ.get('AZURE_OPENAI_API_KEY') else 'Not found'}")
print(f"GEOCODING_API_KEY: {'*****' if os.environ.get('GEOCODING_API_KEY') else 'Not found'}")
print(f"AZURE_OPENAI_API_VERSION: {os.environ.get('AZURE_OPENAI_API_VERSION')}")
print(f"AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME: {os.environ.get('AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME')}")
print(f"AZURE_AI_SEARCH_ENDPOINT: {os.environ.get('AZURE_AI_SEARCH_ENDPOINT')}")
print(f"AZURE_AI_SEARCH_API_KEY: {'*****' if os.environ.get('AZURE_AI_SEARCH_API_KEY') else 'Not found'}")
print(f"AZURE_AI_SEARCH_INDEX_NAME: {os.environ.get('AZURE_AI_SEARCH_INDEX_NAME')}")
print(f"AZURE_OPENAI_TEXT_TO_IMAGE_DEPLOYMENT_NAME: {os.environ.get('AZURE_OPENAI_TEXT_TO_IMAGE_DEPLOYMENT_NAME')}")
print("==============================================")

class ChatService:
    """Chat service class that initializes kernel and plugins once, then processes messages efficiently"""
    
    def __init__(self):
        self.chat_history = ChatHistory()
        self.kernel = None
        self.chat_completion_service = None
        self.initialize_kernel()
    
    def initialize_kernel(self):
        """Initialize kernel and load all plugins once during construction"""
        print("Initializing kernel and loading plugins...")
        
        # Challenge 02 - Add Kernel
        # TODO: Create a new Kernel instance and assign it to self.kernel
        
        # Challenge 02 - Chat Completion Service
        # TODO: Create an AzureChatCompletion service and add it to the kernel
        # TODO: Store the chat completion service in self.chat_completion_service
        # Hint: Use the environment variables from your .env file
        # See: https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/?tabs=python-AzureOpenAI&pivots=programming-language-python#creating-a-chat-completion-service

        # Challenge 05 - Add Text Embedding Service
        # TODO: Create an AzureTextEmbedding service and add it to the kernel
        # embedding_service = AzureTextEmbedding()
        # self.kernel.add_service(embedding_service)

        # Challenge 07 - Add Text to Image Service
        # TODO: Create an AzureTextToImage service and add it to the kernel
        # text_to_image_service = AzureTextToImage()
        # self.kernel.add_service(text_to_image_service)

        # Load all plugins once during kernel initialization
        self.load_plugins()
        print("Kernel initialization complete.")

    def load_plugins(self):
        """Helper method to centralize plugin loading logic"""
        # Challenge 03 - Add Time Plugin
        # timePlugin = TimePlugin()
        # self.kernel.add_plugin(timePlugin)

        # Challenge 03 - Add Geo Plugin
        # geo_plugin = GeoPlugin()
        # self.kernel.add_plugin(geo_plugin)

        # Challenge 03 - Add Weather Plugin
        # self.kernel.add_plugin(WeatherPlugin())

        # Challenge 04 - Import OpenAPI Spec
        # self.kernel.add_plugin_from_openapi(
        #     plugin_name="workitems",
        #     openapi_document_path="http://127.0.0.1:8001/openapi.json",
        #     execution_settings=OpenAPIFunctionExecutionParameters(
        #         enable_payload_namespacing=True)
        # )
        
        # Challenge 05 - Add Search Plugin
        # search_plugin = AiSearchPlugin(kernel=self.kernel)
        # self.kernel.add_plugin(search_plugin)
        
        # Challenge 07 - Text To Image Plugin
        # self.kernel.add_plugin(ImagePlugin(kernel=self.kernel))
        
        pass

    async def process_message(self, user_input):
        """Process a message using the pre-initialized kernel and plugins"""
        # Start Challenge 02 - Sending a message to the chat completion service by invoking kernel
        # TODO: Implement the following steps:
        # 1. Add the user's message to the chat history
        # 2. Create execution settings with function choice behavior set to Auto
        # 3. Get a response from the chat completion service
        # 4. Add the AI's response to the chat history  
        # 5. Return the AI response
        
        # Hint: Use self.chat_history, self.chat_completion_service, and self.kernel
        # See: https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/?tabs=python-AzureOpenAI&pivots=programming-language-python#using-chat-completion-services
        # See: https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/chat-history?pivots=programming-language-python#creating-a-chat-history-object
        
        pass  # Remove this line when you implement the function

    def reset_chat_history(self):
        """Reset the chat history"""
        self.chat_history = ChatHistory()

# Global instance - initialized once when module is imported
_chat_service = None

def get_chat_service():
    """Get the singleton chat service instance"""
    global _chat_service
    if _chat_service is None:
        _chat_service = ChatService()
    return _chat_service

# Legacy functions for backward compatibility
async def process_message(user_input):
    """Legacy function - delegates to ChatService"""
    chat_service = get_chat_service()
    return await chat_service.process_message(user_input)

def reset_chat_history():
    """Legacy function - delegates to ChatService"""
    chat_service = get_chat_service()
    chat_service.reset_chat_history()