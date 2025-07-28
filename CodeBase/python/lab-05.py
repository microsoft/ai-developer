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

# Add Logger
logger = logging.getLogger(__name__)

load_dotenv(override=True)

chat_history = ChatHistory()

def is_contoso_related(text):
    """
    Determines if the given text is related to Contoso or employee handbook.
    """
    text = text.lower()
    contoso_keywords = [
        'contoso', 'handbook', 'employee handbook', 'company policy', 'policy',
        'data security', 'security policy', 'privacy policy', 'guidelines',
        'corporate', 'hr policy', 'vacation', 'pto', 'time off', 'benefits',
        'code of conduct', 'work hours', 'remote work', 'sick leave',
        'confidential', 'confidentiality', 'information security'
    ]
    
    # Check if any of the keywords are in the text
    return any(keyword in text for keyword in contoso_keywords)

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
    global chat_history
    
    # Check if the query is related to Contoso to route to the handbook search
    if is_contoso_related(user_input):
        logger.info(f"Contoso-related query detected: {user_input}")
        
        # For Contoso queries, we want fresh responses without previous context
        # So we don't add to existing chat history, just get the fresh response
        result = await search_employee_handbook(user_input)
        
        # Clear existing chat history for Contoso queries to avoid context contamination
        chat_history = ChatHistory()
        
        # Add only the current interaction
        chat_history.add_user_message(user_input)
        chat_history.add_assistant_message(result)
        return result
        
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

async def search_employee_handbook(query):
    """
    Search the Contoso employee handbook for specific information.
    Each query is processed independently without previous context.
    """
    try:
        # Extract the key topic from the query to improve search
        search_topic = extract_search_topic(query)
        
        logger.info(f"=== Processing Fresh Contoso Query ===")
        logger.info(f"Original query: {query}")
        logger.info(f"Searching handbook for: {search_topic}")
        
        # Create a fresh instance of the search plugin for each query
        search_plugin = ContosoSearchPlugin()
        
        # First try with the extracted topic
        result = search_plugin.query_handbook(search_topic, top=3)
        
        # If no results were found, try with the original query
        if "No relevant information found" in result and search_topic != query:
            logger.info(f"No results found with topic, trying with original query: {query}")
            result = search_plugin.query_handbook(query, top=3)
        
        logger.info(f"Final result length: {len(result)}")
        logger.info(f"=== Completed Fresh Contoso Query ===")
        return result
    except Exception as e:
        logger.error(f"Error searching employee handbook: {str(e)}")
        return f"Error accessing the employee handbook: {str(e)}"
        
def extract_search_topic(query):
    """
    Extract the main topic from a query to improve search relevance.
    """
    # List of prefixes to remove for cleaner searches
    prefixes = [
        "what is", "tell me about", "can you explain", "i'd like to know about",
        "information on", "details about", "help me understand", "show me",
        "where can i find", "how does contoso handle", "what does contoso say about",
        "what are the rules for", "how do i", "what should i do about",
        "contoso's", "contoso", "the company's", "company", "please tell me about",
        "i need to know about", "can you find", "search for"
    ]
    
    # Convert to lowercase for easier matching
    clean_query = query.lower().strip()
    
    # Remove common prefixes
    for prefix in prefixes:
        if clean_query.startswith(prefix):
            clean_query = clean_query[len(prefix):].strip()
            break
    
    # If the query has a question mark, remove it and everything after
    if "?" in clean_query:
        clean_query = clean_query.split("?")[0].strip()
    
    # Enhance specific topic extraction
    topic_mappings = {
        "data security": ["data security", "security policy", "information security", "data protection"],
        "vacation policy": ["vacation", "pto", "time off", "leave policy", "holiday"],
        "confidentiality": ["confidential", "confidentiality", "non-disclosure", "sensitive information"],
        "remote work": ["remote work", "work from home", "telework", "flexible work"],
        "benefits": ["benefits", "health insurance", "retirement", "401k", "medical"]
    }
    
    # Check if the query matches any specific topic
    for topic, keywords in topic_mappings.items():
        if any(keyword in clean_query for keyword in keywords):
            return topic
    
    # If after cleaning we have a very short query, use the original
    if len(clean_query) < 5:
        return query
        
    return clean_query