### [< Previous Challenge](./Challenge-07.md) - **[Home](../README.md)**

# Challenge 08 - Multi-Agent Systems

## Introduction

Multi-Agent Systems (MAS) consist of multiple autonomous agents, each with distinct goals, behaviors, and areas of responsibility. These agents can interact with each other, either cooperating or competing, depending on the objectives they are designed to achieve. In MAS, each agent operates independently, making decisions based on its local knowledge and the environment, but they can communicate and share information to solve complex problems collectively.

MAS is often used in scenarios where tasks are distributed across different entities, and the overall system benefits from decentralization. Examples include simulations of real-world systems like traffic management, robotic teams, distributed AI applications, or networked systems where agents need to coordinate actions without a central controller. MAS allows for flexibility, scalability, and adaptability in solving dynamic and complex problems where a single agent or centralized system might be less efficient or incapable of handling the complexity on its own.

## Description

In this challenge, you will create a multi-agent system that takes the user's request and feeds it to a collection of agents. Each agent will have it's own persona and responsibility. The final response will be a collection of answers from all agents that together will satisfy the user's request based on each persona's area of expertise.

### Challenges

1. First, we're going to open the `MultiAgent.razor.cs` code behind. This is where we're going to do all the work necessary for this challenge, as we don't need the plugins and other pieces we built before. You might notice that it looks like a stripped down version of the `Chat.razor.cs` code-base. Most of the code here is the same as what you've built.

1. The first thing we need to do is create the personas for our 3 agents. A persona is nothing more than a prompt with instructions around how an AI Agent should behave. We're going to use the following 3 personas.

```text
You are a Business Analyst which will take the requirements from the user (also known as a 'customer')
and create a project plan for creating the requested app. The Business Analyst understands the user
requirements and creates detailed documents with requirements and costing. The documents should be 
usable by the SoftwareEngineer as a reference for implementing the required features, and by the 
Product Owner for reference to determine if the application delivered by the Software Engineer meets
all of the user's requirements.
```

```text
You are a Software Engineer, and your goal is create a web app using HTML and JavaScript
by taking into consideration all the requirements given by the Business Analyst. The application should
implement all the requested features. Deliver the code to the Product Owner for review when completed.
You can also ask questions of the BusinessAnalyst to clarify any requirements that are unclear.
```

```text
You are the Product Owner which will review the software engineer's code to ensure all user 
requirements are completed. You are the guardian of quality, ensuring the final product meets
all specifications and receives the green light for release. Once all client requirements are
completed, you can approve the request by just responding "%APPR%". Do not ask any other agent
or the user for approval. If there are missing features, you will need to send a request back
to the SoftwareEngineer or BusinessAnalyst with details of the defect. To approve, respond with
the token %APPR%.
```

1. In the `CreateAgents()` Method, we need to create a `ChatCompletionAgent` for each of the above personas. Each agent should have the Instructions, a Name, and a reference to the Kernel that is created in the `InitializeSemanticKernel()` method.

    :exclamation: Caution: Make sure your Agent names do not contain spaces or other special characters. Letters only!

    :bulb: You can create and use a different Kernel object for each agent. Great if some agents can operate with cheaper models such as GPT 3.5 or 4o-mini, while others might need more expensive agents!

    :bulb: [Semantic Kernel Chat Completion Agent](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-templates?pivots=programming-language-csharp)

1. Next we want to create an `AgentGroupChat` to tie together the 3 agents. Head up to the last line of the `InitializeSemanticKernel()` method. Look for the Comment that instructs you to create the `AgentGroupChat` object. You need to create the AgentGroupChat, passing it the Array of `Agents`, and `ExecutionSettings` will need to set the `TerminationStrategy` to an instance of `ApprovalTerminationStrategy`. This class takes 2 arguments, the `MaximumIterations`, which is how many times the group are allowed to communicate between each other before we abandon the thread, and `Agents` which is a `IReadOnlyList<Agent>` collection of agents that are allowed to terminate the chat.

    :bulb: [Semantic Kernel Agent Collaboration](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-chat?pivots=programming-language-csharp#creating-an-agent-group-chat)

    :bulb: [Multi-Turn Agent Invocation](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-chat?pivots=programming-language-csharp#multi-turn-agent-invocation)

1. At the bottom of `MultiAgent.razor.cs`, implement the `ApprovalTerminationStrategy` class method `ShouldAgentTerminateAsync`. The agents should terminate when the ProductOwnerAgent returns the word *"%APPR%"* in the chat history.

    :bulb: [Agent Termination Strategies](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-chat?pivots=programming-language-csharp#chat-termination)

1. Next up, we need to implement the `SendMessage()` method. It will be similar in nature to the one you built in the `Chat.razor.cs` in other challenges. There are two key pieces you will need to implement. You need to create a new `ChatMessageContent` object, and add it to the `AgentGroupChat` object. It should have an `AuthorRole` specified for the User, and the chat message contents that we copied to the `userMessage` variable.

    :bulb: [Multi-turn chat](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-chat?pivots=programming-language-csharp#multi-turn-agent-invocation)

1. Finally, we need to iterate through the results from the `AgentGroupChat` and dump them to our `chatHistory` to display back to the user. We can use an async foreach loop to do this like so:

   ```csharp
    await foreach (var message in AgentGroupChat.InvokeAsync())
   ```

    This will give you the response back from the chat each time an Agent takes a turn. You can then add this message to the chatHistory directly.

    :bulb: You should add a call to `StateHasChanged()` after you add the object to the chat history so that Blazor knows to refresh the UI.

    :bulb: If you do not see your message in the UI then you forgot to add the userMessage to the chatHistory. Make sure you are adding the message to the chatHistory in the correct place.

1. Run your Blazor app, and ask the new group of AI Agents to build a calculator app for you.

### Success Criteria

- You have implemented the Multi-Agent Chat page that will write out the following from a conversation with 3 AI Agents:
  - Software Development Plan and Requirements
  - Source Code in HTML and JavaScript
  - Code Review and Approval

### Bonus

- Copy the Code from the chat history markdown into matching files on your file system. There should be HTML content specified. Stick that in an index.html, and then launch it with your web browser. Did the app function as the AI said it would?
  - If so, see if you can enhance the app. Ask the AI to make it responsive. Or maybe ask it to add a feature.
  - If not, try experimenting with your personas. Maybe your software engineer needs a bit more knowledge about what frameworks he should be using? Or maybe you just need to give better requirements to your group. See if you can get a functional app!

## Learning Resources

- [Agent Group Chat with Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-chat?pivots=programming-language-csharp) - Semantic Kernel docs on Multi-agent Collaboration
- [MetaGPT](https://github.com/geekan/MetaGPT) - Multi-agent Framework. Great example of what a complex multi-agent system can do.
- [AutoGen Multi-Agent Conversational Framework](https://microsoft.github.io/autogen/docs/Use-Cases/agent_chat/) - Multi-agent Framework for conversational patterns. Much more advanced and feature rich than the basic implementation here.
- [AutoGen with Semantic Kernel](https://devblogs.microsoft.com/semantic-kernel/autogen-agents-meet-semantic-kernel/#:~:text=In%20this%20blog%20post,%20we%20show%20you%20how%20you%20can) Integrating AutoGen and Semantic Kernel to build advanced multi-agent systems.

### [< Previous Challenge](./Challenge-07.md) - **[Home](../README.md)**
