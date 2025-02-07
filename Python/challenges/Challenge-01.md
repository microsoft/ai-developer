### [< Previous Challenge](./Challenge-00.md) - **[Home](../README.md)** - [Next Challenge >](./Challenge-02.md)

# Challenge 01 - Azure AI Foundry Fundamentals

## Introduction

The first step in understanding Azure AI Foundry is to get familiar with the basics. In this challenge, you will learn about the core concepts of Azure AI Foundry and how it can be used to build powerful AI infused applications. You will deploy a GPT-3.5 model and use the Azure AI Foundry Studio to interact with the model.

## Setup Azure AI Foundry

1. Navigate to  [Azure AI Foundry](https://ai.azure.com) and login with your Azure credentials
2. Deploy a ***Standard GPT3.5 Turbo*** model (version **0613** or greater) in a region that can host GTP-3.5, GPT-4o and DALL-E models

## Challenges

![chat playground](./Resources/image/ch01img1.png)

* Using the Azure AI Foundry Studio, write a user query (a prompt) to return a United States Postal Service formatted address from the following email

    ```text
        Subject: Elevate Your Brand with Our Comprehensive Marketing Solutions! 
        From: BrightEdge Marketing
        To: John Doe

        Dear John,
        At BrightEdge Marketing, we believe in the power of innovative marketing strategies to elevate brands and drive business success. Our team of experts is dedicated to helping you achieve your marketing goals through a comprehensive suite of services tailored to your unique needs.

        Please send letters to 123 Marketing Lane, Suite 400 in area 90210 located in Innovation City California.

        Thank you for considering BrightEdge Marketing.
        Best regards,
        Sarah Thompson 
        Marketing Director BrightEdge Marketing

    ```

* Click `Clear Chat` and using the same email from the previous challenge, craft a prompt to rewrite the email and replace any PII with the string `[REDACTED: category]` where category is the PII category found in the email.

* Click `Clear Chat`and enter the following prompt into the Azure AI Foundry and observe the results

    :exclamation:Before updating the prompt, clear the current chat history so the AI doesn't consider it's previous answers when responding to the new prompt.

    ```text
    A coin is heads up. Maybelle flips the coin over. Shalonda flips the coin over. Is the coin still heads up? 
    ```

    The answer, of course, should be ```Yes, the coin is heads up``` but the AI is likely to answer ```No``` because it does not always follow state changes correctly.  Rewrite the prompt convincing the AI to keep track of state changes to successfully answer the question with a ```Yes```.

## Success Criteria

1. Verify that you deployed a Standard GPT-3.5 model using  Azure AI Foundry.
1. Verify that you can access the Azure AI Foundry Studio and create a new chat.
1. Verify that you can craft a prompt to return a United States Postal Service formatted address from the provided email
1. Verify that you can craft a prompt to rewrite the email and replace any PII with the string `[REDACTED: category]`
1. Verify that you can craft a prompt to compel the AI to keep track of state changes

## Learning Resources

[QuickStart: Get started using GPT-35-Turbo with Azure AI Foundry Service](https://learn.microsoft.com/en-us/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython-new&pivots=programming-language-studio)

[Azure AI Foundry Models](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models)

[Intro to Prompt Engineering](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/prompt-engineering)

[Prompt engineering techniques](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/advanced-prompt-engineering?pivots=programming-language-chat-completions#prime-the-output)

[Chain of Thought Prompting](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/advanced-prompt-engineering?pivots=programming-language-chat-completions#chain-of-thought-prompting)

### [< Previous Challenge](./Challenge-00.md) - **[Home](../README.md)** - [Next Challenge >](./Challenge-02.md)
