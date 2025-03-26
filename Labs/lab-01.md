# **Exercise 1**: Azure AI Foundry Fundamentals

### Estimated Duration: 60 minutes

This hands-on lab provides experience with Azure AI Foundry and its core capabilities, including AI model deployment and integration with Azure AI Search. Designed for those new to the platform, the lab guides you step-by-step to set up an AI project, deploy a GPT-4o model, and configure essential AI services.

You will explore Azure AI Foundry to create and manage AI projects, use Models + Endpoints to deploy base models, and leverage Azure AI Search for scalable, efficient data retrieval. Ensure all prerequisites are met before starting, as the cloud-based Azure AI Foundry platform allows you to complete the lab remotely.

## Objectives

In this exercise, you will be performing the following tasks:

## Task 1: Setup Azure AI Foundry

1. Navigate to [Azure AI Foundry](https://ai.azure.com/) portal and login using the below Azure credentials:

   - Username : <inject key="AzureAdUserEmail"></inject>
   - Password : <inject key="AzureAdUserPassword"></inject>

1. Click on **Create Project (1)**.

    ![](./media/image_001.png)
1. Provide **ai-foundry-project-<inject key="Deployment ID" enableCopy="false"></inject> (1)** as Project name and click on **Customize (2)**.

    ![](./media/image_002.png)
1. On the **Create a Project** blade, specify the following configuration options and click on **Next (4)**:
   - **Resource group**: **ai-foundry-<inject key="Deployment ID" enableCopy="false"></inject>** (1)
   - **Location**: **East US** (2)
   - **Connect Azure AI Search**: click on **Create new AI Search (3)** and enter **ai-search-<inject key="Deployment ID" enableCopy="false"></inject> (1)** and click on **Next (2)**

    ![](./media/image_003.png)

    ![](./media/image_004.png)
1. Click on **Create (1)**.

    ![](./media/image_005.png)
1. Click on **Models + endpoints (1)** under **My assets** in the left pane.

    ![](./media/image_006.png)
1. Click on **+ Deploy model**, and then select **Deploy Base model (1)**.

    ![](./media/image_007.png)
1. Search for **gpt-4o (1)**, select the model (2) and click on **Confirm (3)**.

    ![](./media/image_008.png)
1. Change the **Deployment type** to **Standard (1)**.
1. On the **Deploy model gpt-4o** blade, specify the following configuration options and click on **Deploy (4)**:
   - **Model version**: 2024-05-13 (Default) (2)
   - **Tokens per Minute Rate Limit**: **50K** (3)

        ![](./media/image_009.png)
1. Once the model is deployed, click on **Open in playground**.
1. You can try the capabilities of Azure OpenAI using the prompt `Extract the United States Postal Service (USPS) formatted address from the following email` to extract the Postal service address from the following email:-
    ```
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