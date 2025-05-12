package com.sk.kernel;


import com.azure.ai.openai.OpenAIAsyncClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.credential.KeyCredential;
import com.microsoft.semantickernel.Kernel;
import com.microsoft.semantickernel.aiservices.openai.chatcompletion.OpenAIChatCompletion;
import com.microsoft.semantickernel.plugin.KernelPlugin;
import com.microsoft.semantickernel.services.chatcompletion.ChatCompletionService;

import com.sk.config.AzureAIConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class kernelUtil {

    @Autowired
    AzureAIConfig config;

    public Kernel kernelBuilder(List<KernelPlugin> plugins) throws IOException {

        OpenAIAsyncClient clientasync = new OpenAIClientBuilder()
                .credential(new AzureKeyCredential(config.getOpenAiApiKey()))
                .endpoint(config.getOpenAiEndpoint())
                .buildAsyncClient();


        ChatCompletionService chatCompletion = OpenAIChatCompletion.builder()
                .withOpenAIAsyncClient(clientasync)
                .withModelId(config.getChatDeploymentName())
                .build();

        Kernel kernel = null;

        // Initialize the kernel with the chat completion service and the plugins
        Kernel.Builder kernelBuilder = Kernel.builder()
                .withAIService(ChatCompletionService.class, chatCompletion);

        for (KernelPlugin plugin : plugins) {
            kernelBuilder.withPlugin(plugin);
        }
        return kernelBuilder.build();


    }

    public Kernel kernelBuilderWithoutPlugin() throws IOException {

        // Challenge 2 for Create the client
        OpenAIAsyncClient clientasync = new OpenAIClientBuilder()
                .credential(new AzureKeyCredential(config.getOpenAiApiKey()))
                .endpoint(config.getOpenAiEndpoint())
                .buildAsyncClient();

        // Challenge 2 Create the chat completion service
        ChatCompletionService chatCompletion = OpenAIChatCompletion.builder()
                .withOpenAIAsyncClient(clientasync)
                .withModelId(config.getChatDeploymentName())
                .build();

        Kernel kernel = null;

        kernel = Kernel.builder()
                .withAIService(ChatCompletionService.class, chatCompletion)
                .build();
        return kernel;

    }

    public OpenAIAsyncClient openAIAsyncClient() throws IOException {

        if (config.getOpenAiEndpoint() != null && !config.getOpenAiEndpoint().isEmpty()) {
            return new OpenAIClientBuilder()
                    .endpoint(config.getOpenAiEndpoint())
                    .credential(new AzureKeyCredential(config.getOpenAiApiKey()))
                    .buildAsyncClient();
        }
        return new OpenAIClientBuilder()
                .credential(new KeyCredential(config.getOpenAiApiKey()))
                .buildAsyncClient();
    }


}
