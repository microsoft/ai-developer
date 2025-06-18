### [< Previous Challenge](./Challenge-05.md) - **[Home](../README.md)** - [Next Challenge >](./Challenge-07.md)

# Challenge 06 - Responsible AI: Exploring Content Filters in Azure AI Foundry

## Introduction

In this challenge, you will learn how to enhance the safety and reliability of your AI-powered applications by leveraging content filters and protection mechanisms available in Azure AI Foundry. Azure AI provides powerful tools to help developers create ethical AI solutions by filtering out harmful or inappropriate content from model outputs. You will explore how to work with these filters in the Azure AI Foundry Studio, adjust settings, and even create custom filters to block specific words or phrases.

Content filters are essential in ensuring that your AI models meet your organization's ethical guidelines and regulatory requirements. By the end of this challenge, you will be able to configure filters that align with your application's needs and ensure safer interactions.

## Pre-requisites

1. [Access to Azure AI Foundry Studio](https://ai.azure.com) (See step 1 below).
2. An Azure AI Foundry resource created in an earlier challenge.

> NOTE: Make sure you have access to the Azure AI Foundry Studio and an existing Azure AI Foundry resource, as these are required to complete this challenge.

## Challenges

This challenge will guide you through configuring and testing content filters using Azure AI Foundry Studio.

### Navigate to Azure AI Foundry Studio

- **Azure Portal**
  - Navigate to your already-created AI Foundry resource in the Azure Portal.
  - At the bottom of the overview page, click the button for "Go to Azure AI Foundry Studio".

    <img src="./Resources/images/aoai-studio-button.png" alt="aoai-studio-button" width="30%"/>

- **Direct link:** https://ai.azure.com/


### Adjust Filter Settings

1. Navigate to the "**Safety + security**" tab at the lower left.
1. Click "**Create content filter**", then enter a name for your new filter.

    <img src="./Resources/images/filter-name.png" alt="aoai-filter-name" width="60%"/>

1. Experiment with the threshold sliders for filtering out offensive language or specific categories of content.

    <img src="./Resources/images/filter-sliders.png" alt="aoai-filter-sliders" width="60%"/>

    - The first screen of sliders controls the "**input filter**", meaning the content a user enters into the prompt.
    - The subsequent screen of sliders controls the "**output filter**", which is applied to content returned from the LLM.
1. On the final page, you will be presented with a list of existing model deployments that your content policy can be applied to. Select the row that matches the model in your program's app configuration, then click next. If prompted, click "Replace" to replace the existing default content filtering policy.

    <img src="./Resources/images/filter-deployment-list.png" alt="aoai-filter-deployment-list" width="60%"/>

1. **Test the changes** by running prompts through the model and observing the impact of the filters.

### Filter specific words or patterns

:bulb: **Blocklists** can be used to create a custom filter to block a specific word or phrase that you believe should be filtered in your application.

1. Return to the **Safety + security** tab, then on the resulting screen, click the Blocklists (Preview) tab.

    <img src="./Resources/images/filter-blocklists.png" alt="aoai-filter-deployment-list" width="60%"/>

1. Click **Create blocklist**, then enter a name & description *(optional)*.
1. After you are returned to the list, click the newly created blocklist to access the term list.

    <img src="./Resources/images/filter-blocklist-term.png" alt="aoai-filter-name" width="60%"/>

    - Proceed to add a term you would like to be excluded. You could use a random test word like "unicorn", or something more realistic—like "social security number."
    - It also supports using regex to generically filter input that matches a predefined pattern.

### Integrating Filters into Your Workflow

- Consider how these filters could be integrated into your broader AI application or workflow.
- Think about scenarios where custom filters might be essential for maintaining ethical standards. Keep these in mind when developing with AI solutions in the future.

:bulb: The Azure AI Service will throw an exception when your user's request is rejected due to content safety filters. You can catch and handle that exception and handle it to let the user know why they didn't get a response. :bulb:

```java
// In your AIService.java file, you can handle content filter exceptions like this:
try {
    List<ChatMessageContent<?>> responses = chatCompletionService.getChatMessageContentsAsync(
            chatHistory,
            kernel,
            invocationContext
    ).block();
    
    return responses;
} catch (Exception e) {
    // Check if the exception is related to content filtering
    if (e.getMessage().contains("content_filter") || 
        e.getMessage().contains("ResponsibleAIPolicyViolation")) {
        // Return a user-friendly message about content filtering
        System.out.println("Content filtered: " + e.getMessage());
        throw new RuntimeException("Your request was blocked by our content safety filters. Please rephrase your request.", e);
    } else {
        // Handle other exceptions normally
        System.out.println("AI response error: " + e.getMessage());
        throw new RuntimeException("Error processing AI response", e);
    }
}
```

## Success Criteria

1. You have successfully navigated the Azure AI Foundry Studio and adjusted the default content filter settings.
2. You experimented and observed the results of different filter settings.
3. You created and tested a custom blocklist to filter specific terms, phrases, or patterns.

## Learning Resources

- [How to configure content filters with Azure AI Foundry Service](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/content-filters) - Detailed steps for configuring filtering in AOAI
- [Use a blocklist in Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/use-blocklists) - Help with explicitly filtering additional predefined terms, are specific to one's use case
- [Data, privacy, and security for Azure AI Foundry Service#Preventing abuse & harmful content generation](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy?tabs=azure-portal#preventing-abuse-and-harmful-content-generation) - General outline of content safety & abuse monitoring functionality 
- [Azure AI Content Safety Java SDK](https://learn.microsoft.com/en-us/java/api/overview/azure/ai-contentsafety-readme) - Java SDK documentation for implementing content safety in your applications

## Bonus: Custom Content Filtering in Java

While Java Semantic Kernel doesn't have the same built-in filtering capabilities as the .NET version, you can implement custom content filtering in your Java application by creating filters that intercept requests and responses.

Here's an example of how you could implement a simple content filter in your Java application:

1. **Create a ContentFilter interface:**

    ```java
    public interface ContentFilter {
        boolean isContentAllowed(String content);
        String getFilteredMessage();
    }
    ```

2. **Implement a simple word-based filter:**

    ```java
    @Component
    public class SimpleContentFilter implements ContentFilter {
        private final List<String> blockedWords = Arrays.asList(
            "social security number", 
            "sensitive-term", 
            "blocked-word"
        );
        
        @Override
        public boolean isContentAllowed(String content) {
            String lowerContent = content.toLowerCase();
            return blockedWords.stream()
                .noneMatch(lowerContent::contains);
        }
        
        @Override
        public String getFilteredMessage() {
            return "Your request contains content that is not allowed. Please rephrase your request.";
        }
    }
    ```

3. **Integrate the filter into your AIService:**

    ```java
    @Autowired
    private ContentFilter contentFilter;
    
    public List<ChatMessageContent<?>> getAIResponse(ChatRequest chatRequest) throws IOException, ServiceNotFoundException {
        // Check user input before processing
        String userMessage = chatRequest.getMessages().get(chatRequest.getMessages().size() - 1).getContent();
        
        if (!contentFilter.isContentAllowed(userMessage)) {
            throw new RuntimeException(contentFilter.getFilteredMessage());
        }
        
        // Continue with normal processing...
        try {
            Kernel kernel = kernelBuilder();
            // ... rest of your existing code
        } catch (Exception e) {
            // ... existing exception handling
        }
    }
    ```

This approach allows you to implement custom filtering logic directly in your Java application, giving you fine-grained control over what content is allowed.

### [< Previous Challenge](./Challenge-05.md) - **[Home](../README.md)** - [Next Challenge >](./Challenge-07.md) 