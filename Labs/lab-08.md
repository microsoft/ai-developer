# **Exercise 8**: Multi-Agent Systems

### Estimated Duration: 30 minutes

This hands-on lab introduces image generation to your reference application using DALL·E, a powerful AI model that creates visuals from text-based descriptions. Designed for those new to generative AI, the lab walks you through integrating DALL·E to bring ideas to life—whether you're visualizing real-world objects, dynamic scenes, or entirely abstract concepts. By the end of this lab, you’ll understand how to harness DALL·E’s creative capabilities to enhance user experiences through AI-generated imagery. Complete all prerequisites before starting, as the cloud-based environment allows you to complete the lab remotely.

## Objectives
In this exercise, you will be performing the following tasks:
- Task 1: Create Multi-agent chat system

## Task 1: Create Multi-agent chat system

<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src` directory and open **multi_agent.py** file.
1. Remove the existing code and add the code from the following URL in the file.
    ```
    https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/python/lab-08.py
    ```
1. Save the file.
1. Right click on `Python>src` in the left pane and select **Open in Integrated Terminal**.

    ![](./media/image_035.png)
1. Use the following command to run the app:
    ```
    streamlit run app.py
    ```
1. If the app does not open automatically in the browser, you can access it using the following **URL**:
    ```
    http://localhost:8501
    ```
1. Select **Multi-Agent** on the left hand side pane.

    ![](./media/image_123.png)
1. Submit the following prompt and see how the AI responds:
    ```
    Build a Calculator app.
    ```
1. You will receive a response similar to the one shown below:

    ![](./media/image_124.png)
</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Navigate to `Dotnet>src>BlazorAI>Components>Pages` directory and open **MultiAgent.razor.cs** file.

    ![](./media/image_125.png)
1. Remove the existing code and add the code from the following URL in the file.
    ```
    https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/c%23/lab-08.cs
    ```
1. Save the file.
1. Right click on `Dotnet>src>Aspire>Aspire.AppHost` in the left pane and select **Open in Integrated Terminal**.

    ![](./media/image_040.png)
1. Use the following command to run the app:
    ```
    dotnet run
    ```
1. Open a new tab in browser and navigate to the link for **blazor-aichat** i.e **https://localhost:7118/**.

    >**Note**: If you receive security warnings in the browser, close the browser and follow the link again.
1. Select **Multi-Agent** on the left hand side pane.

    ![](./media/image_126.png)
1. Submit the following prompt and see how the AI responds:
    ```
    Build a Calculator app.
    ```
1. You will receive a response similar to the one shown below:

    ![](./media/image_127.png)
</details>

## Summary

In this exercise, we integrated **DALL·E** into a reference application to enable **text-to-image generation** using descriptive prompts. We explored how to visualize real-world objects, dynamic scenes, and abstract concepts through AI-generated imagery. This enhanced our proficiency in leveraging generative AI to create engaging and visually rich user experiences.