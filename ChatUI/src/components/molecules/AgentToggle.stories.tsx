import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme, Paper, Stack, Divider } from '@mui/material';
import { AgentToggle, AgentMode } from './AgentToggle';
import { ThemeProvider } from '../providers/ThemeProvider';
import { MessageSquare, Bot } from 'lucide-react';
import { action } from '@storybook/addon-actions';
// Import testing utilities
import { userEvent, within, expect } from '@storybook/test';

// Create a stateful wrapper for Storybook interactions
const StatefulAgentToggle = ({ initialMode = 'standard', compact = false, onModeChange = null }: { initialMode?: AgentMode, compact?: boolean, onModeChange?: ((mode: AgentMode) => void) | null }) => {
  const [mode, setMode] = useState<AgentMode>(initialMode);
  
  const handleToggle = (newMode: AgentMode) => {
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
    action('mode changed')(newMode);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <AgentToggle 
        mode={mode} 
        onToggle={handleToggle} 
        compact={compact}
      />
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        Current mode: <strong>{mode === 'standard' ? 'Standard Chat' : 'Multi-Agent Chat'}</strong>
      </Typography>
    </Box>
  );
};

const meta = {
  title: 'Molecules/AgentToggle',
  component: AgentToggle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    // Add accessibility addon parameters
    a11y: {
      element: '#storybook-root',
      config: { rules: [] },
      options: {},
    },
    docs: {
      description: {
        component: 'Toggle component for switching between standard chat and multi-agent chat modes. This molecule composes atomic components like Buttons, Icons, and Typography elements to create an interactive toggle with visual feedback. Features responsive design with compact mode for mobile screens and integrates with the theme system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['standard', 'multiAgent'],
      description: 'Current chat mode (standard or multiAgent). Controls which option is selected.',
    },
    onToggle: {
      action: 'toggled',
      description: 'Function called when the toggle is clicked with the new mode as parameter.',
    },
    compact: {
      control: 'boolean',
      description: 'Whether to show the toggle in compact mode (smaller size for mobile screens).',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names for styling customization.',
    },
  },
} satisfies Meta<typeof AgentToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

// Basic examples with interactive state
export const StandardSelected: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
    compact: false, // Explicitly set default for clarity
  },
  render: (args) => <StatefulAgentToggle initialMode="standard" compact={args.compact} onModeChange={args.onToggle} />, 
  parameters: {
    docs: {
      description: {
        story: 'AgentToggle with the standard chat mode selected. Shows the default appearance and behavior with the standard chat option active. The toggle maintains state internally and provides visual feedback on the current selection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check that the standard button is visually distinct (e.g., has some background)
    // This is tricky as bgcolor is dynamic. We'll check the structure instead.
    const standardButton = canvas.getByRole('button', { name: /Standard chat mode/i });
    const multiAgentButton = canvas.getByRole('button', { name: /Multi-agent chat mode/i });

    // Basic structural check: Ensure Standard button is present
    await expect(standardButton).toBeInTheDocument();
    await expect(multiAgentButton).toBeInTheDocument();

    // Interact: Click Multi-Agent
    await userEvent.click(multiAgentButton);
    // Check state update text
    await expect(canvas.getByText(/Current mode:/i)).toHaveTextContent('Multi-Agent Chat');

    // Interact: Click Standard again
    await userEvent.click(standardButton);
    // Check state update text
    await expect(canvas.getByText(/Current mode:/i)).toHaveTextContent('Standard Chat');
  },
};

export const MultiAgentSelected: Story = {
  args: {
    mode: 'multiAgent',
    onToggle: action('toggled'),
    compact: false, // Explicitly set default for clarity
  },
  render: (args) => <StatefulAgentToggle initialMode="multiAgent" compact={args.compact} onModeChange={args.onToggle} />,
  parameters: {
    docs: {
      description: {
        story: 'AgentToggle with the multi-agent chat mode selected. Demonstrates how the toggle looks when the multi-agent option is active. The toggle uses color and visual weight to indicate the active selection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const standardButton = canvas.getByRole('button', { name: /Standard chat mode/i });
    const multiAgentButton = canvas.getByRole('button', { name: /Multi-agent chat mode/i });

    // Basic structural check
    await expect(standardButton).toBeInTheDocument();
    await expect(multiAgentButton).toBeInTheDocument();
    // Check initial state text
    await expect(canvas.getByText(/Current mode:/i)).toHaveTextContent('Multi-Agent Chat');

    // Interact: Click Standard
    await userEvent.click(standardButton);
    // Check state update text
    await expect(canvas.getByText(/Current mode:/i)).toHaveTextContent('Standard Chat');

    // Interact: Click Multi-Agent again
    await userEvent.click(multiAgentButton);
    // Check state update text
    await expect(canvas.getByText(/Current mode:/i)).toHaveTextContent('Multi-Agent Chat');
  },
};

// Compact mode examples (mobile)
export const CompactStandardSelected: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
    compact: true,
  },
  render: (args) => <StatefulAgentToggle initialMode="standard" compact={args.compact} onModeChange={args.onToggle} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Compact version of the toggle for mobile devices with standard mode selected. Shows the responsive adaptation with smaller text and spacing to fit on mobile screens while maintaining usability.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check compact text
    const standardButton = canvas.getByRole('button', { name: /Standard chat mode/i });
    await expect(within(standardButton).getByText('Chat')).toBeInTheDocument();
    
    const multiAgentButton = canvas.getByRole('button', { name: /Multi-agent chat mode/i });
    await expect(within(multiAgentButton).getByText('Agents')).toBeInTheDocument();
    
    // Check initial state text
    await expect(canvas.getByText(/Current mode:/i)).toHaveTextContent('Standard Chat');

    // Interact: Click Multi-Agent
    await userEvent.click(multiAgentButton);
    // Check state update text
    await expect(canvas.getByText(/Current mode:/i)).toHaveTextContent('Multi-Agent Chat');
  },
};

