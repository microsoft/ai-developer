import asyncio
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion
from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.agents.strategies.termination.termination_strategy import TerminationStrategy
from semantic_kernel.contents.chat_history import ChatHistory
from semantic_kernel.contents.chat_message_content import ChatMessageContent
from semantic_kernel.contents.function_call_content import FunctionCallContent
from semantic_kernel.contents.function_result_content import FunctionResultContent
from semantic_kernel.contents.utils.author_role import AuthorRole


class ApprovalTerminationStrategy(TerminationStrategy):
    """A strategy for determining when an agent should terminate."""

    async def should_agent_terminate(self, agent, history):
        # Implement Agent termination logic
        return None

def _write_content(content: ChatMessageContent) -> None:
    """Write the content to the console."""
    last_item_type = type(content.items[-1]).__name__ if content.items else "(empty)"
    message_content = ""
    if isinstance(last_item_type, FunctionCallContent):
        message_content = f"tool request = {content.items[-1].function_name}"
    elif isinstance(last_item_type, FunctionResultContent):
        message_content = f"function result = {content.items[-1].result}"
    else:
        message_content = str(content.items[-1])
    print(f"[{last_item_type}] {content.role} : '{message_content}'")

# A helper method to invoke the agent with the user input
async def invoke_agent(agent: ChatCompletionAgent, input: str, chat_history: ChatHistory) -> None:
    """Invoke the agent with the user input."""
    chat_history.add_user_message(input)
    print(f"# {AuthorRole.USER}: '{input}'")

    async for content in agent.invoke(chat_history):
        if not any(isinstance(item, (FunctionCallContent, FunctionResultContent)) for item in content.items):
            chat_history.add_message(content)
        _write_content(content)


async def main():
    service_id ="agent"
    # Define the Kernel

    # Chat Completion Service


    # Create agents


    # Chat agent group and termination strategy

if __name__ == "__main__":
    asyncio.run(main())