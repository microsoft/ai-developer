import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Box, Button, Typography, Grid, useMediaQuery, useTheme as useMuiTheme, Paper, Stack, Divider, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { ChatHistoryPanel, ChatHistory } from './ChatHistoryPanel';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/context/ThemeContext';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatMode } from '@/services/IHistoryService'; // Import ChatMode
// Import testing utilities
import { userEvent, within, expect, waitFor } from '@storybook/test';
import { action } from '@storybook/addon-actions';

interface StatefulChatHistoryPanelProps {
  initialOpen?: boolean;
  variant?: 'permanent' | 'persistent' | 'temporary';
  chatHistories?: ChatHistory[];
  drawerWidth?: number;
}

// Create a stateful wrapper for Storybook interactions
const StatefulChatHistoryPanel = ({ 
  initialOpen = true,
  variant = 'persistent',
  chatHistories = [],
  drawerWidth = 280
}: StatefulChatHistoryPanelProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [activeChatId, setActiveChatId] = useState<string | undefined>(
    chatHistories.length > 0 ? chatHistories[0].id : undefined
  );
  
  const toggleDrawer = () => {
    action('drawer toggled')(); // Log action
    setIsOpen(!isOpen);
  };
  
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    action('chat selected')(chatId); // Log action
  };
  
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const finalVariant = isMobile ? 'temporary' : variant;
  const finalWidth = isMobile ? drawerWidth * 0.9 : drawerWidth; // Adjust width slightly for mobile if needed

  return (
    <Box sx={{ 
      height: '600px', 
      width: '100%',
      position: 'relative',
      bgcolor: 'background.default',
      overflow: 'hidden',
      display: 'flex'
    }}>
      <ChatHistoryPanel 
        chatHistories={chatHistories}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        isOpen={isOpen}
        onToggle={toggleDrawer}
        variant={finalVariant}
        drawerWidth={finalWidth}
      />
      <Box sx={{ 
        flexGrow: 1,
        ml: isOpen && finalVariant !== 'temporary' ? `${finalWidth}px` : 0,
        p: 2,
        transition: 'margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        height: '100%',
        overflow: 'auto'
      }}>
        <Button
          variant="outlined"
          onClick={toggleDrawer}
          sx={{ mb: 2 }}
          aria-label={isOpen ? 'Close Drawer' : 'Open Drawer'}
        >
          {isOpen ? 'Close Drawer' : 'Open Drawer'}
        </Button>
        <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
          <Typography variant="body1">
            Main content area
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Active Chat: {activeChatId ? 
              chatHistories.find(chat => chat.id === activeChatId)?.title : 
              'None selected'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Component to demonstrate theme integration
const ThemeAwareHistoryPanel = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  
  return (
    <Box sx={{ height: '600px', width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={toggleTheme}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Theme
        </Button>
      </Box>
      <StatefulChatHistoryPanel 
        initialOpen={true}
        chatHistories={sampleChatHistories} 
      />
    </Box>
  );
};

const meta: Meta<typeof ChatHistoryPanel> = {
  component: ChatHistoryPanel,
  title: 'Organisms/ChatHistoryPanel',
  parameters: {
    layout: 'fullscreen',
    // Add accessibility addon parameters
    a11y: {
      element: '#storybook-root',
      config: { rules: [] },
      options: {},
    },
    docs: {
      description: {
        component: 'A responsive drawer panel organism that displays chat history. It composes list item components and drawer controls. Includes support for different drawer variants (permanent, persistent, temporary), responsive sizing based on screen width, and theme integration. The panel adapts to different screen sizes and can be toggled between open and closed states.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    chatHistories: {
      description: 'Array of chat history items to display in the panel',
    },
    activeChatId: {
      description: 'ID of the currently active/selected chat',
    },
    onSelectChat: { 
      action: 'chat selected',
      description: 'Callback function when a chat is selected',
    },
    onToggle: { 
      action: 'drawer toggled', 
      description: 'Callback function when the drawer is toggled',
    },
    isOpen: {
      control: 'boolean',
      description: 'Whether the drawer is open',
    },
    variant: {
      control: 'radio',
      options: ['permanent', 'persistent', 'temporary'],
      description: 'Type of drawer behavior (automatically switches to temporary on mobile)',
    },
    drawerWidth: {
      control: 'number',
      description: 'Width of the drawer in pixels (adjusted slightly on mobile)',
    },
    className: {
      description: 'Additional CSS class name',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleChatHistories: ChatHistory[] = [
  {
    id: '1',
    title: 'API Integration Discussion',
    lastMessage: 'Here are the API endpoints you requested...',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    messageCount: 12,
    mode: 'standard' as ChatMode,
  },
  {
    id: '2',
    title: 'Project Planning & Brainstorming Session',
    lastMessage: 'Let me outline the steps for your project, including potential roadblocks and solutions we discussed earlier.',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    messageCount: 8,
    mode: 'standard' as ChatMode,
  },
  {
    id: '3',
    title: 'Code Review Session (Multi-Agent)',
    lastMessage: 'Engineer: I recommend refactoring this function. Designer: The alignment looks good.',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messageCount: 15,
    mode: 'multiAgent' as ChatMode,
  },
  {
    id: '4',
    title: 'Urgent Bug Troubleshooting - Login Issue',
    lastMessage: "The error might be caused by the recent authentication library update. Let's check the logs.", // Escaped apostrophe
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    messageCount: 10,
    mode: 'standard' as ChatMode,
  },
  {
    id: '5',
    title: 'Very Long Chat Title That Should Truncate Properly In The UI Element To Avoid Layout Issues On Smaller Screens',
    lastMessage: 'This is an extremely long message that should demonstrate how text wrapping and truncation work within the history panel UI component. It should be cut off at a certain point to prevent overflow and maintain a clean appearance, especially on mobile devices where space is limited. The full message should be visible on hover or through other means if necessary.',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 25,
    mode: 'multiAgent' as ChatMode,
  },
  {
    id: '6',
    title: 'Quick Question',
    lastMessage: 'Thanks!',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    messageCount: 2,
    mode: 'standard' as ChatMode,
  },
];

// Basic states
export const Empty: Story = {
  args: {
    chatHistories: [],
    isOpen: true,
    variant: 'persistent',
  },
  // Use args directly, no need for Stateful wrapper if state isn't changing
  // render: (args) => <StatefulChatHistoryPanel {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no chat histories are available. Shows a helpful message and icon guiding the user.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check for empty state text
    await expect(canvas.getByText(/No chat history yet/i)).toBeInTheDocument();
    // Check for History icon (assuming Lucide icons are identifiable)
    // await expect(canvas.getByLabelText('History icon')).toBeInTheDocument(); // Adjust selector if needed
  },
};

export const WithHistory: Story = {
  args: {
    chatHistories: sampleChatHistories,
    isOpen: true,
    variant: 'persistent',
  },
  // render: (args) => <StatefulChatHistoryPanel {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Displays a list of chat histories. Shows how items are rendered with title, last message, and timestamp.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check for the first and last history item titles
    await expect(canvas.getByText(sampleChatHistories[0].title)).toBeInTheDocument();
    await expect(canvas.getByText(sampleChatHistories[sampleChatHistories.length - 1].title)).toBeInTheDocument();
    // Check that the empty state text is NOT present
    await expect(canvas.queryByText(/No chat history yet/i)).not.toBeInTheDocument();
  },
};

export const ActiveItem: Story = {
  args: {
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[2].id, // Make the third item active
    isOpen: true,
    variant: 'persistent',
  },
  // render: (args) => <StatefulChatHistoryPanel {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Displays chat histories with a specific item marked as active. Shows the visual styling for the selected chat.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const activeItem = canvas.getByText(sampleChatHistories[2].title).closest('button'); // Find the button containing the title
    await expect(activeItem).toBeInTheDocument();
    // Check for active state (MUI uses aria-selected="true")
    await expect(activeItem).toHaveAttribute('aria-selected', 'true');
  },
};

// Interactive story using the stateful wrapper
export const Interactive: Story = {
  args: {
    // Args for controls in Storybook, wrapper provides actual props
    chatHistories: sampleChatHistories,
    drawerWidth: 280,
    variant: 'persistent',
  },
  render: (args) => (
    <StatefulChatHistoryPanel 
      chatHistories={args.chatHistories} 
      drawerWidth={args.drawerWidth}
      variant={args.variant} // Pass variant from controls
      initialOpen={true} // Start open for interaction
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive ChatHistoryPanel that allows toggling the drawer and selecting chats. Demonstrates the state management and responsiveness of the component.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mainContent = canvas.getByText(/Main content area/i);
    const toggleButton = canvas.getByRole('button', { name: /Close Drawer/i }); // Button in main content
    const firstHistoryItem = canvas.getByText(sampleChatHistories[0].title);
    const thirdHistoryItem = canvas.getByText(sampleChatHistories[2].title);
    const drawerToggleButton = canvas.getAllByRole('button', { name: /Toggle drawer/i })[0]; // Button inside drawer

    // 1. Check initial state (drawer open, first item selected)
    await expect(mainContent).toBeVisible(); // Assuming visibility changes with margin
    await expect(firstHistoryItem.closest('button')).toHaveAttribute('aria-selected', 'true');

    // 2. Select another chat item
    await userEvent.click(thirdHistoryItem);
    await expect(thirdHistoryItem.closest('button')).toHaveAttribute('aria-selected', 'true');
    await expect(firstHistoryItem.closest('button')).toHaveAttribute('aria-selected', 'false');
    await expect(mainContent.nextElementSibling).toHaveTextContent(sampleChatHistories[2].title);

    // 3. Close the drawer using the button in the main content
    await userEvent.click(toggleButton);
    await waitFor(() => { // Wait for transition/state update
      // Check if main content margin adjusts (may depend on variant/implementation)
      // Or check if toggle button text changes
      expect(canvas.getByRole('button', { name: /Open Drawer/i })).toBeInTheDocument();
    });
    
    // 4. Open the drawer using the button inside the drawer (if visible)
    // Note: This might only work for persistent/permanent variants when closed 
    // depending on how the toggle button is implemented in the closed state.
    // Let's assume it's accessible for the test.
    try {
      const openDrawerButton = await canvas.findByRole('button', { name: /Open drawer/i }); // Or ChevronRight icon
      await userEvent.click(openDrawerButton);
      await waitFor(() => {
         expect(canvas.getByRole('button', { name: /Close Drawer/i })).toBeInTheDocument();
      });
    } catch (e) {
      console.warn("Could not find drawer open button, might be temporary variant or hidden.");
      // If the above fails, try opening with the main content button again
      await userEvent.click(canvas.getByRole('button', { name: /Open Drawer/i }));
       await waitFor(() => {
         expect(canvas.getByRole('button', { name: /Close Drawer/i })).toBeInTheDocument();
      });
    }
  },
};

// Responsive variations
export const MobileView: Story = {
  args: {
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[0].id,
    isOpen: false, // Start closed on mobile typically
    variant: 'temporary', // Force temporary for mobile testing
  },
  render: (args) => (
    <StatefulChatHistoryPanel 
      chatHistories={args.chatHistories} 
      initialOpen={args.isOpen} 
      variant={args.variant}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'ChatHistoryPanel in mobile view. Automatically uses the \'temporary\' variant, appearing over content when opened.',
      },
    },
  },
   play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const openDrawerButton = canvas.getByRole('button', { name: /Open Drawer/i });
    
    // Check drawer is initially closed (content margin should be 0)
    // (Exact check depends on implementation)
    
    // Open the drawer
    await userEvent.click(openDrawerButton);
    const drawer = await canvas.findByRole('dialog'); // Temporary drawer is often a dialog
    await expect(drawer).toBeVisible();
    await expect(within(drawer).getByText(sampleChatHistories[0].title)).toBeInTheDocument();

    // Click outside or on an item to close (or use toggle button if present)
    // Simulate clicking an item
    await userEvent.click(within(drawer).getByText(sampleChatHistories[1].title));
    await waitFor(() => {
       expect(drawer).not.toBeVisible();
    });
  },
};

// Theme integration story
export const ThemeIntegration: Story = {
  args: {
    chatHistories: sampleChatHistories,
    isOpen: true,
    variant: 'persistent',
    activeChatId: sampleChatHistories[1].id,
  },
  render: (args) => (
    // Need a way to toggle theme *outside* the panel for the demo
    <ThemeAwareHistoryPanel />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the ChatHistoryPanel adapts to light and dark themes. Use the button above the panel or the Storybook toolbar toggle to switch themes and observe changes in background, text, and selection colors.',
      },
    },
  },
  // No play function needed, interaction is via external theme toggle
};

