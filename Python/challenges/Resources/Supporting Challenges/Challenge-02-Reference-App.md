### [< Back to Challenge 2](../../Challenge-02.md)

# Getting Familiar With the Reference Application

This application is a sample chat application designed to help you learn Semantic Kernel and Azure AI Foundry. It uses the Semantic Kernel framework to interact with Azure AI models and is hosted using Streamlit, a beginner-friendly Python web framework. 

The application features a modern chat interface where users can interact with AI models by typing questions or prompts. As you progress through the challenges, you'll add new capabilities like plugins, external APIs, and advanced AI services.

## Understanding the Application Structure

Before diving into debugging and running the application, let's understand what you'll be working with:

1. **Key Files for Challenges 2-7:**
   - `src/app.py` - The main Streamlit application (you won't modify this)
   - `src/chat.py` - **This is where you'll make most of your changes**
   - `src/workitems/api.py` - WorkItems API service (used starting in Challenge 4)

2. **The Heart of Semantic Kernel: The Kernel Object**
   
   Open the `src/chat.py` file and locate the `initialize_kernel()` method:

   ```python
   def initialize_kernel():
       #Challenge 02 - Add Kernel
       kernel = Kernel()
   ```

   The Kernel object is the core of the Semantic Kernel framework. This is where you:
   - Register AI models (like Azure AI Foundry chat models)
   - Add plugins for extended functionality
   - Configure services for different challenges

## Getting Started with VS Code Launch Profiles

VS Code has been pre-configured with multiple launch profiles to make development easier. The profiles you'll use depend on which challenge you're working on:

> It is **highly recommended** that you create a Python virtual environment for your packages. If you do not do this you will need to update the launch.json file in the .vscode folder to point to your python installation.
>
> **Creating your Python virtual environment**
> 1. Open your terminal or command prompt
> 2. Navigate to the `Python` directory in your terminal/command prompt
> 3. Run the following command to create the virtual environment: `python -m venv <virtual environment name>`
> 4. Then activate the virtual environment: `.\<name of your virtual environment>\Scripts\activate`
> 5. Proceed with installing your requirements
> 6. To deactivate your virtual environment: `.\<name of your virtual environment>\Scripts\deactivate`

### For Challenges 2-3: Basic Chat Application

**Recommended Launch Profile: "Python: Streamlit App"**

0. **Prerequisites:** Before testing, make sure you've installed the Python dependencies in the `src` directory by running

   ```console
   pip install -r requirements.txt
   ```

1. **Setting Up and Running:**
   - Open the Run and Debug panel in VS Code (Ctrl+Shift+D or Cmd+Shift+D)
   - From the dropdown menu, select **"Python: Streamlit App"**
   - Click the green play button or press F5 to start the application

2. **What This Profile Does:**
   - Starts only the Streamlit chat application
   - Sets up the correct Python environment
   - Makes the app available at `http://localhost:8501`

3. **Alternative Profile: "Python: Debug chat.py"**
   - This does the same thing as "Python: Streamlit App"
   - Use this if you want to focus specifically on debugging the chat functionality

### For Challenge 4+: Full Application with WorkItems API

**Recommended Launch Profile: "Challenge 4: Run WorkItems API and App"**

1. **When You Need This:**
   - Starting in Challenge 4, you'll work with external APIs
   - The WorkItems API needs to run alongside the Streamlit app
   - This profile launches both services in the correct order

2. **What This Profile Does:**
   - Starts the WorkItems API service on `http://localhost:8000`
   - Starts the Streamlit app on `http://localhost:8501`
   - Ensures both services can communicate properly

3. **Manual Alternative (if needed):**
   - If you prefer to start services manually:
     - First: Open a terminal, navigate to `src/workitems`, run `python api.py`
     - Then: Use the "Python: Streamlit App" profile for the chat app

## Debugging Your Implementation

VS Code provides powerful debugging capabilities that will help you troubleshoot your Semantic Kernel implementation:

### Setting Up Breakpoints

1. **Where to Set Breakpoints:**
   - Open `src/chat.py`
   - Click in the left margin next to line numbers where you want execution to pause
   - Good spots for Challenge 2: inside `initialize_kernel()` and `process_message()`
   - A red dot indicates a breakpoint is set

2. **Starting a Debug Session:**
   - Use the appropriate launch profile (see above)
   - When execution hits a breakpoint, VS Code will pause and highlight the current line

3. **Debug Controls:**
   - **Step Over (F10)**: Execute the current line and move to the next
   - **Step Into (F11)**: Enter into function calls
   - **Step Out (Shift+F11)**: Complete current function and return to caller
   - **Continue (F5)**: Resume execution until next breakpoint

### Using the Debug Console

- **Examine Variables**: Hover over variables in the editor to see their values
- **Evaluate Expressions**: Use the Debug Console panel to test code snippets
- **Check Semantic Kernel Objects**: Inspect the kernel, services, and chat history

### Common Debugging Scenarios

**Challenge 2 - Basic Setup:**
- Set breakpoints in `initialize_kernel()` to verify the kernel is created
- Check if the chat completion service is properly added
- Examine the chat history to ensure messages are being stored

**Challenge 4+ - API Integration:**
- Use the compound launch profile to debug both services
- Set breakpoints where OpenAPI plugins are added
- Monitor API calls in the WorkItems service

## Testing Your Implementation

1. **Start the Application:**
   - Use the appropriate VS Code launch profile
   - The application will open at `http://localhost:8501`
   - You should see a modern chat interface

2. **Initial Test (Challenge 2):**
   ```text
   Why is the sky blue?
   ```
   - **Expected**: The AI should provide a scientific explanation
   - **If Error**: Check your `.env` file configuration and Azure AI Foundry setup

3. **Context Test (Challenge 2):**
   ```text
   Why is it red?
   ```
   - **Expected**: The AI understands you're still talking about the sky
   - **If Confused**: Check that chat history is properly maintained

4. **API Test (Challenge 4+):**
   ```text
   What are my work items?
   ```
   - **Expected**: A list of work items from the API
   - **If Error**: Ensure both services are running and the OpenAPI plugin is configured

## What to Expect as You Progress

- **Challenge 2**: Simple chat with Azure AI model - use basic launch profile
- **Challenge 3**: Add time and weather plugins - still basic launch profile  
- **Challenge 4**: External API integration - switch to compound launch profile
- **Challenge 5+**: Advanced features like search and image generation - compound launch profile

## Success Criteria

1. **Application Structure Understanding:**
   - [ ] Located the Kernel object in `src/chat.py`
   - [ ] Identified where you'll make changes for each challenge
   - [ ] Understand the difference between app.py (don't modify) and chat.py (your work area)

2. **VS Code Launch Profiles:**
   - [ ] Successfully used "Python: Streamlit App" for basic testing
   - [ ] Know when to switch to "Challenge 4: Run WorkItems API and App"
   - [ ] Can access the application at `http://localhost:8501`

3. **Debugging Setup:**
   - [ ] Can set breakpoints in chat.py
   - [ ] Successfully start a debug session
   - [ ] Understand how to use debug controls and console

**Ready to Begin!** Now that you understand the application structure and VS Code setup, you're ready for [Challenge 2](../../Challenge-02.md#challenges).

## Quick Reference

| Challenge | Launch Profile | Services Running | Ports |
|-----------|---------------|------------------|-------|
| 2-3 | "Python: Streamlit App" | Streamlit only | 8501 |
| 4+ | "Challenge 4: Run WorkItems API and App" | Streamlit + WorkItems API | 8501, 8000 |

**Tip**: If you ever see connection errors to `localhost:8000`, make sure you're using the compound launch profile for Challenge 4 and later!


### [< Back to Challenge 2](../../Challenge-02.md)