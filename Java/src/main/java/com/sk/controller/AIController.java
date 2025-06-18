package com.sk.controller;

import com.microsoft.semantickernel.services.ServiceNotFoundException;
import com.microsoft.semantickernel.services.chatcompletion.ChatMessageContent;
import com.sk.model.ChatRequest;
import com.sk.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
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
