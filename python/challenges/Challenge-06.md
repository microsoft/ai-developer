### [< Previous Challenge](./Challenge-05.md) - **[Home](./README.md)** - [Next Challenge >](./Challenge-07.md)

# Challenge 06 - Responsible AI: Exploring Content Filters in Azure OpenAI

## Introduction

In this challenge, you will learn how to enhance the safety and reliability of your AI-powered applications by leveraging content filters and protection mechanisms available in Azure OpenAI. Azure AI provides powerful tools to help developers create ethical AI solutions by filtering out harmful or inappropriate content from model outputs. You will explore how to work with these filters in the Azure OpenAI Studio, adjust settings, and even create custom filters to block specific words or phrases.

Content filters are essential in ensuring that your AI models meet your organization's ethical guidelines and regulatory requirements. By the end of this challenge, you will be able to configure filters that align with your application's needs and ensure safer interactions.

## Pre-requisites

1. [Access to Azure AI Foundry](https://ai.azure.com) (See step 1 below).
2. An Azure OpenAI resource created in an earlier challenge.

> NOTE: Make sure you have access to the Azure AI Foundry and an existing Azure OpenAI resource, as these are required to complete this challenge.

## Challenges

This challenge will guide you through configuring and testing content filters using Azure AI Foundry.

### Navigate to Azure AI Foundry

- **Azure Portal**
  - Navigate to your already-created Open AI resource in the Azure Portal.
  
- **Direct link:** https://ai.azure.com/


### Adjust Filter Settings

1. Navigate to the "**Safety + Security**" tab at the lower left.
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

1. Return to the **Content filters** tab, then on the resulting screen, click the Blocklists (Preview) tab.

    <img src="./Resources/images/filter-blocklists.png" alt="aoai-filter-deployment-list" width="60%"/>

1. Click **Create blocklist**, then enter a name & description *(optional)*.
1. After you are returned to the list, click the newly created blocklist to access the term list.

    <img src="./Resources/images/filter-blocklist-term.png" alt="aoai-filter-name" width="60%"/>

    - Proceed to add a term you would like to be excluded. You could use a random test word like "unicorn", or something more realistic—like "social security number."
    - It also supports using regex to generically filter input that matches a predefined pattern.

### Integrating Filters into Your Workflow

- Consider how these filters could be integrated into your broader AI application or workflow.
- Think about scenarios where custom filters might be essential for maintaining ethical standards. Keep these in mind when developing with AI solutions in the future.

:bulb: The OpenAI Service will thrown an exception sometimes when your user's request is rejected due to content safety filters. You can trap and handle that exception and handle it to let the user know why they didn't get a response. :bulb:


## Success Criteria

1. You have successfully navigated the Azure AI Foundry and adjusted the default content filter settings.
2. You experimented and observed the results of different filter settings.
3. You created and tested a custom blocklist to filter specific terms, phrases, or patterns.

## Learning Resources

- [How to configure content filters with Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/content-filters) - Detailed steps for configuring filtering in AOAI
- [Use a blocklist in Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/use-blocklists) - Help with explicitly filterering additional predefined terms, are specific to one's use case
- [Data, privacy, and security for Azure OpenAI Service#Preventing abuse & harmful content generation](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy?tabs=azure-portal#preventing-abuse-and-harmful-content-generation) - General outline of content safety & abuse monitoring functionality 
- [Using Filters in Semantic Kernel](https://devblogs.microsoft.com/semantic-kernel/filters-in-semantic-kernel) - Semantic Kernel itself has filtering capability. While it isn't explicitly covered in this workshop, you can find a summary and example below.

## Bonus: Semantic Kernel Filters (in code)

Semantic Kernel itself supports custom filters for requests in the pipeline by adding filters to kernel. Currently it is not supported for the method that is used for chat completion, but is supported by Semantic Kernel's *Invoke* methods, like `Kernal.Invoke()`.

By using these, one can intercept a prompt before and/or after it is rendered. 

With that said, here's a brief example of a simple prompt filter created in code. 

1. Create a implementation of Prompt rendering filter

    ```python
    @kernel.filter(FilterTypes.PROMPT_RENDERING)
    async def prompt_rendering_filter(context: PromptRenderContext, next):
        await next(context)
        input_text = context.arguments.get("user_input")
        if input_text and contains_email(input_text):
            context.rendered_prompt = replace_email(context.rendered_prompt or '')
            logger.info(context.rendered_prompt)

    ```

1. Register it when building the kernel.

    ```python
    // Configure Semantic Kernel
    kernel = Kernel()
    
    // Inject filter
    kernel.add_filter("prompt_rendering", prompt_rendering_filter)
    ```

1. Whenever a prompt is invoked via a supported Invoke method, the filter code will be ran before the prompt is processed. When the condition matches, we override the value Context.result, resulting in the new sensitive content message being returned to the user.

### [< Previous Challenge](./Challenge-05.md) - **[Home](./README.md)** - [Next Challenge >](./Challenge-07.md)
