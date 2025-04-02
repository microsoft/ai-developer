# Azure AI Foundry and Semantic Kernel Fundamentals

### Overall Estimated Duration: 4 Hours

## Overview

In this hands-on lab series, participants will explore the core capabilities of **Azure AI Foundry** and the **Semantic Kernel** framework to build intelligent, extensible AI applications. Designed for beginners in AI development, the labs guide participants through setting up AI projects in Azure AI Foundry, deploying the **GPT-4o** model, and connecting it seamlessly with Semantic Kernel to enable dynamic, prompt-based interactions. Participants will learn how to integrate **plugins**—such as time and weather utilities—to extend chatbot functionality, implement **Retrieval-Augmented Generation (RAG)** for more informed responses, and leverage **OpenAPI** to connect external services with minimal code. The labs also highlight responsible AI practices with **content filtering tools** in Foundry Studio and creative AI integration through **DALL·E** for image generation. Delivered in a secure, cloud-based environment, this series provides foundational, hands-on experience with Semantic Kernel and Azure AI Foundry to help participants build scalable, AI-powered applications.

## Objective

**Explore how Azure AI Foundry and Semantic Kernel empower you to build intelligent, extensible, and responsible AI applications.** Gain hands-on experience deploying GPT-4o models, integrating external services and APIs, developing custom plugins, and implementing advanced AI design patterns such as Retrieval-Augmented Generation (RAG) and multi-agent collaboration. By the end of this lab series, you will be able to:

- **Azure AI Foundry Fundamentals**: Learn how to create, manage, and deploy AI projects using Azure AI Foundry and GPT-4o.
- **Semantic Kernel Fundamentals**: Build an intelligent chat experience by connecting Semantic Kernel with GPT-4o through a simple starter app.
- **Semantic Kernel Plugins**: Extend your chatbot’s capabilities by building and integrating custom Semantic Kernel plugins.
- **Import Plugin using OpenAPI**: Seamlessly integrate external APIs into Semantic Kernel using OpenAPI specifications.
- **Retrieval-Augmented Generation (RAG)**: Enhance AI responses by combining external knowledge retrieval with generative models using the RAG pattern.
- **Responsible AI: Exploring Content Filters in Azure AI Foundry**: Apply content filtering tools to build safer, more responsible AI applications within Azure AI Foundry.
- **Image Generation using DALL·E**: Generate creative visuals from text prompts by integrating DALL·E into your reference application.
- **Multi-Agent Systems**: Coordinate multiple AI agents within Semantic Kernel to solve complex tasks through collaboration.

## Pre-requisites

- Basic knowledge of Azure
- Familiarity with AI concepts, such as language models and embeddings
- Basic understanding of REST APIs and JSON data formats
- Familiarity with Semantic Kernel concepts such as plugins, planners, and AI skills
- Basic experience using for resource management
- (Optional) Familiarity with OpenAPI specifications for plugin integration
- (Optional) Understanding of Retrieval-Augmented Generation (RAG) patterns for AI applications

## Architecture
- **Azure Portal**: The Azure Portal is a unified web-based console that allows users to manage AI resources efficiently. It provides access to **Azure AI Foundry, Semantic Kernel services, AI models, and APIs**, enabling developers to build and monitor AI-driven applications with ease.  
- **Azure AI Foundry**: Azure AI Foundry is a cloud-based AI development environment for **building, training, and deploying AI models**. It offers tools for **AI project management, model deployment (such as GPT-4o), and integrations with Semantic Kernel and external services**.  
- **Semantic Kernel**: Semantic Kernel is a lightweight AI orchestration framework that connects **LLMs, external plugins, and APIs** to create dynamic, extensible AI applications. It enables developers to **implement chatbots, integrate external data sources, and enhance AI capabilities with minimal coding**.  
- **Models + Endpoints**: The **Models + Endpoints** service in Azure AI Foundry allows developers to deploy and manage large language models like **GPT-4o**. This service facilitates **real-time AI interactions, text generation, and chatbot functionalities** while ensuring scalability and security.  
- **Retrieval-Augmented Generation (RAG)**: RAG enhances AI-generated responses by retrieving relevant external knowledge before generating outputs. It integrates **Azure AI Search** to fetch contextually accurate information, ensuring AI-generated answers are well-informed and reliable.  
- **Plugins**: Plugins extend the AI’s functionality by enabling **real-time data retrieval and automation**. The lab includes:  
   - **Time & Weather Plugins**: Fetch live data for user queries.  
   - **OpenAPI Plugin**: Enables seamless API integration with external services.  
- **Content Filtering**: Content Filtering in Azure AI Foundry ensures **responsible AI usage** by applying **built-in filters, adjustable settings, and custom rules** to prevent harmful or inappropriate content from being generated.  
- **DALL·E Image Generation**: DALL·E is an AI model integrated into Azure AI Foundry that **generates images from text-based descriptions**. It enables developers to create **visual content for applications, chatbots, and creative projects** with ease.  

## Architecture Diagram

![](./media/arch_diag.png)

## Explanation of Components

- **Understanding the Lifecycle of AI Application Development**: Explore how various components within **Azure AI Foundry** and **Semantic Kernel** interact to build scalable AI-powered applications.

- **AI Model Deployment with Azure AI Foundry**: Deploying models such as **GPT-4o** involves setting up endpoints, managing model versions, and ensuring scalable performance. This step allows seamless integration of **LLMs into applications** for real-time AI interactions.

