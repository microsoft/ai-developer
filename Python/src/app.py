# Debug configuration
# VS Code debugging is configured in launch.json
# Set breakpoints in your code and use the "Python: Streamlit App" or "Python: Debug chat.py" launch configuration

import streamlit as st
import asyncio
import logging
from chat import process_message, reset_chat_history
from multi_agent import run_multi_agent

# Configure logging
logging.basicConfig(level=logging.INFO)

def configure_sidebar():
    """Configure a clean, modern sidebar"""
    # Modern dark theme CSS
    st.sidebar.markdown("""
    <style>
    /* Sidebar styling */
    .sidebar .sidebar-content {
        background: #1a1a1a;
    }
    
    /* Custom navigation buttons */
    .nav-container {
        background: #262626;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
        border: 1px solid #404040;
    }
    
    .nav-title {
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        text-align: center;
        letter-spacing: -0.025em;
    }
    
    .nav-button {
        display: block;
        width: 100%;
        padding: 12px 16px;
        margin: 8px 0;
        background: transparent;
        border: 2px solid #404040;
        border-radius: 8px;
        color: #e5e5e5;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
        cursor: pointer;
    }
    
    .nav-button:hover {
        background: #3b82f6;
        border-color: #3b82f6;
        color: #ffffff;
        transform: translateY(-1px);
    }
    
    .nav-button.active {
        background: #10b981;
        border-color: #10b981;
        color: #ffffff;
    }
    
    /* Stats container */
    .stats-container {
        background: #262626;
        border-radius: 12px;
        padding: 16px;
        border: 1px solid #404040;
    }
    
    .stats-title {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
    }
    
    .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        color: #e5e5e5;
        border-bottom: 1px solid #404040;
    }
    
    .stat-item:last-child {
        border-bottom: none;
    }
    
    .stat-label {
        font-weight: 500;
    }
    
    .stat-value {
        color: #10b981;
        font-weight: 600;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Initialize selected option
    if "selected_option" not in st.session_state:
        st.session_state.selected_option = "Chat"
    
    # Navigation section
    st.sidebar.markdown("""
    <div class="nav-container">
        <div class="nav-title">🚀 AI Workshop for Developers</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Navigation buttons
    col1, col2 = st.sidebar.columns(2)
    
    with col1:
        if st.button("💬 Chat", key="nav_chat", use_container_width=True):
            st.session_state.selected_option = "Chat"
            
    with col2:
        if st.button("🤖 Team", key="nav_multi", use_container_width=True):
            st.session_state.selected_option = "Multi-Agent"
    
    # Session stats
    st.sidebar.markdown("---")
    
    if st.session_state.selected_option == "Chat":
        chat_count = len(st.session_state.get("chat_history", []))
        st.sidebar.metric("Messages", chat_count, delta=None)
    else:
        multi_agent_count = len(st.session_state.get("multi_agent_history", []))
        st.sidebar.metric("Team Messages", multi_agent_count, delta=None)
        
    return st.session_state.selected_option


def render_chat_ui(title, on_submit):
    """Renders a modern, clean chat UI"""
    # Modern dark theme CSS
    st.markdown("""
    <style>
    /* Main container */
    .main .block-container {
        padding-top: 2rem;
        max-width: 1200px;
    }
    
    /* Header styling */
    .chat-header {
        background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
        border: 1px solid #4b5563;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        text-align: center;
    }
    
    .chat-title {
        color: #ffffff;
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 8px 0;
        letter-spacing: -0.025em;
    }
    
    .chat-subtitle {
        color: #9ca3af;
        font-size: 16px;
        margin: 0;
        font-weight: 400;
    }
    
    /* New chat button container */
    .new-chat-container {
        position: absolute;
        top: 24px;
        right: 24px;
    }
    
    /* Chat input styling */
    .stChatInput > div {
        background: #374151;
        border: 2px solid #4b5563;
        border-radius: 12px;
    }
    
    .stChatInput input {
        background: transparent;
        color: #ffffff;
        font-size: 16px;
    }
    
    .stChatInput input::placeholder {
        color: #9ca3af;
    }
    
    /* Chat messages */
    .stChatMessage {
        background: transparent;
        border-radius: 12px;
        margin: 12px 0;
    }
    
    .stChatMessage[data-testid="chat-message-user"] {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        border: 1px solid #2563eb;
    }
    
    .stChatMessage[data-testid="chat-message-assistant"] {
        background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
        border: 1px solid #4b5563;
    }
    
    /* Success/Error messages */
    .stSuccess {
        background: #065f46;
        border: 1px solid #10b981;
        color: #d1fae5;
    }
    
    .stError {
        background: #7f1d1d;
        border: 1px solid #ef4444;
        color: #fecaca;
    }
    
    /* Spinner */
    .stSpinner {
        color: #3b82f6;
    }
    
    /* Code blocks */
    .stCodeBlock {
        background: #1f2937;
        border: 1px solid #374151;
        border-radius: 8px;
    }
    
    /* Metrics */
    .metric-container {
        background: #374151;
        border: 1px solid #4b5563;
        border-radius: 8px;
        padding: 16px;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Header with new chat button
    header_col1, header_col2 = st.columns([5, 1])
    
    with header_col1:
        if title == "Chat":
            st.markdown("""
            <div class="chat-header">
                <h1 class="chat-title">💬 AI Assistant</h1>
                <p class="chat-subtitle">Your intelligent coding companion</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class="chat-header">
                <h1 class="chat-title">🤖 AI Team</h1>
                <p class="chat-subtitle">Collaborative intelligence at work</p>
            </div>
            """, unsafe_allow_html=True)
    
    with header_col2:
        if st.button("🔄 Reset", key=f"new_chat_{title}", use_container_width=True, type="secondary"):
            if title == "Chat":
                st.session_state.chat_history = []
                reset_chat_history()
                st.success("Chat reset!")
            elif title == "Multi-Agent":
                st.session_state.multi_agent_history = []
                st.success("Team session reset!")
            st.rerun()

    # Chat input
    if title == "Chat":
        user_input = st.chat_input("Ask me anything...", key="chat_input")
    else:
        user_input = st.chat_input("Describe your project requirements...", key="multi_agent_input")
    
    if user_input:
        on_submit(user_input)

def chat():
    """Enhanced chat functionality"""
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    def on_chat_submit(user_input):
        if user_input:
            try:
                # Add user message
                st.session_state.chat_history.append({"role": "user", "message": user_input})
                
                # Show processing indicator
                with st.spinner("Processing..."):
                    assistant_response = asyncio.run(process_message(user_input))
                
                # Add assistant response
                st.session_state.chat_history.append({"role": "assistant", "message": str(assistant_response)})
                
                st.rerun()
                
            except Exception as e:
                import traceback
                error_msg = f"Error: {str(e)}"
                logging.error(error_msg)
                tb = traceback.format_exc()
                logging.error(f"Traceback: {tb}")
                
                st.session_state.chat_history.append({
                    "role": "assistant", 
                    "message": f"**Error**: {error_msg}\n\nPlease try again."
                })
                
                st.session_state.show_error_details = True
                st.session_state.error_traceback = tb

    render_chat_ui("Chat", on_chat_submit)
    display_chat_history(st.session_state.chat_history)

    # Error details expander
    if st.session_state.get("show_error_details", False):
        with st.expander("Debug Info", expanded=False):
            st.code(st.session_state.error_traceback, language="python")
        st.session_state.show_error_details = False

def multi_agent():
    """Enhanced multi-agent system"""
    if "multi_agent_history" not in st.session_state:
        st.session_state.multi_agent_history = []

    def on_multi_agent_submit(user_input):
        if user_input:
            try:
                st.session_state.multi_agent_history.append({"role": "user", "message": user_input})
                
                with st.spinner("Team collaborating..."):
                    result = asyncio.run(run_multi_agent(user_input))
                
                for response in result:
                    st.session_state.multi_agent_history.append({
                        "role": response['role'], 
                        "message": response['message']
                    })
                
                st.rerun()

            except Exception as e:
                logging.error(f"Multi-agent error: {e}")
                st.session_state.multi_agent_history.append({
                    "role": "assistant", 
                    "message": f"**Team Error**: {str(e)}\n\nPlease try again."
                })

    render_chat_ui("Multi-Agent", on_multi_agent_submit)
    display_chat_history(st.session_state.multi_agent_history)


def display_chat_history(chat_history):
    """Display chat history with modern styling"""
    # Role avatars and colors
    role_config = {
        "user": {"avatar": "👤", "name": "You"},
        "assistant": {"avatar": "🤖", "name": "Assistant"},
        "BusinessAnalyst": {"avatar": "📊", "name": "Business Analyst"},
        "SoftwareEngineer": {"avatar": "⚡", "name": "Engineer"},
        "ProductOwner": {"avatar": "🎯", "name": "Product Owner"}
    }
    
    if not chat_history:
        with st.chat_message("assistant", avatar="🤖"):
            st.markdown("**Ready to help!** What can I do for you today?")
        return
    
    for chat in chat_history:
        role = chat.get("role", "assistant")
        message = chat.get("message", "")
        
        config = role_config.get(role, {"avatar": "🤖", "name": role})
        
        with st.chat_message(
            "user" if role == "user" else "assistant", 
            avatar=config["avatar"]
        ):
            # Show role name for agents
            if role not in ["user", "assistant"]:
                st.markdown(f"**{config['name']}**")
            
            # Display message
            if isinstance(message, str):
                if "error" in message.lower():
                    st.error(message)
                elif "success" in message.lower():
                    st.success(message)
                else:
                    st.markdown(message)
            else:
                st.write(message)

def main():
    """Main application with modern dark theme"""
    st.set_page_config(
        page_title="AI Workshop", 
        page_icon="🚀",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Global dark theme
    st.markdown("""
    <style>
    /* Global dark theme */
    .stApp {
        background-color: #111827;
        color: #ffffff;
    }
    
    /* Sidebar */
    .css-1d391kg {
        background-color: #1f2937;
    }
    
    /* Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
        border: 2px solid #4b5563;
        color: #ffffff;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .stButton > button:hover {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        border-color: #3b82f6;
        transform: translateY(-1px);
    }
    
    .stButton > button[kind="secondary"] {
        background: transparent;
        border: 2px solid #6b7280;
        color: #e5e5e5;
    }
    
    .stButton > button[kind="secondary"]:hover {
        background: #374151;
        border-color: #9ca3af;
    }
    
    /* Metrics */
    .stMetric {
        background: #374151;
        padding: 16px;
        border-radius: 12px;
        border: 1px solid #4b5563;
    }
    
    .stMetric label {
        color: #9ca3af;
        font-weight: 500;
    }
    
    .stMetric [data-testid="metric-value"] {
        color: #10b981;
        font-weight: 700;
    }
    
    /* Expander */
    .streamlit-expanderHeader {
        background: #374151;
        border-radius: 8px;
        border: 1px solid #4b5563;
    }
    
    /* Remove default margins */
    .block-container {
        padding-top: 1rem;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Configure sidebar and get operation
    chosen_operation = configure_sidebar()
    
    # Route to functionality
    if chosen_operation == "Chat":
        chat()
    elif chosen_operation == "Multi-Agent":
        multi_agent()

if __name__ == "__main__":
    main()
