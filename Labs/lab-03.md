# **Exercise 3**: Semantic Kernel Plugins

### Estimated Duration: 60 minutes

Semantic Kernel truly shines in LLM development when you incorporate plugins. These plugins extend the AI's capabilities and provide access to additional knowledge that cannot be built directly into the model through training. Things such as time sensitive data, user specific information, and esoteric knowledge are all areas where the Plugin model can greatly improve the capabilities of your AI. In this challenge, you will implement a time plugin, and a plugin that retrieves the weather for a location to extend the capabilities of your chat bot.This challenge will introduce you to building Semantic Kernel Plugins in python, and how to chain plugins using the Auto Function Calling capabilities of Semantic Kernel.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Try the app without the Time Plugin

<details>
<summary><strong>Python</strong></summary>

1. Launch your AI Chat app, and submit the following prompt:
    ```
    What time is it?
    ```
2. Since the AI does not have the capability to provide real-time information, you will get a response similar to the following:
    ```
    I can't provide real-time information, including the current time. You can check the time on your device or through various online sources.
    ```

</details>

## Task 2: Create and import the Time Plugin
<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src>plugins` directory and create a new file named **time_plugin.py**.
1. Add the following code in the file:
    ```
    from datetime import datetime
    from typing import Annotated
    from semantic_kernel.functions import kernel_function


    class TimePlugin:
        """Plugin that provides time-related functions."""

        @kernel_function()
        def current_time(self) -> str:
            """Get the current date and time."""
            return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        @kernel_function()
        def get_year(self, date_str: Annotated[str, "The date string in format YYYY-MM-DD"] = None) -> str:
            """Extract the year from a date string."""
            if date_str is None:
                return str(datetime.now().year)
            
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                return str(date_obj.year)
            except ValueError:
                return "Invalid date format. Please use YYYY-MM-DD."

        @kernel_function()
        def get_month(self, date_str: Annotated[str, "The date string in format YYYY-MM-DD"] = None) -> str:
            """Extract the month from a date string."""
            if date_str is None:
                return datetime.now().strftime("%B")
            
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                return date_obj.strftime("%B")  # Full month name
            except ValueError:
                return "Invalid date format. Please use YYYY-MM-DD."

        @kernel_function()
        def get_day_of_week(self, date_str: Annotated[str, "The date string in format YYYY-MM-DD"] = None) -> str:
            """Get the day of week for a date."""
            if date_str is None:
                return datetime.now().strftime("%A")
            
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                return date_obj.strftime("%A")  # Full weekday name
            except ValueError:
                return "Invalid date format. Please use YYYY-MM-DD."
    ```
1. Save the file.
1. Navigate to `Python>src` directory and open **chat.py** file.
1. Add the following code in the `#Import Modules` section of the file.
    ```
    from semantic_kernel.connectors.ai.open_ai.prompt_execution_settings.azure_chat_prompt_execution_settings import (
        AzureChatPromptExecutionSettings,
    )
    from plugins.time_plugin import TimePlugin
    ```
1. Add the following code in the `#Challenge 03 - Create Prompt Execution Settings` section of the file.
    ```
    execution_settings = AzureChatPromptExecutionSettings()
    execution_settings.function_choice_behavior = FunctionChoiceBehavior.Auto()
    logger.info("Automatic function calling enabled")
    ```
1. Add the following code in the `# Placeholder for Time plugin` section of the file.
    ```
    time_plugin = TimePlugin()
    kernel.add_plugin(time_plugin, plugin_name="TimePlugin")
    logger.info("Time plugin loaded")
    ```
1. Add the following code in the `# Placeholder for Time plugin` section of the file.
    ```
    time_plugin = TimePlugin()
    kernel.add_plugin(time_plugin, plugin_name="TimePlugin")
    logger.info("Time plugin loaded")
    ```
1. Search (using Ctrl+F) and remove the following piece of code from the file as we will enable automatic function calling and this is no longer required:
    ```
    execution_settings = kernel.get_prompt_execution_settings_from_service_id("chat-service")
    ```
    >**Note**: You need to remove it from two code blocks, one will be inside **def initialize_kernel():** function and another will be in **global chat_history** code block.
1. Right click on `Python>src` in the left pane and select **Open in Integrated Terminal**.
1. Use the following command to run the app:
    ```
    streamlit run app.py
    ```
1. If the app does not open automatically in the browser, you can access it using the following **URL**:
    ```
    http://localhost:8501
    ```
1. Submit the following prompt:
    ```
    What time is it?
    ```
2. Since the AI have the **Time Plugin**, it will be able to provide real-time information, you will get a response similar to the following:
    ```
    The current time is 3:43 PM on January 23, 2025.
    ```
</details>

## Task 3: Create and import the Geocoding Plugin
1. Navigate to [Geocoding API](https://geocode.maps.co/) portal and :
