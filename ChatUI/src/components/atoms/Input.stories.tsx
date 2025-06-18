import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { useState } from 'react';
import { ThemeProvider } from '../providers/ThemeProvider';
import React from 'react';
// Import testing utilities
import { userEvent, within, expect } from '@storybook/test';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Atoms/Input',
  component: Input,
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
      config: {
        rules: [],
      },
      options: {},
    },
    docs: {
      description: {
        component: 'Input component with custom theming support. Displays a text input field with optional label and error message. Supports various input types and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional label text displayed above the input',
    },
    id: {
      control: 'text',
      description: 'HTML ID attribute (auto-generated from label if not provided)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
      description: 'HTML input type attribute',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Input field size - small, medium, or large',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when the input is empty',
    },
    value: {
      control: 'text',
      description: 'Current input value (controlled component)',
    },
    onChange: { 
      action: 'changed',
      description: 'Function called when input value changes',
    },
    onKeyDown: {
      action: 'key pressed',
      description: 'Function called on keydown events',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input field',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the input (shows red border when present)',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

// Basic examples
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    onChange: action('default-changed'),
    onKeyDown: action('default-key-pressed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic input field without a label',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Enter text...');
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, 'Hello');
    await expect(input).toHaveValue('Hello');
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Your Name',
    placeholder: 'John Doe',
    id: 'name-input',
    onChange: action('with-label-changed'),
    onKeyDown: action('with-label-key-pressed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Input field with an associated label',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Your Name');
    await expect(input).toBeInTheDocument();
    await expect(input).toHaveAttribute('id', 'name-input');
    await userEvent.type(input, 'Test');
    await expect(input).toHaveValue('Test');
  },
};

// Size variations
export const Small: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size input',
    size: 'sm',
    onChange: action('small-changed'),
    onKeyDown: action('small-key-pressed'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Small Input');
    await expect(input).toBeInTheDocument();
    // MUI/Tailwind size might be harder to assert directly, focus on interaction
    await userEvent.type(input, 'sm');
    await expect(input).toHaveValue('sm');
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Input',
    placeholder: 'Medium size input',
    size: 'md',
    onChange: action('medium-changed'),
    onKeyDown: action('medium-key-pressed'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Medium Input');
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, 'md');
    await expect(input).toHaveValue('md');
  },
};

export const Large: Story = {
  args: {
    label: 'Large Input',
    placeholder: 'Large size input',
    size: 'lg',
    onChange: action('large-changed'),
    onKeyDown: action('large-key-pressed'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Large Input');
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, 'lg');
    await expect(input).toHaveValue('lg');
  },
};

// State variations
export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
    onChange: action('with-error-changed'),
    onKeyDown: action('with-error-key-pressed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with an error message and red border indicating validation failure',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Email');
    await expect(input).toBeInvalid(); // Assuming error state makes it invalid
    // Check if the error message is displayed
    const errorMessage = canvas.getByText('Please enter a valid email address');
    await expect(errorMessage).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
    // No handlers needed for disabled
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled input that cannot be interacted with',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Disabled Input');
    await expect(input).toBeDisabled();
  },
};

// Input type variations
export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '********',
    onChange: action('password-changed'),
    onKeyDown: action('password-key-pressed'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password');
    await expect(input).toHaveAttribute('type', 'password');
    await userEvent.type(input, 'secret');
    await expect(input).toHaveValue('secret');
  },
};

export const Email: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
    onChange: action('email-changed'),
    onKeyDown: action('email-key-pressed'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Email Address');
    await expect(input).toHaveAttribute('type', 'email');
    await userEvent.type(input, 'test@test.com');
    await expect(input).toHaveValue('test@test.com');
  },
};

export const Number: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    placeholder: '0',
    onChange: action('number-changed'),
    onKeyDown: action('number-key-pressed'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Quantity');
    await expect(input).toHaveAttribute('type', 'number');
    await userEvent.type(input, '123');
    await expect(input).toHaveValue(123); // Note: value might be number or string depending on browser/framework
  },
};

// Interactive example (already has play function)
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      action('interactive-changed')(e); // Log action
      
      // Simple validation example
      if (newValue.length > 0 && newValue.length < 3) {
        setError('Input must be at least 3 characters');
      } else {
        setError('');
      }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      action('interactive-key-pressed')(e);
    };

    return (
      <div style={{ width: '300px' }}>
        <Input
          label="Interactive Input"
          placeholder="Type to see validation"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown} // Pass keydown handler
          error={error}
        />
        <div style={{ marginTop: '8px', fontSize: '14px' }}>
          Current value: {value || '<empty>'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing live validation as you type',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Interactive Input');
    
    // Type less than 3 chars - check error
    await userEvent.type(input, 'ab');
    await expect(input).toHaveValue('ab');
    await expect(canvas.getByText('Input must be at least 3 characters')).toBeInTheDocument();
    
    // Type more chars - check error disappears
    await userEvent.type(input, 'cdef');
    await expect(input).toHaveValue('abcdef');
    await expect(canvas.queryByText('Input must be at least 3 characters')).not.toBeInTheDocument();
  },
};

// Theme integration (no interactions needed, visual test)
export const ThemeIntegration: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input label="Default Input" placeholder="Regular input" />
      <Input label="With Error" placeholder="Error state" error="Something went wrong" />
      <Input label="Disabled Input" placeholder="Disabled state" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how inputs appear with different states. Theme switching (light/dark) is controlled via the Storybook toolbar addon, thanks to the ThemeProvider decorator.',
      },
    },
  },
}; 