export const CompactMultiAgentSelected: Story = {
  args: {
    mode: 'multiAgent',
    onToggle: action('toggled'),
    compact: true,
  },
  render: (args) => <StatefulAgentToggle initialMode="multiAgent" compact={args.compact} onModeChange={args.onToggle} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Compact version of the toggle for mobile devices with multi-agent mode selected. Demonstrates the space-efficient layout for small screens with the multi-agent option active.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check compact text
    const standardButton = canvas.getByRole('button', { name: /Standard chat mode/i });
    await expect(within(standardButton).getByText('Chat')).toBeInTheDocument();
    
    const multiAgentButton = canvas.getByRole('button', { name: /Multi-agent chat mode/i });
    await expect(within(multiAgentButton).getByText('Agents')).toBeInTheDocument();
    
    // Check initial state text
    await expect(canvas.getByText(/Current mode:/i)).toHaveTextContent('Multi-Agent Chat');

    // Interact: Click Standard
    await userEvent.click(standardButton);
    // Check state update text
    await expect(canvas.getByText(/Current mode:/i)).toHaveTextContent('Standard Chat');
  },
};

// Component composition demonstration (primarily visual)
export const ComponentComposition: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
  },
  render: () => {
    // Use Stateful Wrapper to demonstrate responsiveness
    const theme = useTheme();
    const isCompact = useMediaQuery(theme.breakpoints.down('sm'));
    const [mode, setMode] = useState<AgentMode>('standard');

    const handleToggle = (newMode: AgentMode) => {
      setMode(newMode);
      action('responsive-toggled')(newMode);
    };

    return (
      <Box sx={{ width: '100%', maxWidth: '600px', p: 2 }}>
        <Typography variant="h6" gutterBottom>Responsive AgentToggle</Typography>
        <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
          <Typography variant="body2" paragraph>
            This toggle automatically switches between normal and compact mode based on screen size.
            Try resizing the Storybook preview pane or use the viewport addon.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
            <AgentToggle mode={mode} onToggle={handleToggle} compact={isCompact} />
            <Typography variant="caption">Current Mode: {mode}</Typography>
            <Typography variant="caption">(Compact: {isCompact.toString()})</Typography>
          </Box>
        </Paper>
        
        {/* Include interaction test logic here */}
      </Box>
    );
  },
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    docs: {
      description: {
        story: 'Demonstrates the responsive behavior of the AgentToggle. It switches to compact mode on smaller viewports. The current state and compact status are shown below the toggle. Resize the viewport to see the change.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for potential resizing/rendering delays in responsive mode
    await new Promise(resolve => setTimeout(resolve, 100)); 

    const standardButton = canvas.getByRole('button', { name: /Standard chat mode/i });
    const multiAgentButton = canvas.getByRole('button', { name: /Multi-agent chat mode/i });

    // Click multi-agent and check state update
    await userEvent.click(multiAgentButton);
    await expect(canvas.getByText(/Current Mode: multiAgent/i)).toBeInTheDocument();

    // Click standard and check state update
    await userEvent.click(standardButton);
    await expect(canvas.getByText(/Current Mode: standard/i)).toBeInTheDocument();

    // Note: Asserting the *visual* switch between compact/non-compact 
    // based on viewport is complex in play functions. 
    // This is better suited for visual regression testing.
    // We can check for the presence of specific text ('Standard' vs 'Chat').
    // This depends on the initial viewport size Storybook renders.
    // Example (may fail depending on default viewport):
    // try {
    //   await expect(canvas.getByText('Standard')).toBeInTheDocument(); 
    // } catch (e) {
    //   await expect(canvas.getByText('Chat')).toBeInTheDocument();
    // }
  },
};