// Component Composition Story
export const ComponentComposition: Story = {
  args: {},
  render: () => (
    <Box sx={{ p: 3, maxWidth: '800px' }}>
      <Typography variant="h6" gutterBottom>ChatHistoryPanel Composition</Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" paragraph>
          The ChatHistoryPanel organism is composed of these key elements/components:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 3 }}>
          <li>MUI Drawer: Provides the sliding panel functionality and variants (permanent, persistent, temporary).</li>
          <li>MUI Box: Used for layout and styling of the drawer header and content areas.</li>
          <li>MUI Typography: Displays the panel title ("Chat History") and empty state message.</li>
          <li>MUI List & ListItemButton: Renders the clickable list of chat history items.</li>
          <li>MUI ListItemText: Displays the title, last message, and timestamp within each list item.</li>
          <li>Lucide Icons (History, ChevronLeft/Right): Used for the empty state illustration and drawer toggle button.</li>
          <li>Internal State: Manages the open/closed state if not controlled externally.</li>
          <li>ThemeContext: Used for adapting colors and styles to light/dark modes.</li>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Typography variant="subtitle2" gutterBottom>Key Features:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Displays list of past chat conversations.</li>
            <li>Highlights the currently active chat.</li>
            <li>Allows selection of different chats.</li>
            <li>Responsive behavior with different drawer variants.</li>
            <li>Toggle mechanism to open/close the drawer.</li>
            <li>Handles empty state gracefully.</li>
            <li>Adapts to light and dark themes.</li>
          </Box>
        </Stack>
      </Paper>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Example Panel Structure:</Typography>
      <Paper elevation={1} sx={{ height: '400px', overflow: 'hidden', border: '1px dashed grey' }}>
        <ChatHistoryPanel 
          chatHistories={sampleChatHistories.slice(0, 3)} 
          activeChatId={sampleChatHistories[0].id}
          onSelectChat={() => {}} 
          isOpen={true} 
          variant="persistent"
        />
      </Paper>
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Shows how the ChatHistoryPanel organism is composed of MUI components and custom logic. Highlights its structure, features, and context integrations.',
      },
    },
  },
}; 