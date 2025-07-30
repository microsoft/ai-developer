### [< Previous Challenge](./Challenge-01.md) - [**Home**](../README.md) - [Next Challenge >](./Challenge-03.md)

# Challenge-02 - Semantic Kernel Fundamentals

## Introduction

The first step in understanding Semantic Kernel is to become familiar with the basics. Semantic Kernel is a lightweight, open-source development kit designed to help developers build AI-infused applications using the latest AI models. It supports languages like JAVA, Python, and .NET, making it versatile for various development environments. Semantic Kernel provides a simple and consistent API for developers to interact with several different AI models, including GPT-3.5, GPT-4, Meta-Llama, DALL·E, and many more. You can use Semantic Kernel to build applications that can generate text, images, sound, and even code. Models can be hosted locally or in the cloud, and you can use the same API to interact with them.

## Description

In this challenge, you will be provided with a starter application that will require you to complete the implementation of the chat feature using Semantic Kernel and the Azure AI Foundry GPT-4o model. The application is a simple spring boot API based application that allows users to interact with the AI model by using REST API tool like POSTMAN by typing a question or prompt. The AI model will then respond with an answer or completion to the prompt. The application uses the Semantic Kernel framework to interact with the AI model. You will need to complete the implementation of the chat API to send the user's prompt to the AI model and return the response to the user.

## Prerequisites

1. Complete the previous challanges.

## Challenges

### Implementation Steps

1. Deploy a GTP-4o model using  [Azure AI Foundry Studio](https://ai.azure.com) `https://ai.azure.com`. The **Deployment name** should be something similar to ``` gpt-4o ```. This name will be needed next when configuring Semantic Kernel. :exclamation: Deployment type should be **Standard**. :exclamation:
2. Open the terminal or powershell. Navigate to code checkout directory and open the project in your favorite IDE. For example, if you are using Visual Studio Code, run the following commands:  
    ```bash
        code .
        # Navigate to the Java project directory
        cd Java 
    ```
4. If you are using Visual Studio code or IntelliJ, open terminal Copy the TEMP file as PROPERTIES file
    ```bash
        cp .\src\main\resources\application.properties.temp .\src\main\resources\application.properties
    ```
3. Update the *application.properties* file with the Azure AI Foundry *Deployment name*, *Endpoint URL* and the *API Key*. These values can be found in the Azure AI Foundry Studio.

    :bulb: **The endpoint URL should be in the format** ```https://<deployment-name>.openai.azure.com```

    ```bash
        spring.ai.azure.openai.chat.deployment-name: "Replace with your AOI deployment name",
        spring.ai.azure.openai.endpoint: "Replace with your AOI endpoint",
        spring.ai.azure.openai.api-key: "Replace with your AOI API key",
        spring.application.name: "Replace with your application name",
    ```

4. Build and compile the application using the following command:

    ```bash
        mvn clean install package -DskipTests=true
    ```
5. Run the Spring Boot application using the following command:

    ```bash
        mvn spring-boot:run
    ```
   :pushpin: **OPTIONAL** If server is not starting due to port already in use, you can change the port in the `application.properties` file. For example, change the port to 8081.
    
    ```bash
        server.port=8081
    ```
6. For starting the FrontEnd, **_open a new terminal_** and go on GIT root repo. 
    ```bash
        cd ChatUI
   ```
7. Open .env.local file and update "NEXT_PUBLIC_STANDARD_CHAT_API_URL" with the API URL. The API URL should be in the format ```http://localhost:8080/api/skChat```. 
   ```bash
        npm install
        npm run dev
    ```
6. Once the ReactJS is start, use [http://localhost:3000/](http://localhost:3000/)
6. Locate the file name "AIService.java(src/main/java/com/sk/service).
7. Search code comment `//  Challenge 2` in the `AIService.java` file. 

    :bulb: [Retrieving chat completion services](https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/?tabs=csharp-AzureOpenAI%2Cpython-AzureOpenAI%2Cjava-AzureOpenAI&pivots=programming-language-java#retrieving-chat-completion-services)
    
    - Search for `OpenAIAsyncClient client | Challenge 2`,  and add `OpenAIAsyncClient client` object after the comment line. Make sure you add APIKEY and ENDPOINT in the method.
    - Search for `ChatCompletionService  | Challenge 2`,  and add `ChatCompletionService` object after the comment line. Make sure you add MODELNAME in the method.
    - Search for `Kernel kernel | Challenge 2`,  and Initialize the kernel `ChatCompletionService` object after the comment line.
    - **_Note:_** Update the return statement and return kernel object.
    - Search for `ChatCompletionService chatCompletionService | Challenge 2`,  and Initialize the kernel `Kernel` object after the comment line.
    - Search for `List<ChatMessageContent<?>> response || Challenge 2`,  and Retrieve the list of chat message contents asynchronously from the ChatCompletionService.
    - add the `.block();` at the end of statement.
    - return the response object. `return responses`

    :pushpin:  The kernel itself doesn't expose AI functionality directly - instead, it manages services that do. When we want to send messages to the AI, we need to obtain a reference to the chat service specifically from the kernel's dependency injection container (kernel.Services). That's why we use GetRequiredService to get an IChatCompletionService from the kernel, which we'll use to handle our actual AI conversations.


### Testing

1. Run the application and test the chat completion by submitting the prompt:
2. Open the browser http://localhost:3000
3. Use the following PROMPT:

    ```json
   Why is the sky blue?
    ```
    :bulb: For more information on the Semantic Kernel, refer to the documentation [here](https://learn.microsoft.com/en-us/semantic-kernel/concepts/kernel?pivots=programming-language-java).

1. Test the Chat History by submitting the following prompt without refreshing the browsing window and clearing the chat history.

    ```text
    Why is it red?
    ```

    If the chat history is working, the AI will understand the context of the next question  and provide a relevant response.

    If you refresh the browser window or click `New Chat`, the AI will not have the context of the previous question and will not provide a relevant response. So then you would have to provide the context again by asking the question:

    ```text
    Why is the Sun red?
    ```

    :bulb: For more information on Chat History, refer to the documentation [here](https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/chat-history?pivots=programming-language-csharp).

1. Test the application with a variety of prompts to ensure it responds appropriately.

## Success Criteria

- Configuration
  - [ ] Deployed GPT model in Azure AI Foundry Studio
  - [ ] Added deployment name, endpoint URL, and API key to appsettings.json
- Kernel Setup
  - [ ] Registered chat completion service with kernel builder
  - [ ] Built kernel instance
  - [ ] Retrieved chat completion service using GetRequiredService
- Message Handling
  - [ ] Implemented adding user messages to chat history
  - [ ] Successfully calling chat completion service
  - [ ] Adding AI responses to chat history
- Testing
  - [ ] "Why is the sky blue" returns a coherent response
  - [ ] "Why is it red" demonstrates chat history is working
  - [ ] AI responds appropriately to follow-up questions


## Learning Resources

[Understanding the kernel](https://learn.microsoft.com/en-us/semantic-kernel/concepts/kernel?pivots=programming-language-csharp)

[Chat completion](https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/?tabs=csharp-AzureOpenAI%2Cpython-AzureOpenAI%2Cjava-AzureOpenAI&pivots=programming-language-csharp)

[Chat history](https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/chat-history?pivots=programming-language-csharp)

[What is a Planner?](https://learn.microsoft.com/en-us/semantic-kernel/concepts/planning?pivots=programming-language-csharp)

### [< Previous Challenge](./Challenge-01.md) - **[Home](../README.md)** - [Next Challenge >](./Challenge-03.md)
