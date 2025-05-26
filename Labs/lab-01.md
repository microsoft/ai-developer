# **Exercise 1**: Azure AI Foundry Fundamentals

### Estimated Duration: 20 minutes

This hands-on lab provides experience with Azure AI Foundry and its core capabilities, including AI model deployment and integration with Azure AI Search. Designed for those new to the platform, the lab guides you step-by-step to set up an AI project, deploy a GPT-4o model, and configure essential AI services.

You will explore Azure AI Foundry to create and manage AI projects, use Models + Endpoints to deploy base models, and leverage Azure AI Search for scalable, efficient data retrieval. Ensure all prerequisites are met before starting, as the cloud-based Azure AI Foundry platform allows you to complete the lab remotely.

## Objectives

In this exercise, you will be performing the following tasks:
- Task 1: Set up Azure AI Foundry

## Task 1: Set up Azure AI Foundry

In this task, you will explore different flow types in Azure AI Foundry by creating a project, deploying the GPT-4o model, and testing its capabilities in the playground.

1. Navigate to the Azure AI Foundry (https://ai.azure.com/) portal and log in using the below Azure credentials:

   - Username : <inject key="AzureAdUserEmail"></inject>
   - Password : <inject key="AzureAdUserPassword"></inject>

1. Click on **Create Project (1)**.

    ![](./media/image_001.png)
1. Provide **ai-foundry-project-<inject key="Deployment ID" enableCopy="false"></inject> (1)** as the Project name and click on **Customize (2)**.

    ![](./media/image_002.png)
1. On the **Create a Project** blade, specify the following configuration options and click on **Next (4)**:
   - **Resource group**: **ai-foundry-<inject key="Deployment ID" enableCopy="false"></inject>** (1)
   - **Location**: **<inject key="Region" enableCopy="false"></inject>** (2)
   - **Connect Azure AI Search**: click on **Create new AI Search (3)** and enter **ai-search-<inject key="Deployment ID" enableCopy="false"></inject> (1)** and click on **Next (2)**

        ![](./media/image_003.png)

        ![](./media/image_004.png)
1. Click on **Create (1)**.

    ![](./media/image_005.png)
1. Click on **Models + endpoints (1)** under **My assets** in the left pane, then click on **+ Deploy model**, followed by **Deploy Base model (2)**.

    ![](./media/image_007-1.png)
1. Search for **GPT-4o (1)**, select the model (2), and click on **Confirm (3)**.

    ![](./media/image_008.png)
1. On the **Deploy model GPT-4o** blade, specify the following configuration options and click on **Deploy (4)**:
   - **Deployment type**: **Standard** (1)
   - **Model version**: 2024-05-13 (Default) (2)
   - **Tokens per Minute Rate Limit**: **50K** (3)

        ![](./media/image_009.png)
1. Once the model is deployed, click **Open in Playground (1)**.

    ![](./media/image_020.png)
1. You can explore the capabilities of Azure OpenAI by using the prompt: `Extract the United States Postal Service (USPS) formatted address from the following email` to identify and extract the postal address from the following email:
    ```
    Subject: Elevate Your Brand with Our Comprehensive Marketing Solutions!
    From: BrightEdge Marketing
    To: John Doe

    Dear John,
    At BrightEdge Marketing, we believe in the power of innovative marketing strategies to elevate brands and drive business success. Our team of experts is dedicated to helping you achieve your marketing goals through a comprehensive suite of services tailored to your unique needs.

    Please send letters to 123 Marketing Lane, Suite 400, in area 90210, Innovation City, California.

    Thank you for considering BrightEdge Marketing.
    Best regards,
    Sarah Thompson
    Marketing Director BrightEdge Marketing
    ```

    ![](./media/image_018.png)
1. You will receive a response similar to the one shown below:

    ![](./media/image_019.png)

> **Congratulations** on completing the task! Now, it's time to validate it. Here are the steps:
 
- Hit the Validate button for the corresponding task. If you receive a success message, you can proceed to the next task. 
- If not, carefully read the error message and retry the step, following the instructions in the lab guide.
- If you need any assistance, please contact us at cloudlabs-support@spektrasystems.com. We are available 24/7 to help you out.

   <validation step="a3e77878-3ce2-4d69-b4e6-c88d4a0f45ec" />   

## Review

In this exercise, we utilized **Azure AI Foundry** to build and deploy AI solutions by accessing the Azure portal and interacting with GPT-4o models. We created an AI project, deployed a base model, and integrated Azure AI Search for enhanced data retrieval. Finally, we tested the model in the playground using a prompt to extract structured data from text. This enhanced our proficiency in deploying and interacting with AI models on the Azure platform.

You have successfully completed the below tasks for AI development using **Azure AI Foundry**:  

- Created an **AI project** and deployed a **GPT-4o** base model using **Models + Endpoints**.    
- Utilized **Semantic Kernel** to connect AI models with external APIs and plugins.

## Go to the next lab by clicking on the navigation.
