# Exercise 2: Semantic Kernel Fundamentals

## Estimated Duration: 25 Minutes

This hands-on lab provides practical experience with Semantic Kernel and the Azure AI Foundry GPT-4o model. Designed for those new to AI development, the lab guides you step-by-step on how to build an intelligent chat feature within a starter application. You will use the Semantic Kernel framework to connect with the GPT-4o model, implement a chat API that sends user prompts, and return dynamic AI-generated responses.

## Objectives
In this exercise, you will be performing the following tasks:
- Task 1: Set up environment variables
- Task 2: Update the code files and run the app

## Task 1: Set up environment variables

In this task, you will explore different flow types in Azure AI Foundry by setting up Visual Studio Code, retrieving Azure OpenAI credentials, and configuring them in Python and C# environments.

1. Open **Visual Studio Code** using the desktop shortcut in the labvm.

1. Click on **File (1)** and select **Open Folder (2)**.

    ![](./media/kernel-image26.png)
    
1. Navigate to `C:\LabFiles` (1), select the **ai-developer (2)** folder, and click **Select Folder (3)**.

    ![](./media/kernel-image27.png)

1. If you receive a `Do you trust the authors of the files in folder` warning, select the **checkbox (1)** and click **Yes, I trust the authors (2)**.

    ![](./media/kernel-image28.png)

1. Navigate to the **AI Foundry** Portal, go to the **Overview (1)** page, select **Azure OpenAI (2)**. Copy the **API key (3)** the **API endpoint(4)** and paste it into **Notepad** to be used in the upcoming exercises.

    ![](./media/kernel-image25.png)


<details>
<summary><strong>Python</strong></summary>

1. Navigate to **`Python (1) > src (2)`** directory and open **.env** (3) file.

    ![](./media/kernel-image(29).png)

