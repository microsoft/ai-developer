import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import { Send, Save, ArrowRight, Loader2 } from 'lucide-react';
import { ThemeProvider } from '../providers/ThemeProvider';
import React from 'react';
import { userEvent, within, expect } from '@storybook/test'; // Import testing utilities
import { action } from '@storybook/addon-actions'; // Import action for logging

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Button', // Group under 'Atoms' in Storybook hierarchy
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    // Optional parameter to center the component in the Canvas.
    layout: 'centered',
    // Add accessibility addon parameters
    a11y: {
      element: '#storybook-root', // Optional: Target element for checks
      config: {
        rules: [], // Optional: Configure rules
      },
      options: {}, // Optional: Configure options
    },
    docs: {
      description: {
        component: 'Button component using MUI\'s LoadingButton with custom styling and theme support.',
      },
    },
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['contained', 'outlined', 'text'],
      description: 'Button variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'info', 'warning', 'error', 'success', 'inherit'],
      description: 'Button color based on theme palette',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    children: {
      control: 'text',
      description: 'Button content (node or text)',
    },
    onClick: { action: 'clicked', description: 'Click handler' },
    disabled: { control: 'boolean', description: 'Disable the button' },
    loading: { control: 'boolean', description: 'Show loading indicator' },
    startIcon: { control: 'object', description: 'Icon at the start' },
    endIcon: { control: 'object', description: 'Icon at the end' },
    fullWidth: { control: 'boolean', description: 'Span full width' },
    className: { control: 'text', description: 'Additional CSS classes' },
    sx: { control: 'object', description: 'MUI sx prop for style overrides' },
    loadingPosition: {
      control: { type: 'select' },
      options: ['start', 'end', 'center'],
      description: 'Position of the loading indicator',
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

// Primary Button Story
export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    children: 'Button',
    disabled: false,
    loading: false,
    fullWidth: false,
    onClick: action('primary-clicked'),
  },
  // Add play function for interaction testing
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // Get the button element
    const button = canvas.getByRole('button', { name: /Button/i });
    
    // Simulate user click
    await userEvent.click(button);
    
    // Assertion: Check if the button is still enabled after click (basic check)
    await expect(button).toBeEnabled();
    // Note: The 'action' argType implicitly checks if the handler is called.
  },
};

// Secondary Button Story
export const SecondaryColor: Story = {
  args: {
    ...Primary.args,
    color: 'secondary',
    children: 'Secondary Color',
    onClick: action('secondary-color-clicked'),
  },
};

export const SuccessColor: Story = {
  args: {
    ...Primary.args,
    color: 'success',
    children: 'Success Color',
    onClick: action('success-color-clicked'),
  },
};

export const ErrorColor: Story = {
  args: {
    ...Primary.args,
    color: 'error',
    children: 'Error Color',
    onClick: action('error-color-clicked'),
  },
};

// Outlined Button Story
export const Outlined: Story = {
  args: {
    ...Primary.args,
    variant: 'outlined',
    children: 'Outlined Button',
    onClick: action('outlined-clicked'),
  },
};

export const Text: Story = {
  args: {
    ...Primary.args,
    variant: 'text',
    children: 'Text Button',
    onClick: action('text-clicked'),
  },
};

// Button Size Variants
export const Small: Story = {
  args: {
    ...Primary.args,
    size: 'small',
    children: 'Small Button',
    onClick: action('small-clicked'),
  },
};

export const Large: Story = {
  args: {
    ...Primary.args,
    size: 'large',
    children: 'Large Button',
    onClick: action('large-clicked'),
  },
};

// State Variants
export const Disabled: Story = {
  args: {
    ...Primary.args,
    children: 'Disabled Button',
    disabled: true,
    onClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Disabled Button/i });
    // Assertion: Check if the button is actually disabled
    await expect(button).toBeDisabled();
  },
};

export const Loading: Story = {
  args: {
    ...Primary.args,
    children: 'Loading...',
    loading: true,
    onClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Loading.../i });
    // Assertion: Check for loading indicator (implementation-specific)
    // MUI LoadingButton adds specific classes or structure
    await expect(button.querySelector('.MuiLoadingButton-loadingIndicator')).toBeInTheDocument();
  },
};

// Button with Icons
export const WithStartIcon: Story = {
  args: {
    ...Primary.args,
    children: 'Send',
    startIcon: <Send size={16} />,
    onClick: action('with-start-icon-clicked'),
  },
};

export const WithEndIcon: Story = {
  args: {
    ...Primary.args,
    color: 'secondary',
    children: 'Next',
    endIcon: <ArrowRight size={16} />,
    onClick: action('with-end-icon-clicked'),
  },
};

export const LoadingWithIcon: Story = {
  args: {
    ...Primary.args,
    children: 'Saving',
    loading: true,
    loadingPosition: 'start',
    startIcon: <Save size={16} />,
    onClick: undefined,
  },
};

// Responsive Example
export const FullWidthResponsive: Story = {
  args: {
    ...Primary.args,
    children: 'Full Width Button',
    fullWidth: true,
    onClick: action('full-width-clicked'),
  },
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
  render: (args) => (
    <div style={{ width: '100%', padding: '10px', border: '1px dashed grey' }}>
      <Button {...args} />
    </div>
  ),
};

// Refined Theme Color Integration Example
export const ThemeColorIntegration: Story = {
  args: {
    // Provide default required prop to satisfy types, even if render overrides
    children: 'Theme Buttons',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Contained Variant</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary">Primary</Button>
          <Button variant="contained" color="secondary">Secondary</Button>
          <Button variant="contained" color="success">Success</Button>
          <Button variant="contained" color="error">Error</Button>
          <Button variant="contained" color="warning">Warning</Button>
          <Button variant="contained" color="info">Info</Button>
          <Button variant="contained" color="primary" disabled>Disabled</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Outlined Variant</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="outlined" color="primary">Primary</Button>
          <Button variant="outlined" color="secondary">Secondary</Button>
          <Button variant="outlined" color="success">Success</Button>
          <Button variant="outlined" color="error">Error</Button>
          <Button variant="outlined" color="warning">Warning</Button>
          <Button variant="outlined" color="info">Info</Button>
          <Button variant="outlined" color="primary" disabled>Disabled</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Text Variant</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="text" color="primary">Primary</Button>
          <Button variant="text" color="secondary">Secondary</Button>
          <Button variant="text" color="success">Success</Button>
          <Button variant="text" color="error">Error</Button>
          <Button variant="text" color="warning">Warning</Button>
          <Button variant="text" color="info">Info</Button>
          <Button variant="text" color="primary" disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),
};