import os
import asyncio
import sys
from datetime import datetime
import logging

from semantic_kernel.agents import AgentGroupChat, ChatCompletionAgent
from semantic_kernel.agents.strategies.termination.termination_strategy import TerminationStrategy
from semantic_kernel.agents.strategies.selection.kernel_function_selection_strategy import (
    KernelFunctionSelectionStrategy,
)
from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
from semantic_kernel.connectors.ai.open_ai.services.azure_chat_completion import AzureChatCompletion
from semantic_kernel.contents.chat_message_content import ChatMessageContent
from semantic_kernel.contents.utils.author_role import AuthorRole
from semantic_kernel.kernel import Kernel

logger = logging.getLogger(__name__)

class ApprovalTerminationStrategy(TerminationStrategy):
    """A strategy for determining when an agent should terminate."""
    
    async def should_agent_terminate(self, agent, history):
        """Check if the agent should terminate."""
        if not history:
            return False
        
        # Check the last message in the history
        last_message = history[-1]
        content = getattr(last_message, 'content', '')
        
        # Check for approval token in the last message content
        if '%APPR%' in content:
            return True
        
        return False

async def run_multi_agent(input: str):
    """Implement the multi-agent system."""
    
    # Create a single instance of AzureChatCompletion service
    azure_chat_completion_service = AzureChatCompletion(
        deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    )

    # Create Kernel instances for each agent and add the service
    kernel_business_analyst = Kernel()
    kernel_business_analyst.add_service(azure_chat_completion_service)
    
    kernel_software_engineer = Kernel()
    kernel_software_engineer.add_service(azure_chat_completion_service)
    
    kernel_product_owner = Kernel()
    kernel_product_owner.add_service(azure_chat_completion_service)

    # Define instructions for each agent
    instructions_business_analyst = """
    You are a Business Analyst which will take the requirements from the user (also known as a 'customer')
    and create a project plan for creating the requested app. The Business Analyst understands the user
    requirements and creates detailed documents with requirements and costing. The documents should be 
    usable by the SoftwareEngineer as a reference for implementing the required features, and by the 
    Product Owner for reference to determine if the application delivered by the Software Engineer meets
    all of the user's requirements.
    """
    
    instructions_software_engineer = """
    You are a Software Engineer, and your goal is create a web app using HTML and JavaScript
    by taking into consideration all the requirements given by the Business Analyst. The application should
    implement all the requested features. Deliver the code to the Product Owner for review when completed.
    You can also ask questions of the BusinessAnalyst to clarify any requirements that are unclear.
    """
    
    instructions_product_owner = """
    You are the Product Owner which will review the software engineer's code to ensure all user 
    requirements are completed. You are the guardian of quality, ensuring the final product meets
    all specifications and receives the green light for release. Once all client requirements are
    completed, you can approve the request by just responding "%APPR%". Do not ask any other agent
    or the user for approval. If there are missing features, you will need to send a request back
    to the SoftwareEngineer or BusinessAnalyst with details of the defect. To approve, respond with
    the token %APPR%.
    """

    # Create agents
    business_analyst_agent = ChatCompletionAgent(
        name="BusinessAnalyst",
        instructions=instructions_business_analyst,
        kernel=kernel_business_analyst
    )
    
    software_engineer_agent = ChatCompletionAgent(
        name="SoftwareEngineer",
        instructions=instructions_software_engineer,
        kernel=kernel_software_engineer
    )
    
    product_owner_agent = ChatCompletionAgent(
        name="ProductOwner",
        instructions=instructions_product_owner,
        kernel=kernel_product_owner
    )

    # Create an AgentGroupChat with the termination strategy
    termination_strategy = ApprovalTerminationStrategy()
    agents = [business_analyst_agent, software_engineer_agent, product_owner_agent]
    agent_group_chat = AgentGroupChat(
        agents=agents,
        termination_strategy=termination_strategy
    )

    # Add user input message to the chat
    user_input = ChatMessageContent(
        role=AuthorRole.USER,
        content=input
    )
    await agent_group_chat.add_chat_message(user_input)
    results = []

    async for message in agent_group_chat.invoke():
        # Extract agent role/name if available
        agent_role = "User"
        if hasattr(message, 'author'):
            agent_role = message.author
        elif hasattr(message, 'role') and message.role == AuthorRole.ASSISTANT:
            # Determine which agent replied based on the message content or metadata
            if hasattr(message, 'metadata') and 'agent_name' in message.metadata:
                agent_role = message.metadata['agent_name']
            # Try to determine which agent based on metadata or other properties
            if hasattr(message, 'metadata') and 'agent_name' in message.metadata:
                agent_role = message.metadata['agent_name']
                    
        # Defensive: ensure message is an object, not a raw string
        if hasattr(message, 'content') and hasattr(message, 'role'):
            results.append({
                "role": message.role,
                "agent": agent_role,
                "content": message.content
            })
        else:
            # fallback in case it's just a string or invalid type
            results.append({
                "role": "unknown",
                "agent": agent_role,
                "content": str(message)
            })
    return {
        "messages": results
    }