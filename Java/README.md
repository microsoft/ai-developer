# AI Developer - Azure AI Foundry and Semantic Kernel Fundamentals

[![Sync Student Directory to Student Repository](https://github.com/microsoft/AIDeveloper-Private/actions/workflows/pushToStudentRepository.yml/badge.svg)](https://github.com/microsoft/AIDeveloper-Private/actions/workflows/pushToStudentRepository.yml)

## Overview

This repository serves as the main content hub for the **Azure AI Foundry and Semantic Kernel Fundamentals** It is structured to facilitate the development and distribution of workshop materials, including challenges, solutions, and resources for both students and coaches.

## Repository Structure

- **Student**: Contains the challenges and resources that students will use during the workshop. This folder is copied to a separate student repository via a GitHub Action when changes are committed. Navigate to student [README.md](./Student/README.md) file.
- **Coach**: Contains the solutions and additional guidance for coaches. This section provides the master key/solution for each challenge, helping coaches guide students through the workshop. Navigate to coach [README.md](./Coach/README.md) file.
- **Resources**: Includes shared resources such as images, data files, and other assets used in the challenges.

## Child Repositories

- **[Student Repository](https://github.com/microsoft/ai-developer)**: Contains the student content for the workshop. This repository is automatically updated with the latest content from the `Student` directory in this repository.
- **[Demo Repository](https://github.com/microsoft/ai-developer-demo)**: Contains the demo content and final code for the workshop. This repository is automatically updated with the latest content from the `Demo` directory in this repository.

## PowerPoints

- [**Instructor PowerPoint**](https://mngenvmcap601716.sharepoint.com/sites/AIDeveloper/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FAIDeveloper%2FShared%20Documents%2FPowerPoint&p=true): Contains the PowerPoint slides used during the workshop.

## GitHub Action

A GitHub Action is configured to automatically sync the `Student` directory to a separate [AI_Developer_Student](https://github.com/microsoft/ai-developer) repository. This eliminates the need to manually update the student repository and ensures students always have access to the latest materials.

## Workshop Overview

*Azure AI Foundry and Semantic Kernel Fundamentals* is designed to introduce participants to the conceptual foundations of integrating AI into applications using the Semantic Kernel development kit. The workshop consists of eight challenges, each designed to be completed in 30-90 minutes, encouraging learning and research.

### Learning Objectives

Participants will learn how to:

- Build a simple chat using Semantic Kernel Java
- Add plugins and enable auto-calling to create Planners
- Import existing APIs using OpenAPI
- Implement Retrieval Augmented Generation (RAG)
  - Document Chunking
  - Grounding AI


### Challenges

- [Challenge 00](challenges/Challenge-00.md): Prerequisites
  - Prepare your workstation to work with Azure.
- [Challenge 01](challenges/Challenge-01.md): Azure AI Foundry Fundamentals
  - Deploy an Azure AI Foundry Model
  - Prompt Engineering
  - What's possible through prompt engineering
  - Best practices when using OpenAI text and chat models
- [Challenge 02](challenges/Challenge-02.md): Semantic Kernel Fundamentals
  - Semantic Kernel Fundamentals
  - Connect your OpenAI model using Semantic Kernel
  - Test Your Application
- [Challenge 03](challenges/Challenge-03.md): Plugins
  - Functions and Plugins Fundamentals
  - Creating Semantic Kernel Plugins
  - Enable auto function calling
  - What is a Planner
- [Challenge 04](challenges/Challenge-04.md): Retrieval-Augmented Generation (RAG)
  - Document Chunking & Embedding
  - Enhance AI responses by searching external sources

- [Challenge 05](challenges/Challenge-05.md): Plugin using prompt

- [Challenge 06](./challenges/Challenge-06.md): Responsible AI: Exploring Content Filters in Azure AI Foundry
  - Configuring content filters in Azure AI Foundry Studio.
  - Testing content filters.
  - Creating custom filters to block specific words or phrases.
  
## Contributors

- [Vivek Mishra](https://github.com/mishravivek-ms)
