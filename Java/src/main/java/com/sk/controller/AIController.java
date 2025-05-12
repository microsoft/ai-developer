package com.sk.controller;

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
import com.sk.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AIController {

    @Autowired
    AIService aiService;

    @GetMapping("/hello")
    public String getAI() {
        return "AI";
    }



    @PostMapping("/skChat")
    public ResponseEntity<List<ChatMessageContent<?>>> getskChat(@RequestBody ChatRequest chatRequest) throws IOException, ServiceNotFoundException {
        return ResponseEntity.ok(aiService.getAIResponse(chatRequest));
    }

}