- **Enhancing AI Capabilities with Semantic Kernel**: Semantic Kernel facilitates **AI orchestration** by connecting LLMs, plugins, and external APIs. It allows developers to build intelligent applications with **dynamic prompts, real-time data retrieval, and API integration**. 

- **Extending Functionality with Plugins**: Integrating plugins enhances AI’s ability to interact with external systems, improving user experience.
   - **Time & Weather Plugins**: Retrieve real-time contextual information for chatbot interactions. 
   - **OpenAPI Integration**: Seamlessly connects external APIs to automate AI-driven workflows. 

- **Optimizing AI Responses with Retrieval-Augmented Generation (RAG)**:**RAG improves AI accuracy** by retrieving relevant external knowledge before generating responses. 
   - **Azure AI Search** fetches relevant documents to support user queries.  
   - The **GPT-4o model** processes this data for more **contextually aware and informed responses**.

- **Implementing Content Safety for Responsible AI**: Ensuring responsible AI practices requires **content filtering tools** to prevent harmful or inappropriate responses. Azure AI Foundry provides:  
   - **Pre-configured safety filters** to block sensitive content.  
   - **Customizable content moderation settings** for ethical and secure AI interactions. 

- **Integrating AI-Powered Creativity with DALL·E**: DALL·E enables AI-powered image generation from **text-based descriptions**, supporting:  
   - **Creative AI applications** for generating visuals in response to user prompts.  
   - **Enhanced user experiences** by adding **AI-generated imagery** to applications and workflows.

## Getting Started with the Lab
 
## Accessing Your Lab Environment
 
Once you're ready to dive in, your virtual machine and lab guide will be right at your fingertips within your web browser.

   ![](./media/labguide-1.png)

## Virtual Machine & Lab Guide
 
Your virtual machine is your workhorse throughout the workshop. The lab guide is your roadmap to success.
 
## Exploring Your Lab Resources
 
To get a better understanding of your lab resources and credentials, navigate to the **Environment** tab.
 
   ![Explore Lab Resources](./media/env-1.png)
 
## Utilizing the Split Window Feature
 
For convenience, you can open the lab guide in a separate window by selecting the **Split Window** button from the Top right corner.
 
 ![Use the Split Window Feature](./media/spl.png)
 
## Managing Your Virtual Machine
 
Feel free to start, stop, or restart your virtual machine as needed from the **Resources** tab. Your experience is in your hands!
 
![Manage Your Virtual Machine](./media/res.png)

## Lab Validation

1. After completing the task, hit the **Validate** button under Validation tab integrated within your lab guide. If you receive a success message, you can proceed to the next task, if not, carefully read the error message and retry the step, following the instructions in the lab guide.

   ![Inline Validation](./media/inline-validation.png)

1. If you need any assistance, please contact us at **cloudlabs-support@spektrasystems.com**.

## Let's Get Started with Azure Portal

1. On your virtual machine, click on the Azure Portal icon as shown below:

   ![Launch Azure Portal](./media/lc-image(1).png)
   
1. You'll see the **Sign into Microsoft Azure** tab. Here, enter your credentials:
 
   - **Email/Username:** <inject key="AzureAdUserEmail"></inject>
 
       ![Enter Your Username](./media/lc-image-1.png)
 
1. Next, provide your password:
 
   - **Password:** <inject key="AzureAdUserPassword"></inject>
 
       ![Enter Your Password](./media/lc-image-2.png)

1. If **Action required** pop-up window appears, click on **Next**.

   ![Ask Later](./media/ask-later.png)
1. On **Start by getting the app** page, click on **Next**.
1. Click on **Next** twice.
1. In **android**, go to the play store and Search for **Microsoft Authenticator** and Tap on **Install**.

   ![Install](./media/mobile.jpg)

   >Note:For **iOS**, Open app store and repeat the steps.

   >Note: Skip If already installed.
   
1. Open the app and click on **Scan a QR code**.
1. Scan the QR code visible on the screen and click on **Next**.

   ![QR code](./media/demo001.png)
1. Enter the digit displayed on the Screen in the Authenticator app on mobile and tap on **Yes**.
1. Once the notification is approved, click on **Next**.

   ![Approved](./media/demo002.png)
1. Click on **Done**.
1. If prompted to stay signed in, you can click **"Yes"**.

1. Tap on **Finish** in the Mobile Device.

   >NOTE: While logging in again , enter the digits displayed on the screen in the **Authenticator app** and click on Yes.

1. If a **Welcome to Microsoft Azure** pop-up window appears, simply click **"Cancel"** to skip the tour.

1. You can use the **Previous(1)** and **Next(2)** buttons to navigate through the lab guide.

   ![](./media/lc-image(3).png)

This hands-on lab will help you explore how Microsoft Copilot for Infrastructure Management enhances responsible resource management. You'll gain insights into leveraging Copilot’s features to optimize your infrastructure while adhering to best practices and compliance standards.

## Support Contact

The CloudLabs support team is available 24/7, 365 days a year, via email and live chat to ensure seamless assistance at any time. We offer dedicated support channels tailored specifically for both learners and instructors, ensuring that all your needs are promptly and efficiently addressed.

Learner Support Contacts:

- Email Support: cloudlabs-support@spektrasystems.com
- Live Chat Support: https://cloudlabs.ai/labs-support

Now, click on **Next** from the lower right corner to move on to the next page.

![Launch Azure Portal](./media/lc-image(3).png)

## Happy Learning!!