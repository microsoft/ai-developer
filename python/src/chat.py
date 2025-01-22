import asyncio
import logging
from dotenv import load_dotenv
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion, OpenAITextToImage
from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
from semantic_kernel.connectors.openapi_plugin import OpenAPIFunctionExecutionParameters
from semantic_kernel.contents.chat_history import ChatHistory
from semantic_kernel.functions import KernelArguments



# Add Logger 
logger = logging.getLogger(__name__)

load_dotenv(override=True)


#Challene 02 - Add Kernel


#Challenge 02 - Chat Completion Service




#Challenge 03 and 04 - Services Required



# Challenge 03 - Add Time Plugin


# Challenge 04 - Import OpenAPI Spec
# Placeholder for OpenAPI plugin


# Challenge 05 - Add Search Plugin


# Challenge 06- Semantic kernel filters

# Challenge 07 - Text To Image Plugin

async def chat() -> bool:
    try:
        user_input = input("User:> ")
    except KeyboardInterrupt:
        print("\n\nExiting chat...")
        return False
    except EOFError:
        print("\n\nExiting chat...")
        return False

    if user_input == "exit":
        print("\n\nExiting chat...")
        return False


    # Start Challenge 02 - Sending a message to the chat completion service by invoking kernel
    
    #print(f"Mosscap:> {result}")
    
    return True


async def main() -> None:
    chatting = True
    print(
        "Welcome to the chat bot!\
        \n  Type 'exit' to exit.\
        "
    )
    while chatting:
        chatting = await chat()


if __name__ == "__main__":
    asyncio.run(main())