// Responsive toggle example with interaction tracking
export const ResponsiveToggle: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
  },
  render: () => {
    // This is a render function component that can use hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // @ts-ignore - useState is not recognized in static Story type
    const [modeChanges, setModeChanges] = useState<{mode: string, timestamp: string}[]>([]);
    
    const handleModeChange = (newMode: AgentMode) => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      setModeChanges(prev => [...prev.slice(-3), { mode: newMode, timestamp }]);
      action('mode changed')(newMode);
    };
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%', maxWidth: '400px' }}>
        <Paper sx={{ p: 3, width: '100%' }} elevation={1}>
          <Typography variant="subtitle1" gutterBottom>Responsive Behavior Demo</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>
          Current viewport: <strong>{isMobile ? 'Mobile' : 'Desktop/Tablet'}</strong>
        </Typography>
        
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <StatefulAgentToggle initialMode="standard" compact={isMobile} onModeChange={handleModeChange} />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {modeChanges.length > 0 && (
            <Paper sx={{ p: 1.5, mt: 1, width: '100%' }} elevation={1}>
              <Typography variant="caption" component="div" sx={{ mb: 1, fontWeight: 'medium' }}>
                Mode change history:
              </Typography>
              {modeChanges.map((change, idx) => (
                <Typography key={idx} variant="caption" component="div" sx={{ fontSize: '0.75rem' }}>
                  {change.timestamp}: Changed to <strong>{change.mode}</strong> mode
                </Typography>
              ))}
            </Paper>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.7, display: 'block', textAlign: 'center' }}>
              The toggle automatically switches to compact mode on small screens.<br/>
              Try clicking between modes and resizing the viewport.
            </Typography>
          </Box>
        </Paper>
        
        <Paper sx={{ p: 2, width: '100%' }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Key Responsive Features:</Typography>
          <Box component="ul" sx={{ pl: 2, fontSize: '0.75rem', m: 0 }}>
            <li>Automatically adapts to viewport size</li>
            <li>Compact mode for mobile screens (smaller text and padding)</li>
            <li>Maintains touch-friendly target sizes</li>
            <li>Preserves visual distinction between options</li>
            <li>Consistent state management across form factors</li>
          </Box>
        </Paper>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the toggle adapts to different screen sizes using the compact prop and tracks interaction state. Shows responsive design in action with state management that persists across viewport changes.',
      },
    },
  },
};

// Theme variation demonstration
export const ThemeVariations: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
  },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '500px' }}>
      <Typography variant="h6" gutterBottom>Theme Integration</Typography>
      
      <Paper sx={{ p: 3 }} elevation={2}>
        <Typography variant="body2" paragraph>
          The AgentToggle integrates with the application's theme system and adapts its appearance to both light and dark modes. Colors, contrasts, and visual treatment are optimized for each theme variant.
        </Typography>
        
        <Stack spacing={2}>
          <Typography variant="subtitle2" gutterBottom>Key Theme Integration Features:</Typography>
          <Box component="ul" sx={{ pl: 2, fontSize: '0.875rem' }}>
            <li>Automatic adaptation to light/dark mode</li>
            <li>Maintains proper contrast ratios in both themes</li>
            <li>Uses theme-defined colors for consistency</li>
            <li>Optimized shadows and elevation for each theme</li>
            <li>Accessible in both light and dark environments</li>
          </Box>
        </Stack>
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.9)', borderRadius: 2, width: '100%', display: 'flex', justifyContent: 'center' }} elevation={3}>
            <AgentToggle mode="standard" onToggle={() => {}} />
          </Paper>
          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>Dark Theme</Typography>
          <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'center' }}>
            Higher contrast with lighter text
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
          <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 2, width: '100%', display: 'flex', justifyContent: 'center', border: '1px solid rgba(0, 0, 0, 0.1)' }} elevation={1}>
        <AgentToggle mode="standard" onToggle={() => {}} />
          </Paper>
          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>Light Theme</Typography>
          <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'center' }}>
            Subtle shadows with darker text
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Mode Variants:</Typography>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Standard Mode:</Typography>
              <AgentToggle mode="standard" onToggle={() => {}} />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Multi-Agent Mode:</Typography>
        <AgentToggle mode="multiAgent" onToggle={() => {}} />
            </Box>
          </Stack>
        </Paper>
        
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Compact Variants:</Typography>
          <Stack direction="row" spacing={4} justifyContent="center">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <AgentToggle mode="standard" onToggle={() => {}} compact />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Standard</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <AgentToggle mode="multiAgent" onToggle={() => {}} compact />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Multi-Agent</Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
      
      <Box sx={{ fontSize: '0.8rem', opacity: 0.7, textAlign: 'center', mt: 2 }}>
        Try toggling the theme in Storybook to see how the component adapts
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the toggle\'s theme integration capabilities with various modes and sizes in both light and dark themes. Shows how the component maintains proper contrast, visual hierarchy, and accessibility across theme variants.',
      },
    },
  },
}; 