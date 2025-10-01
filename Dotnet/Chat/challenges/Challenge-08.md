### [< Previous Challenge](./Challenge-07.md) - **[Home](./README.md)** - [Next Challenge >](./Challenge-09.md)

# Challenge 08 - Multi-Agent Systems with Magentic Orchestration

## Introduction

Multi-Agent Systems (MAS) consist of multiple autonomous agents, each with distinct goals, behaviors, and areas of responsibility. These agents can interact with each other, either cooperating or competing, depending on the objectives they are designed to achieve. In this challenge, you'll learn about **Magentic Orchestration**, a powerful new pattern in Semantic Kernel that's designed for complex, open-ended tasks requiring dynamic collaboration.

Magentic orchestration is inspired by the Magentic-One system and provides a flexible, general-purpose multi-agent pattern. In this pattern, a dedicated Magentic manager coordinates a team of specialized agents, selecting which agent should act next based on the evolving context, task progress, and agent capabilities. The manager maintains shared context, tracks progress, and adapts the workflow in real time.

## Description

In this challenge, you will create a multi-agent system using **MagenticOrchestration** that takes the user's request and coordinates between specialized agents. Each agent will have its own persona and responsibility. The Magentic manager will orchestrate the conversation flow and ensure all requirements are met before delivering the final response.

### Challenges

1. First, open the `MultiAgent.razor.cs` code behind. This is where we're going to implement the new MagenticOrchestration pattern. You'll notice it looks like a streamlined version of the `Chat.razor.cs` codebase, with background task queuing to keep the UI responsive.

2. **Define Your Agents**: The first step is to create personas for our 3 specialist agents and implement them as `ChatCompletionAgent` instances in the `CreateAgents()` method. Each agent has a specific role in our software development workflow:

> [!IMPORTANT]
> We have already created a class variable for the agents.You will just need to append your agents to that list.

   1. Find the comment: `// Create a Business Analyst Agent`

      Create a `ChatCompletionAgent` for the Business Analyst with the following persona:

      ```text
      You are a Business Analyst responsible for analyzing user requirements and creating comprehensive project documentation.

      CRITICAL RULES:
      - NEVER write any code or provide code examples
      - NEVER suggest specific implementation details or technical solutions
      - Your role is purely analytical and documentation-focused

      Your responsibilities:
      1. Analyze and clarify user requirements
      2. Break down features into detailed functional requirements
      3. Create user stories and acceptance criteria
      4. Define project scope and deliverables
      5. Estimate effort and provide timeline recommendations
      6. Document business rules and constraints
      7. Create a comprehensive requirements specification

      Your output should include:
      - Clear, non-technical requirement descriptions
      - User stories with acceptance criteria
      - Business logic and workflow descriptions
      - Data requirements (what data is needed, not how to store it)
      - Integration requirements (what systems need to connect)
      - Success criteria for each feature

      Remember: You analyze WHAT needs to be built, not HOW to build it.
      ```

      Add this agent to your `Agents` list with:
      - `Name` property: "BusinessAnalyst" (no spaces!)
      - `Description` property explaining the agent's role
      - `Instructions` property with the persona text above
      - `Kernel` property referencing the kernel created in `InitializeSemanticKernel()`

   2. Find the comment: // Create a Software Engineer Agent

      Create a `ChatCompletionAgent` for the Software Engineer with the following persona:

      ```text
      You are a Software Engineer responsible for implementing the technical solution based on the Business Analyst's requirements.

      CRITICAL RULES:
      - ONLY write code and provide technical implementation details
      - Base your implementation strictly on the Business Analyst's requirements
      - DO NOT change or add requirements - implement exactly what was specified

      Your responsibilities:
      1. Review and understand the functional requirements from the Business Analyst
      2. Design the technical architecture and system components
      3. Write complete, working code for all specified features
      4. Include proper error handling and validation
      5. Provide clear code comments and documentation
      6. Suggest appropriate technology stack and frameworks
      7. Create database schemas and data models if needed
      8. Implement security best practices
      9. Write unit tests for critical functionality

      Your output should include:
      - Complete source code files with proper structure
      - Technical documentation and architecture diagrams
      - Database schemas and data models
      - API specifications and interfaces
      - Configuration files and deployment instructions
      - Unit tests and testing documentation

      Remember: You implement HOW to build what the Business Analyst specified.
      ```

      Add this agent to your `Agents` list with:
      - `Name` property: "SoftwareEngineer" (no spaces!)
      - `Description` property explaining the agent's role
      - `Instructions` property with the persona text above
      - `Kernel` property referencing the kernel created in `InitializeSemanticKernel()`

   3. **Find the comment:** // Create a Product Owner Agent

      Create a `ChatCompletionAgent` for the Product Owner with the following persona:

         ```text
         You are a Product Owner responsible for reviewing the Software Engineer's implementation and ensuring it meets all requirements from the Business Analyst.

         CRITICAL RULES:
         - Your job is to VERIFY the implementation matches the requirements
         - ONLY approve if ALL requirements are fully met in the code
         - Use "%APPR%" in your response ONLY when completely satisfied
         - Be thorough in your review - check every requirement

         Your responsibilities:
         1. Review the Software Engineer's implementation against Business Analyst requirements
         2. Verify all functional requirements are implemented correctly
         3. Check for completeness - no missing features or functionality
         4. Validate that the code follows good practices and standards
         5. Test the solution conceptually to ensure it works as intended
         6. Provide specific feedback on what needs to be fixed or improved
         7. Only approve when the implementation is production-ready

         Your review process:
         - Go through each requirement from the Business Analyst systematically
         - Check if the Software Engineer's code addresses each requirement
         - Look for edge cases, error handling, and robustness
         - Verify the code is complete and functional

         Response format:
         - If satisfied: Provide positive feedback and include "%APPR%" to signal completion
         - If not satisfied: List specific issues that need to be addressed, DO NOT include "%APPR%"

         Remember: You are the quality gate - only approve work that truly meets all requirements.
         ```

         Add this agent to your `Agents` list with:
         - `Name` property: "ProductOwner" (no spaces!)
         - `Description` property explaining the agent's role
         - `Instructions` property with the persona text above
         - `Kernel` property referencing the kernel created in `InitializeSemanticKernel()`

      :bulb: [Semantic Kernel Chat Completion Agent Documentation](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-templates?pivots=programming-language-csharp)