1. Paste **Azure OpenAI Service endpoint** copied earlier in the exercise besides `AZURE_OPENAI_ENDPOINT`.
    >Note:- Ensure that every value in the **.env** file is enclosed in **double quotes (")**.
1. Paste **API key** copied earlier in the exercise besides `AZURE_OPENAI_API_KEY`.

    ![](./media/image_027.png)

1. Use **Ctrl+S** to save the file.

</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Navigate to **`Dotnet (1) > src (2) > BlazorAI (3)`** directory and open **appsettings.json (4)** file.

    ![](./media/kernel-image31.png)

1. Paste **Azure OpenAI Service endpoint** copied earlier in the exercise besides `AOI_ENDPOINT`.
    >**Note**:- Ensure that every value in the **appsettings.json** file is enclosed in **double quotes (")**.

    >**Note**:- Make sure to remove the "/" from the endpoint.
1. Paste **API key** copied earlier in the exercise besides `AOI_API_KEY`.

    ![](./media/kernel-image(32).png)

1. Use **Ctrl+S** to save the file.

</details>

## Task 2: Update the code files and run the app

In this task, you will explore different flow types in Azure AI Foundry by updating code files, running the AI-powered app in Python and C#, and testing responses to user prompts.

<details>
<summary><strong>Python</strong></summary>

1. Navigate to **`Python (1) > src (2)`** directory and open **chat.py (3)** file.

    ![](./media/kernel-image33.png)

1. Add the following code in the `#Import Modules` (1) section of the file.

    ```
    from semantic_kernel.connectors.ai.chat_completion_client_base import ChatCompletionClientBase
    from semantic_kernel.connectors.ai.open_ai import OpenAIChatPromptExecutionSettings
    import os
    ```

    ![](./media/image_031.png)

1. Add the following code in the `# Challenge 02 - Chat Completion Service` (1) section of the file.

    ```
    chat_completion_service = AzureChatCompletion(
        deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        service_id="chat-service",
    )
    kernel.add_service(chat_completion_service)
    execution_settings = kernel.get_prompt_execution_settings_from_service_id("chat-service")
    ```

    ![](./media/image_032.png)

1. Add the following code in the `# Start Challenge 02 - Sending a message to the chat completion service by invoking kernel` section of the file.

    ```
    global chat_history
    chat_history.add_user_message(user_input)
    chat_completion = kernel.get_service(type=ChatCompletionClientBase)
    execution_settings = kernel.get_prompt_execution_settings_from_service_id("chat-service")
    response = await chat_completion.get_chat_message_content(
        chat_history=chat_history,
        settings=execution_settings,
        kernel=kernel
    )
    chat_history.add_assistant_message(str(response))
    ```

    ![](./media/image_033.png)

1. Add the following code in the `#return result` section of the file.

    ```
    logger.info(f"Response: {response}")
    return response
    ```

    ![](./media/image_034.png)

1. Refer to the code provided at the following URL. Please verify that your code matches the one below and correct any indentation errors if present:

   - Open the provided link in your browser, press Ctrl + A to select whole code, then copy and paste it into Visual Studio Code.

        ```
        https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/python/lab-02.py
        ```

1. Save the file.

1. Right click on **`Python>src (1)`** in the left pane and select **Open in Integrated Terminal (2)**.

    ![](./media/kernel-image34.png)

1. Use the following command to run the app:

    ```
    streamlit run app.py
    ```

1. If you are asked for any email to register, feel free to use the below provided email, and hit **Enter**:

    ```
    test@gmail.com
    ```

    ![](./media/kernel-image35.png)

1. If the app does not open automatically in the browser, you can access it using the following **URL**:

    ```
    http://localhost:8501
    ```

1. Submit the following prompt **(1)** and click on **Send (2)** see how the AI responds:

    ```
    Why is the sky blue?
    ```

    ```
    Why is it red?
    ```

    ![](./media/kernel-image36.png)

1. You will receive a response similar to the one shown below:

    ![](./media/kernel-image39.png)
</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Navigate to **`Dotnet (1) > src (2) > BlazorAI (3) > Components (4) >Pages (5)`** directory and open **Chat.razor.cs (6)** file.

    ![](./media/kernel-image55.png)
1. Add the following code in the `// Your code goes here(Line no. 92)` (1) section of the file.

    ```
    chatHistory.AddUserMessage(userMessage);
    var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
    var assistantResponse = await chatCompletionService.GetChatMessageContentAsync(
        chatHistory: chatHistory,
        kernel: kernel);
    chatHistory.AddAssistantMessage(assistantResponse.Content);
    ```

    ![](./media/image_039.png)

1. Refer to the code provided at the following URL. Please verify that your code matches the one below and correct any indentation errors if present 

   - Open the provided link in your browser, press Ctrl + A to select whole code, then copy and paste it into Visual Studio Code.

        ```
        https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/c%23/lab-02.cs
        ```

1. Use **Ctrl+S** to save the file.

1. Expand **`Dotnet>src>Aspire`** right click on **`Aspire.AppHost`** **(1)** in the left pane and select **Open in Integrated Terminal (2)**.

    ![](./media/kernel-image56.png)
1. Run the following line of code to trust the dev certificates necessary to run the app locally, and then select **Yes**:

    ```
    dotnet dev-certs https --trust
    ```

    ![](./media/32.png)

1. Use the following command to run the app:

    ```
    dotnet run
    ```
    
1. Open a new tab in the browser and navigate to the link for **blazor-aichat**, i.e. **https://localhost:7118/**.

    >**Note**: If you receive security warnings in the browser, close the browser and follow the link again.

1. Submit the following prompt and see how the AI responds:

    ```
    Why is the sky blue?
    ```

    ```
    Why is it red?
    ```
    ![](./media/kernel-image42.png)
   
1. You will receive a response similar to the one shown below:

    ![](./media/kernel-image43.png)

</details>

## Review

In this exercise, we utilized **Semantic Kernel** in combination with the **Azure AI Foundry GPT-4o model** to build an intelligent chat feature within a starter application. We integrated the Semantic Kernel framework with GPT-4o, implemented a chat API to handle user prompts, and returned dynamic AI-generated responses. This enhanced our proficiency in connecting applications to powerful language models using modern AI development frameworks.

You have successfully completed the below tasks for AI-driven chat implementation using **Semantic Kernel** and **Azure AI Foundry GPT-4o**:  

- Integrated **Semantic Kernel** with **GPT-4o** for intelligent AI interactions.  
- Configured a **chat API** to process user prompts and generate AI-driven responses.     
- Extended chatbot functionality by integrating **Azure AI Search** for contextual data retrieval.  

## Congratulations on successfully completing the lab! Click Next >> to continue to the next lab.

![Launch Azure Portal](./media/gsk5.png)