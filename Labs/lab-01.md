# Exercise 1: Azure AI Foundry Fundamentals

### Estimated Duration: 60 minutes

## Task 1: Setup Azure AI Foundry

1. Navigate to [Azure AI Foundry](https://ai.azure.com/) and login using the below Azure credentials:

    - Username : <inject key="AzureAdUserEmail"></inject>
    - Password : <inject key="AzureAdUserPassword"></inject>
1. Click on **Create Project**.
1. Provide **ai-foundry-project-<inject key="Deployment ID" enableCopy="false"></inject>** as Project name and click on **Customize**.
1. Select **ai-foundry-<inject key="Deployment ID" enableCopy="false"></inject>** for the Resource grtoup and click on **Next**, and then **Create**.
1.  Click on **Models + endpoints** under **My assets** in the left pane.
1.  Click on **+ Deploy model**, and then select **Deploy Base model**.
1. Search for **gpt-35-turbo**, select the model and click on **Confirm**.
1. Select **Customize** and change the **Model version** to **0613**.
1. Click on Deploy.