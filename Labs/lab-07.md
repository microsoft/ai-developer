# **Exercise 7**: Image Generation using DALL-E

### Estimated Duration: 60 minutes

Now it's time to introduce Image generation to the reference application using DALL-E. DALL-E is an artificial intelligence (AI) model that generates images from textual descriptions. DALL-E can create images of objects, scenes, and even abstract concepts based on the descriptive text provided to it. This capability allows for a wide range of creative possibilities, from illustrating ideas to creating entirely new visual concepts that might not exist in the real world.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Deploy a DALL-E model
1. Navigate to [Azure AI Foundry](https://ai.azure.com/) portal.
1.  Click on **Models + endpoints** under **My assets** in the left pane.
1.  Click on **+ Deploy model**, and then select **Deploy Base model**.
1. Search for **dall-e-3**, select the model and click on **Confirm**.
1. Click on **Deploy**.

<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src` directory and open **.env** file.
1. Navigate to AI Foundry Portal and on **dall-e-3** page, copy the **Target URI**.
1. Paste it besides `AZURE_TEXT_TO_IMAGE_ENDPOINT`.
    >Note:- Ensure that every value in the **.env** file is enclosed in **double quotes (")**.
1. Copy the API key from AI Foundry Portal and paste it besides `AZURE_TEXT_TO_IMAGE_API_KEY`.
1. Save the file.
</details>

