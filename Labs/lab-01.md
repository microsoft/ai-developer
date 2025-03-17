# **Exercise 1**: Azure AI Foundry Fundamentals

### Estimated Duration: 60 minutes

The first step in understanding Azure AI Foundry is to get familiar with the basics. In this challenge, you will learn about the core concepts of Azure AI Foundry and how it can be used to build powerful AI infused applications. You will deploy a GPT-3.5 model and use the Azure AI Foundry Studio to interact with the model.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Setup Azure AI Foundry

1. Navigate to [Azure AI Foundry](https://ai.azure.com/) portal and login using the below Azure credentials:

    - Username : <inject key="AzureAdUserEmail"></inject>
    - Password : <inject key="AzureAdUserPassword"></inject>
1. Click on **Create Project**.
1. Provide **ai-foundry-project-<inject key="Deployment ID" enableCopy="false"></inject>** as Project name and click on **Customize**.
1. On the **Create a Project** blade, specify the following configuration options and click on **Next**:
    - **Resource group**: ai-foundry-<inject key="Deployment ID" enableCopy="false"></inject>
    - **Location**: East Us
    - **Connect Azure AI Search**: click on **Create new AI Search** and enter **ai-search-<inject key="Deployment ID" enableCopy="false"></inject>** and click on **Next**
1.  Click on **Create**.
1.  Click on **Models + endpoints** under **My assets** in the left pane.
1.  Click on **+ Deploy model**, and then select **Deploy Base model**.
1. Search for **gpt-4o**, select the model and click on **Confirm**.
1. Change the **Deployment type** to **Standard**.
1. On the **Deploy model gpt-40** blade, specify the following configuration options and click on **Deploy**:
    - **Model version**: 2024-05-13 (Default)
    - **Tokens per Minute Rate Limit**: **50K**
1. Once the model is deployed, click on **Open in playground**.

Extract the United States Postal Service (USPS) formatted address from the following email.


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