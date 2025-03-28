# **Exercise 6**: Responsible AI: Exploring Content Filters in Azure AI Foundry
### Estimated Duration: 25 minutes

This hands-on lab introduces content filtering in Azure AI Foundry to help you build safer, more responsible AI applications.
You'll learn to apply built-in filters, adjust settings, and create custom rules to block unwanted content—all within Azure AI Foundry Studio. Complete prerequisites before starting, as the lab runs in a cloud-based environment.

## Objectives
In this exercise, you will be performing the following tasks:


## Task 1: Adjust Filter Settings

1. Navigate to [Azure AI Foundry](https://ai.azure.com/) portal.
1. Click on **Safety + security (1)** under **Assess and improve** in the left pane.

    ![](./media/image_010.png)
1. Click on **Content filters (1)** and then followed by **+ Create content filter (2)**.

    ![](./media/image_011.png)
1. On the **Create filters to allow or block specific types of content** blade, specify the following configuration options and click on **Next (3)**:
   - **Name**:  **AggressiveContentFilter (1)**
   - **Connection**: select the available **Azure OpenAI (2)** resource

        ![](./media/image_012.png)
1. Leave the visible options to default and click on **Next** twice.
1. On the **Create filters to allow or block specific types of content**, **Deployment (Optional)** blade, select **all 3** of the deployments and click on **Next (1)**.

    ![](./media/image_013.png)
1. If you get **Replacing existing content filter warning**, click on **Replace (1)**.

    ![](./media/image_014.png)
1. Create on **Create filter (1)**.

    ![](./media/image_015.png)


## Task 2: Filter specific words or patterns

1. Navigate to [Azure AI Foundry](https://ai.azure.com/) portal.
1. Click on **Safety + security (1)** under **Assess and improve** in the left pane.

    ![](./media/image_010.png)
1. Click on **Blocklists (Preview) (1)** and then followed by **+ Create blocklist (2)**.

    ![](./media/image_016.png)
1. On the **Create a blocklist** blade, specify the following configuration options and click on **Create blocklist (4)**:
   - **Name**:  **CustomBlocklist<inject key="Deployment ID" enableCopy="false"></inject> (1)**
   - **Connection**: select the available **Azure OpenAI (2)** resource
   - **Description**: This is a custom blocklist. (3)

        ![](./media/image_017.png)
1. Click on the **CustomBlocklist<inject key="Deployment ID" enableCopy="false"></inject>** you created just now.
1. Enter words likethe following and select the type as required (**Exact Match** or **Regex**) :-
    - password
    - credentials
    - exploit
    - hack
    - keylogger
    - phishing
    - SSN
    - credit card
    - bank account
    - CVV
    - casino
    - poker
    - betting
1. Click on **Add term**.

## Summary