import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Box } from '@mui/material';
import { ThemeProvider } from '../providers/ThemeProvider';

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'Atoms/MarkdownRenderer',
  component: MarkdownRenderer,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [],
      },
      options: {},
    },
    docs: {
      description: {
        component:
          'Renders Markdown content into HTML using micromark with GFM extensions. Adapts styling based on the current theme (light/dark) and offers text size control.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Markdown content to render',
    },
    textSize: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the rendered text',
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of the container',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderer>;

/**
 * Basic markdown rendering with default settings.
 */
export const Default: Story = {
  args: {
    content: `# Markdown Example
    
This is a paragraph with **bold** and *italic* text.

* List item 1
* List item 2
* List item 3

[Link to example.com](https://example.com)`,
    textSize: 'medium',
  },
};

/**
 * Example showing heading styles in markdown.
 */
export const Headings: Story = {
  args: {
    content: `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`,
    textSize: 'medium',
    maxWidth: '600px',
  },
};

/**
 * Example showing text formatting in markdown.
 */
export const TextFormatting: Story = {
  args: {
    content: `**This text is bold**

*This text is italic*

***This text is bold and italic***

~~This text is strikethrough~~

This text has \`inline code\` formatting.

> This is a blockquote
> 
> It can span multiple lines`,
    textSize: 'medium',
    maxWidth: '600px',
  },
};

/**
 * Example showing lists in markdown.
 */
export const Lists: Story = {
  args: {
    content: `## Unordered List
* Item 1
* Item 2
  * Nested item 2.1
  * Nested item 2.2
* Item 3

## Ordered List
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item

## Task List
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task`,
    textSize: 'medium',
    maxWidth: '600px',
  },
};

/**
 * Example showing code blocks in markdown.
 */
export const CodeBlocks: Story = {
  args: {
    content: `## Inline Code
Use the \`console.log()\` function to debug.

## Code Block
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Hello, \${name}!\`;
}

// Call the function
greet('World');
\`\`\``,
    textSize: 'medium',
    maxWidth: '600px',
  },
};

/**
 * Example showing tables in markdown.
 */
export const Tables: Story = {
  args: {
    content: `## Simple Table

| Name | Role | Department |
|------|------|------------|
| John | Developer | Engineering |
| Lisa | Designer | Design |
| Mike | Manager | Administration |

## Table with Alignment

| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|---------------:|
| Content      | Content        | Content        |
| Cell         | Cell           | Cell           |`,
    textSize: 'medium',
    maxWidth: '600px',
  },
};

/**
 * Example showing different text sizes.
 */
export const TextSizes: Story = {
  render: (args) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <h3>Small Text Size</h3>
        <MarkdownRenderer {...args} textSize="small" />
      </div>
      <div>
        <h3>Medium Text Size (Default)</h3>
        <MarkdownRenderer {...args} textSize="medium" />
      </div>
      <div>
        <h3>Large Text Size</h3>
        <MarkdownRenderer {...args} textSize="large" />
      </div>
    </Box>
  ),
  args: {
    content: `# Markdown Example
    
This is a paragraph with **bold** and *italic* text.

* List item 1
* List item 2
* List item 3

\`\`\`javascript
console.log('Hello, world!');
\`\`\``,
    maxWidth: '600px',
  },
};

/**
 * Example showing responsive behavior.
 */
export const Responsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  args: {
    content: `# Mobile Optimized

This component adapts to different screen sizes.

* Lists have adjusted padding
* Font sizes are smaller
* Code blocks have less padding

\`\`\`javascript
// Responsive code block
function isSmallScreen() {
  return window.innerWidth < 600;
}
\`\`\`

> Blockquotes are also optimized for small screens

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Padding | Less | More |
| Font size | Smaller | Larger |
| Max width | 100% | Configurable |`,
    textSize: 'medium',
    maxWidth: '100%',
  },
};

/**
 * Example showing light/dark theme adaptation.
 */
export const ThemeAdaptation: Story = {
  render: (args) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <p>The component automatically adapts to the current theme.</p>
        <p>Try toggling between light and dark mode using the theme control in the toolbar.</p>
        <MarkdownRenderer {...args} />
      </div>
    </Box>
  ),
  args: {
    content: `# Theme Adaptation

This component adapts to the current theme (light/dark):

* Text colors change
* Background colors for code blocks change
* Link colors adapt to the theme
* Table borders adjust

\`\`\`javascript
// Theme-aware code block
function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}
\`\`\`

> Blockquotes adapt their styling to the current theme

| Element | Light Theme | Dark Theme |
|---------|-------------|------------|
| Text | Dark gray | Light gray/white |
| Code block bg | Light gray | Dark gray |
| Links | Theme secondary | Theme secondary |`,
    textSize: 'medium',
    maxWidth: '600px',
  },
};

/**
 * Example showing comprehensive markdown features.
 */
export const Comprehensive: Story = {
  args: {
    content: `# Comprehensive Markdown Example

## Text Formatting
**Bold text** and *italic text* or ***both***. 
~~Strikethrough text~~ is also supported.

## Links
[External link](https://example.com)

## Lists
### Unordered
* Item 1
* Item 2
  * Nested item
  * Another nested item
* Item 3

### Ordered
1. First item
2. Second item
   1. Nested numbered item
   2. Another nested numbered item
3. Third item

### Task List
- [x] Completed task
- [ ] Pending task
- [ ] Another task

## Code
Inline \`code\` and code blocks:

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Call the function
console.log(greet('World'));
\`\`\`

## Blockquotes
> This is a blockquote.
> 
> It can have multiple paragraphs.

## Tables
| Feature | Description | Support |
|---------|-------------|---------|
| Headers | Title text | ✅ |
| Paragraphs | Regular text | ✅ |
| Lists | Ordered & unordered | ✅ |
| Code | Blocks & inline | ✅ |
| Tables | Data in rows & columns | ✅ |

## Horizontal Rule

---

## Images
Images are also supported but not included in this example.`,
    textSize: 'medium',
    maxWidth: '700px',
  },
}; 