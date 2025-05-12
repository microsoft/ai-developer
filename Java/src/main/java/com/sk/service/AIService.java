package com.sk.service;

import com.azure.ai.openai.OpenAIAsyncClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import com.microsoft.semantickernel.Kernel;
import com.microsoft.semantickernel.aiservices.openai.chatcompletion.OpenAIChatCompletion;
import com.microsoft.semantickernel.orchestration.InvocationContext;
import com.microsoft.semantickernel.orchestration.InvocationReturnMode;
import com.microsoft.semantickernel.orchestration.ToolCallBehavior;
import com.microsoft.semantickernel.plugin.KernelPlugin;
import com.microsoft.semantickernel.plugin.KernelPluginFactory;
import com.microsoft.semantickernel.services.ServiceNotFoundException;
import com.microsoft.semantickernel.services.chatcompletion.ChatCompletionService;
import com.microsoft.semantickernel.services.chatcompletion.ChatHistory;
import com.microsoft.semantickernel.services.chatcompletion.ChatMessageContent;
import com.sk.config.AzureAIConfig;
import com.sk.kernel.kernelUtil;
import com.sk.model.ChatRequest;
import com.sk.plugins.AISearchPlugin;
import com.sk.plugins.DateTimePlugin;
import com.sk.plugins.GeocodingPlugin;
import com.sk.plugins.WeatherPlugin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
@Service
public class AIService {

    @Autowired
    RestTemplate restTemplate;
    @Autowired
    AzureAIConfig config;
    @Autowired
    com.sk.kernel.kernelUtil kernelUtil;

    public List<ChatMessageContent<?>> getAIResponse(ChatRequest chatRequest) throws IOException, ServiceNotFoundException {
        long startTime = System.nanoTime(); // Start the timer
        try {
            Kernel kernel = kernelBuilder();

            // Challenge 3, for adding the plugins
            //kernel = AddPlugins(kernel);



		/* Challenge 2 for Create chatCompletionService
		 Initialize a new ChatHistory object to store the conversation history.
		 Retrieve the ChatCompletionService from the kernel to handle chat completions.
		 Iterate through the list of user messages from the ChatRequest object
		 and add each message to the chat history as a user message.
		*/
            ChatHistory chatHistory = new ChatHistory();
            chatHistory = convertSKChatHistory(chatRequest);
            ChatCompletionService chatCompletionService = kernel.getService(ChatCompletionService.class);


            InvocationContext invocationContext = null;

		/* Challenge 03 for Create the InvocationContext
		 Build an InvocationContext object to configure the behavior and return mode
		 for the invocation of the ChatCompletionService. This configuration allows
		 all kernel functions to be called and ensures the full conversation history
		 is returned as part of the response.*/
            invocationContext = InvocationContext.builder()
                    .withToolCallBehavior(ToolCallBehavior.allowAllKernelFunctions(true)) // Allow unrestricted kernel function calls
                    .withReturnMode(InvocationReturnMode.NEW_MESSAGES_ONLY) // Return the full conversation history
                    .build();

		/*
		 Challenge 2 for make the call to the chatCompletionService
		 Retrieve the list of chat message contents asynchronously from the ChatCompletionService.
		 This method takes the chat history, kernel, and invocation context as inputs and blocks
		 until the response is received. The response contains the AI-generated messages.
		*/
            List<ChatMessageContent<?>> responses = chatCompletionService.getChatMessageContentsAsync(
                    chatHistory,
                    kernel,
                    invocationContext
            ).block();

            if (responses == null || responses.isEmpty()) {
                throw new ServiceNotFoundException("No response from the service");
            }
            // Add AI response to chat history
            //chatHistory.addUserMessage(responses.get(0).getContent());
            System.out.println("AI response: success");
            return responses;
        } catch (Exception e) {
            System.out.println("AI response: " + e.getMessage());
            throw new RuntimeException("Error processing AI response", e);
        } finally {
            long endTime = System.nanoTime(); // End the timer
            long duration = endTime - startTime; // Calculate the duration
            System.out.println("Execution time: " + (duration/1000000000) + " seconds");
        }
    }



    private Kernel AddPlugins(Kernel kernel) throws IOException {
        // Challenge 03 START for Create the DateTimePlugin
        /*KernelPlugin dateTimePlugin = KernelPluginFactory
                .createFromObject(<Plugin Class>, "<Plugin Name>);
          KernelPlugin geoPlugin = KernelPluginFactory
                .createFromObject(new GeocodingPlugin(config, restTemplate), "GeocodingPlugin");

          KernelPlugin weatherPlugin = KernelPluginFactory
                .createFromObject(new WeatherPlugin(config, restTemplate), "WeatherPlugin");
        */
        //Challenge 04 START for Create the RAGPlugin
        // Challenge 04, Uncomment bellow line for AI search plugin and add the plugin to the list
        /*KernelPlugin AISearch = KernelPluginFactory
                .createFromObject(new AISearchPlugin(config, kernelUtil), "AISearchPlugin");
*/
        // Challenge 05, Uncomment bellow line for food plugin and add the plugin to the list
        /*KernelPlugin foodplugin = KernelPluginFactory
                .importPluginFromDirectory(Path.of("src/main/resources"),
                        "promptconfig", null);
*/
        // Challenge 03 add the plugin into kernel
        //kernel = addPluginwithKernel(kernel, List.of());

        return kernel;
    }

    public Kernel addPluginwithKernel(Kernel kernel, List<KernelPlugin> plugins) throws IOException {

        Kernel.Builder kernelBuilder = kernel.toBuilder();
        if (plugins != null) {
            for (KernelPlugin plugin : plugins) {
                kernelBuilder.withPlugin(plugin);
            }
        }
        return kernelBuilder.build();


    }

    public Kernel kernelBuilder() throws IOException {

        // Challenge 2 for Create the client
		/*
		 Create an OpenAIAsyncClient instance using the OpenAIClientBuilder.
		 This client is configured with the API key and endpoint from the AzureAIConfig.
		 It is used to interact with OpenAI services asynchronously.
		*/


        // Challenge 2 Create the chat completion service
		/*
		 Create a ChatCompletionService instance using the OpenAIChatCompletion builder.
		 This service is configured with the OpenAIAsyncClient and the model ID from the AzureAIConfig.
		 It is used to handle chat completions.
		*/


        Kernel kernel = null;
		/*
		Challenge 2 for Create the kernel
		 Build a Kernel instance using the Kernel builder.
		 Configure it with the ChatCompletionService and finalize the build process.
		*/


        return kernel;

    }

    /*
        * This method converts the ChatRequest object to a ChatHistory object.
        * It iterates through the messages in the ChatRequest and adds them to the ChatHistory
        * based on their role (user or assistant).
        * The ChatHistory object is then returned.
        * @param chatAppRequest The ChatRequest object containing the messages.
        * @return A ChatHistory object containing the converted messages.
        * This method is used to maintain the conversation history
        * and ensure that the AI model has access to the previous messages
        * for context during the chat session.
     */
    private ChatHistory convertSKChatHistory(ChatRequest chatAppRequest) {
        ChatHistory chatHistory = new ChatHistory();
        chatAppRequest.getMessages().forEach(
                historyChat -> {
                    if("user".equals(historyChat.getRole())) {
                        chatHistory.addUserMessage(historyChat.getContent());
                    }
                    if("assistant".equals(historyChat.getRole()))
                        chatHistory.addAssistantMessage(historyChat.getContent());
                });


        return chatHistory;

    }
}
