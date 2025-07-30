### **[Home](../README.md)** - [Next Challenge >](./Challenge-01.md)

# Challenge 00 - Prerequisites - Ready, Set, GO!

## Introduction

Thank you for participating in the OpenAI & Semantic Kernel Fundamentals. Before you can workshop, you will need to set up some prerequisites.

## Description

In this challenge, you will set up the necessary prerequisites and environment to complete the rest of the workshop.

### Access Azure AI Foundry

You will need an Azure subscription to complete this workshop. If you don't have one, choose one of the following options:

- [Azure Subscription](https://azure.microsoft.com/en-us/free/)

- Azure Passes: If your workshop group has access to an Azure Pass, you can utilize it to gain access to Azure AI Foundry and other necessary Azure resources for this workshop. 

### Development Environment


Our recommmendation is to use your local machine. However if your IT will block the abilty to create a Developer Certificate (aka https on localhost) then it may be best for you to use a Azure DevBox. See the setup instructions [here](./Resources/Supporting%20Challenges/Challenge-00-DevBox.md).

#### Use Local Workstation

Using your local workstation is another option to complete the challenges. You will need to set up the necessary tools and resources on your local workstation to complete the challenges and will need to clone the Student Resources Git Repository to your local workstation.

##### Install the following tools on your Local Workstation

- IDE
  - We recommend [IntelliJ](https://www.jetbrains.com/idea/download/?section=windows)
  - But you can use [VS Code](https://code.visualstudio.com/download)
    - [Java Extension](https://marketplace.visualstudio.com/items?itemName=Oracle.oracle-java)
    - Recommended: [GitHub Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) (test using `java -version`)
- Install Maven for Java [Download](https://archive.apache.org/dist/maven/maven-3/3.9.1/binaries/apache-maven-3.9.1-bin.zip) 
  - Set JAVA_HOME in system environment variable. Make sure you use JAVA installation path
  - Set MAVEN_HOME in system environment variable. Make sure you use Maven download folder path
  - Set java and maven bin path into System Path
  - test using `mvn -v`
- [Git CLI](https://git-scm.com/downloads) or [GitHub Desktop](https://github.com/apps/desktop)

**Note:** GitHub Copilot is a great tool to help you write code faster. You can install the [GitHub Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) in Visual Studio Code. We highly recommend you install this extension to help you complete the challenges.

If you do not have GitHub Copilot, you can still complete the challenges. However you can start a free trial of GitHub Copilot by following the instructions [here](https://github.com/features/copilot?ef_id=_k_fdbe5318644f1533620435c241c3e251_k_&OCID=AIDcmmb150vbv1_SEM__k_fdbe5318644f1533620435c241c3e251_k_&msclkid=fdbe5318644f1533620435c241c3e251).

##### Clone the Student Resources to your Local Workstation

From a directory where you want to store the resources, clone the [repository](https://github.com/microsoft/ai-developer). You can do this by running the following command in your terminal or command prompt:

  ```console
  git clone https://github.com/microsoft/ai-developer.git
  cd Java
  ```

The rest of the challenges will refer to the relative paths inside the Git Repository where you can find the various resources to complete the challenges.

## Success Criteria

- Verify that you have **Visual Studio Code** with the ***JAVA Dev Kit*** Extension installed 
  - Verify you have the following files & folders locally:

    ```text
    /Java
    ├─── src/main
    │     ├─── java/
    │     │     └─── com/
    │     │           └─── sk/
    │     │                 ├─── config/
    │     │                 ├─── controller/
    │     │                 ├─── kernel/
    │     │                 ├─── model/  
    │     │                 ├─── plugins/
    │     │                 └─── SpringbootSkChatApplication.java
    │     │                 
    │     └─── resources/
    │           ├─── application.properties
    │           └─── promptconfig/
    │                 ├─── skprompt.json    
    │                 └─── skprompt.txt
    ├─── mvnw
    ├─── mvnw.cmd
    ├─── pom.xml
    └─── README.md      
    ```

### **[Home](../README.md)** - [Next Challenge >](./Challenge-01.md)
