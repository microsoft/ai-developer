import os
import asyncio
import logging
from pathlib import Path
from dotenv import load_dotenv
from semantic_kernel import Kernel
from semantic_kernel.agents import AgentGroupChat, ChatCompletionAgent
from semantic_kernel.agents.strategies import (
    KernelFunctionSelectionStrategy,
    KernelFunctionTerminationStrategy,
)
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion
from semantic_kernel.contents import ChatHistoryTruncationReducer
from semantic_kernel.functions import KernelFunctionFromPrompt

# Add Logger
logger = logging.getLogger(__name__)

# Find and load the .env file from the src directory
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

class MultiAgentService:
    """Multi-agent service class that initializes kernel and agents once, then processes messages efficiently"""
    
    def __init__(self):
        self.kernel = None
        self.agents = {}
        self.group_chat = None
        self.initialize_system()
    
    def initialize_system(self):
        """Initialize kernel and agents once during construction"""
        print("Initializing multi-agent system...")
        
        # Challenge 8 - Create kernel with chat completion service
        # TODO: Create a Kernel instance and add an AzureChatCompletion service
        # self.kernel = Kernel()
        # self.kernel.add_service(service=AzureChatCompletion())
        
        # Challenge 8 - Create agents
        # TODO: Implement the create_agents method
        # self.create_agents()
        
        # Challenge 8 - Create the group chat orchestration
        # TODO: Implement the create_group_chat method
        # self.create_group_chat()
        
        print("Multi-agent system initialization complete.")
    
    def create_agents(self):
        """Create the three specialized agents with their personas"""
        # Challenge 8 - Define agent names as constants
        # TODO: Define the three agent names that match the UI display
        # BUSINESS_ANALYST_NAME = "BusinessAnalyst"
        # SOFTWARE_ENGINEER_NAME = "SoftwareEngineer" 
        # PRODUCT_OWNER_NAME = "ProductOwner"
        
        # Challenge 8 - Create ChatCompletionAgents
        # TODO: Create three ChatCompletionAgent instances with their personas
        # Each agent needs: kernel, name, and instructions
        # Use the personas from Challenge-08.md
        
        # Business Analyst Agent
        # TODO: Create business_analyst_agent with BusinessAnalyst persona
        # self.agents[BUSINESS_ANALYST_NAME] = ChatCompletionAgent(
        #     kernel=self.kernel,
        #     name=BUSINESS_ANALYST_NAME,
        #     instructions="""[BusinessAnalyst persona from Challenge-08.md]"""
        # )
        
        # Software Engineer Agent
        # TODO: Create software_engineer_agent with SoftwareEngineer persona
        # self.agents[SOFTWARE_ENGINEER_NAME] = ChatCompletionAgent(
        #     kernel=self.kernel,
        #     name=SOFTWARE_ENGINEER_NAME,
        #     instructions="""[SoftwareEngineer persona from Challenge-08.md]"""
        # )
        
        # Product Owner Agent
        # TODO: Create product_owner_agent with ProductOwner persona
        # self.agents[PRODUCT_OWNER_NAME] = ChatCompletionAgent(
        #     kernel=self.kernel,
        #     name=PRODUCT_OWNER_NAME,
        #     instructions="""[ProductOwner persona from Challenge-08.md]"""
        # )
        
        pass
        
    def create_group_chat(self):
        """Create the orchestrated group chat with selection and termination strategies"""
        # Challenge 8 - Agent name constants (must match create_agents)
        # TODO: Define the same agent names here
        # BUSINESS_ANALYST_NAME = "BusinessAnalyst"
        # SOFTWARE_ENGINEER_NAME = "SoftwareEngineer" 
        # PRODUCT_OWNER_NAME = "ProductOwner"
        
        # Challenge 8 - Define a selection function
        # TODO: Create a KernelFunctionFromPrompt for agent selection
        # The function should determine which agent goes next based on conversation flow
        # Rules:
        # - User input -> BusinessAnalyst
        # - BusinessAnalyst -> SoftwareEngineer
        # - SoftwareEngineer -> ProductOwner
        # - ProductOwner (with criticism) -> SoftwareEngineer
        
        # selection_function = KernelFunctionFromPrompt(
        #     function_name="agent_selection",
        #     prompt=f"""[Selection logic from Challenge-08.md]""",
        # )

        # Challenge 8 - Define a termination function
        # TODO: Create a KernelFunctionFromPrompt for termination detection
        # The function should detect when ProductOwner approves with "%APPR%"
        # termination_keyword = "%APPR%"
        # termination_function = KernelFunctionFromPrompt(
        #     function_name="termination_check",
        #     prompt=f"""[Termination logic from Challenge-08.md]""",
        # )

        # Challenge 8 - Create history reducer
        # TODO: Create a ChatHistoryTruncationReducer to save tokens
        # history_reducer = ChatHistoryTruncationReducer(target_count=3)
        
        # Challenge 8 - Create the AgentGroupChat
        # TODO: Create AgentGroupChat with selection and termination strategies
        # self.group_chat = AgentGroupChat(
        #     agents=list(self.agents.values()),
        #     selection_strategy=KernelFunctionSelectionStrategy(...),
        #     termination_strategy=KernelFunctionTerminationStrategy(...),
        # )
        
        pass
    
    async def process_request(self, user_input: str):
        """Process a multi-agent collaboration request using the pre-initialized system"""
        # Challenge 8 - Add user's initial request to the chat
        # TODO: Add the user input to the group chat
        # await self.group_chat.add_chat_message(message=user_input)
        
        # Collect responses for Streamlit
        responses = []
        
        try:
            # Challenge 8 - Invoke the group chat and collect agent responses
            # TODO: Iterate through the group chat responses
            # async for response in self.group_chat.invoke():
            #     if response is None or not response.name:
            #         continue
            #     responses.append({"role": response.name, "message": response.content})
            
            # Placeholder response for incomplete implementation
            responses.append({
                "role": "System", 
                "message": "Please complete Challenge 8 to enable multi-agent collaboration."
            })
        except Exception as e:
            responses.append({
                "role": "System", 
                "message": f"❌ Error during multi-agent collaboration: {e}"
            })
        
        logger.info("Multi-agent conversation complete.")
        return responses

# Global instance - initialized once when module is imported
_multi_agent_service = None

def get_multi_agent_service():
    """Get the singleton multi-agent service instance"""
    global _multi_agent_service
    if _multi_agent_service is None:
        _multi_agent_service = MultiAgentService()
    return _multi_agent_service

# Legacy function for backward compatibility
async def run_multi_agent(user_input: str):
    """Legacy function - delegates to MultiAgentService"""
    service = get_multi_agent_service()
    return await service.process_request(user_input)