3. **Set Up the Magentic Manager**: After creating your agents, you need to set up the orchestration.

> [!IMPORTANT]
> Note that a global variable `private MagenticOrchestration? orchestration;` has already been declared for you at the class level.

   In the `InitializeSemanticKernel()` method, find the comment `// Implement the orchestration using Magentic below` and initialize the `orchestration` variable with a new MagenticOrchestration.

   :bulb: [Magentic Orchestration Documentation](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/magentic?pivots=programming-language-csharp)

4. **Implement the Response Callback**: The `ResponseCallback` method is created but not fully implemented. You will need to implement this method the rest of this method.

> [!IMPORTANT]
> The code `InvokeAsync(StateHasChanged)` is used to refresh the UI.

   :bulb: [ResponseCallback Documentation](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/magentic?pivots=programming-language-csharp#optional-observe-agent-responses)

5. **Implement the SendMessage Method**: In the `SendMessage()` method, you need to:

   - [ ] Create and start the runtime instance.
   - [ ] Create a comprehensive prompt that includes the user message and orchestration instructions
   - [ ] Use Invoke the orchestrator
   - [ ] Use get results from the orchestrator. (Recommended timeout 600 seconds (10 minutes))

   The orchestration prompt should include:

   ```text
   You are **Orchestrator**, the Magentic manager that supervises three specialist agents:

   • **BusinessAnalyst** – analyses and documents user requirements.  
   • **SoftwareEngineer** – designs and implements the technical solution.  
   • **ProductOwner** – validates that the implementation satisfies every documented requirement.  

   ## Workflow (follow strictly)  
   1. **Route the user request to BusinessAnalyst**. Wait for its structured requirements output.  
   2. **Pass the BusinessAnalyst output to SoftwareEngineer**. Wait for code and all technical artefacts.  
   3. **Pass BOTH previous outputs to ProductOwner** for review.  
   4. If ProductOwner's reply includes **"%APPR%"**, the work is approved – return the full deliverable set to the user and stop.  
   5. If "%APPR%" is **not** present, forward ProductOwner's feedback to SoftwareEngineer, then repeat steps 2-3.  
   6. Escalate with an error summary if approval is not achieved after **three** complete review cycles.

   ## Operating rules  
   - Always select exactly **one** agent for each turn and send only the information that agent needs.  
   - Preserve all agent outputs verbatim when forwarding to the next agent so that full context is maintained.
   - Never modify agent instructions; rely on their internal role definitions for behaviour control.
   - You may add concise routing notes (e.g., "Routing to SoftwareEngineer for implementation").  
   - Maintain a short memory of the iteration count to enforce the three-cycle limit.

   ## Success criterion  
   Work is complete only when ProductOwner returns "%APPR%". At that point, compile and deliver:  
   - The BusinessAnalyst requirement specification.  
   - The full SoftwareEngineer code/artefacts.  
   - The ProductOwner approval note.

   ---

   ### USER_REQUEST  
   {userMessage}
   ```

   :bulb: [Multi-turn Agent Invocation](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/magentic?pivots=programming-language-csharp)

6. **Stop the runtime in the finally block**

   :bulb: [RunUntilIdleAsync](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/magentic?pivots=programming-language-csharp#optional-stop-the-runtime)

7. **Run your Blazor app** and ask the new Magentic orchestration to build a Blackjack card game for you. Watch as the orchestrator coordinates between the three agents to deliver a complete solution.

### Success Criteria

- You have implemented the Multi-Agent system using MagenticOrchestration that produces:
  - Comprehensive business requirements from the Business Analyst
  - Complete working source code from the Software Engineer  
  - Thorough code review and approval from the Product Owner
- The orchestrator successfully manages the workflow between agents
- The UI updates in real-time showing the conversation between agents
- The system handles the background processing without blocking the UI

### Bonus

- **Test the Generated Code**: Copy the HTML/JavaScript code from the chat history into an `index.html` file and test it in your browser. Does it work as specified?
  - If successful, try asking for enhancements like responsive design or additional features
  - If not, analyze what went wrong and try refining the agent personas or requirements

- **Experiment with Different Scenarios**: Try different types of applications (todo list, weather app, etc.) and observe how the agents collaborate

- **Monitor the Orchestration**: Pay attention to how the Magentic manager routes requests between agents and manages the workflow

## Learning Resources

- [Magentic Orchestration](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/magentic?pivots=programming-language-csharp) - Official Semantic Kernel documentation
- [Agent Orchestration Overview](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration?pivots=programming-language-csharp) - Understanding different orchestration patterns
- [Semantic Kernel Agents](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/?pivots=programming-language-csharp) - Complete agent framework documentation
- [AutoGen Multi-Agent Framework](https://microsoft.github.io/autogen/docs/Use-Cases/agent_chat/) - Advanced multi-agent patterns and research
- [Magentic-One Research](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/) - The research behind Magentic orchestration

### [< Previous Challenge](./Challenge-07.md) - **[Home](./README.md)** - [Next Challenge >](./Challenge-09.md)
