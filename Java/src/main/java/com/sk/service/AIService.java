package com.sk.service;

import com.azure.ai.openai.OpenAIAsyncClient;
import com.azure.ai.openai.OpenAIClientBuilder;
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
import com.sk.model.ChatRequest;
import com.sk.plugins.AISearchPlugin;
import com.sk.plugins.DateTimePlugin;
import com.sk.plugins.GeocodingPlugin;
import com.sk.plugins.WeatherPlugin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
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

            // Adding method for Plugin | Challenge 3, for adding the plugins
            //kernel = AddPlugins(kernel);


            ChatHistory chatHistory = new ChatHistory();
            chatHistory = addUserMessage(chatRequest);

		/* ChatCompletionService chatCompletionService | Challenge 2 for Create chatCompletionService
		 Initialize a new ChatHistory object to store the conversation history.
		 Retrieve the ChatCompletionService from the kernel to handle chat completions.
		 Iterate through the list of user messages from the ChatRequest object
		 and add each message to the chat history as a user message.
		*/



            InvocationContext invocationContext = null;

		/* Adding invocationContext | Challenge 03 for Create the InvocationContext
		 Build an InvocationContext object to configure the behavior and return mode
		 for the invocation of the ChatCompletionService. This configuration allows
		 all kernel functions to be called and ensures the full conversation history
		 is returned as part of the response.*/


		/*
		 List<ChatMessageContent<?>> response || Challenge 2 for make the call to the chatCompletionService
		 Retrieve the list of chat message contents asynchronously from the ChatCompletionService.
		 This method takes the chat history, kernel, and invocation context as inputs and blocks
		 until the response is received. The response contains the AI-generated messages.
		*/


            /*if (response == null || response.isEmpty()) {
                throw new ServiceNotFoundException("No response from the service");
            }*/
            // Do not add AI response to chat history as a user message
            System.out.println("AI response: success");
            return null;
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
        // Enable Plugin for Date and Time | Challenge 3 for adding the plugins


        // Enable Plugin for Geo location | Challenge 3
        /*KernelPlugin geoPlugin = KernelPluginFactory
                .createFromObject(new GeocodingPlugin(config, restTemplate), "GeocodingPlugin");

        // Enable Plugin for Weather | Challenge 3
        KernelPlugin weatherPlugin = KernelPluginFactory
                .createFromObject(new WeatherPlugin(config, restTemplate), "WeatherPlugin");
        
        //Challenge 04 START for Create the RAGPlugin
        //Challenge 04, Uncomment bellow line for AI search plugin and add the plugin to the list
        KernelPlugin AISearch = KernelPluginFactory
                .createFromObject(new AISearchPlugin(config, kernelUtil), "AISearchPlugin");*/

       
                

                
 
        // Challenge 05, Uncomment bellow line for food plugin and add the plugin to the list
        //KernelPlugin foodplugin = KernelPluginFactory
        //        .importPluginFromDirectory(Path.of("src/main/resources"),
        //                "promptconfig", null);
        
        // Add plugin into kernel | Challenge 03


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

        // OpenAIAsyncClient client | Challenge 2 for Create the client
		/*
		 Create an OpenAIAsyncClient instance using the OpenAIClientBuilder.
		 This client is configured with the API key and endpoint from the AzureAIConfig.
		 It is used to interact with OpenAI services asynchronously.
		*/


        // ChatCompletionService  | Challenge 2 Create the chat completion service
		/*
		 Create a ChatCompletionService instance using the OpenAIChatCompletion builder.
		 This service is configured with the OpenAIAsyncClient and the model ID from the AzureAIConfig.
		 It is used to handle chat completions.
		*/



		/*
		Kernel kernel | Challenge 2 for Create the kernel
		 Build a Kernel instance using the Kernel builder.
		 Configure it with the ChatCompletionService and finalize the build process.
		*/


        return null;

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
    private ChatHistory addUserMessage(ChatRequest chatAppRequest) {
        ChatHistory chatHistory = new ChatHistory();
        chatAppRequest.getMessages().forEach(
                historyChat -> {
                    // Validate that content is not null or empty before adding to chat history
                    String content = historyChat.getContent();
                    if (content != null && !content.trim().isEmpty()) {
                        if("user".equals(historyChat.getRole())) {
                            chatHistory.addUserMessage(content);
                        }
                        if("assistant".equals(historyChat.getRole())) {
                            chatHistory.addAssistantMessage(content);
                        }
                    }
                });

        return chatHistory;
    }
}