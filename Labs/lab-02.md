# **Exercise 2**: Semantic Kernel Fundamentals

### Estimated Duration: 60 minutes

In this challenge, you will be provided with a starter application that will require you to complete the implementation of the chat feature using Semantic Kernel and the Azure AI Foundry GPT-4o model. The AI model will then respond with an answer or completion to the prompt. The application uses the Semantic Kernel framework to interact with the AI model. You will need to complete the implementation of the chat API to send the user's prompt to the AI model and return the response to the user.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Setup Azure AI Foundry

1. Open **Visual Stuido code** from the desktop shortcut in the labvm.
1. Click on **File** and select **Open Folder**.
1. Navigate to `C:\LabFiles` and select **ai-developer** folder and click on **Select Folder**.
1. If you recieve `Do you trust the authors of the files in folder` warning, select the checkbox and click on **Yes, I trust the authors**.

## Python

<details>
  <summary>Click to expand</summary>

  - Bullet point 1
  - Bullet point 2
  - Bullet point 3

</details>


1. Navigate to `Python>src` directory and open **.env** file.
1. Navigate to AI Foundry Portal and on Overview page select Azure OpenAI Sercie and copy the endpoint.
1. Paste it besides `AZURE_OPENAI_ENDPOINT`.
    >Note:- Ensure that every value in the **.env** file is enclosed in **double quotes (")**.
1. Copy the API key from AI Foundry Portal and paste it besides `AZURE_OPENAI_API_KEY`.
