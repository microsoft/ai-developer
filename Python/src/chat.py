import asyncio
import logging
from dotenv import load_dotenv
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion, AzureTextToImage, AzureChatPromptExecutionSettings
from semantic_kernel.connectors.memory.azure_ai_search import AzureAISearchStore
from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
from semantic_kernel.connectors.openapi_plugin import OpenAPIFunctionExecutionParameters
from semantic_kernel.connectors.ai.open_ai import AzureTextEmbedding
from semantic_kernel.contents.chat_history import ChatHistory
from semantic_kernel.functions import KernelArguments
import os
from pathlib import Path

from plugins.ai_search_plugin import AiSearchPlugin
from plugins.geo_coding_plugin import GeoPlugin
from plugins.image_plugin import ImagePlugin
from plugins.time_plugin import TimePlugin
from plugins.weather_plugin import WeatherPlugin

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

chat_history = ChatHistory()

def initialize_kernel():
    #Challene 02 - Add Kernel

    #Challenge 02 - Chat Completion Service
    #Challenge 02- Add kernel to the chat completion service

    # Challenge 05 - Add Text Embedding Service


    # Challenge 07 - Add Text to Image Service


    return kernel


async def process_message(user_input):
    kernel = initialize_kernel()

    # Challenge 03 - Add Time Plugin


    # Challenge 03 - Add Geo Plugin


    # CHallenge 03 - Add Weather Plugin


    # Challenge 04 - Import OpenAPI Spec


    # Challenge 05 - Add Search Plugin


    # Challenge 07 - Text To Image Plugin

    # Start Challenge 02
    
    # Get the chat completion service from the kernel

    # Add the user's message to chat history

    # Create settings for the chat request
    
    # Send the chat history to the AI and get a response
    
    # Add the AI's response to chat history
    
    return result

def reset_chat_history():
    global chat_history
    chat_history = ChatHistory()