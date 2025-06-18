# Markdown Support

This document explains how to use and test the markdown formatting capabilities in the ChatUI application.

## Overview

The ChatUI application supports GitHub-Flavored Markdown (GFM) rendering in chat messages from assistant responses. This allows for rich text formatting, including headings, lists, code blocks with syntax highlighting, tables, and more.

## How to Test Markdown Features

### Testing Methods

There are several ways to test the markdown formatting capabilities:

#### 1. Using Direct Trigger Phrases

Type any of these phrases in the chat input box and send:
```
show me markdown formatting
how can I use formatting in messages?
what markdown features are supported?
```

The system will automatically respond with a comprehensive markdown demo showing various formatting options.

#### 2. Exploring Sample Chats

Find these predefined chats in the chat history panel (left sidebar):
- **"Standard: Markdown Demo"** - Shows basic markdown formatting examples
- **"Multi-Agent: Markdown Features"** - Displays how different agents use markdown with their specialized styles

Click on these chats to load them and view the markdown examples.

### Text Size Controls

The application includes text size controls that affect markdown rendering:

1. Look for the "A" (text size) icon in the top-right corner of the chat panel
2. Click it to open the size menu
3. Select from three options:
   - Small
   - Medium (default)
   - Large
4. Observe how the markdown formatting adapts to different text sizes
5. The setting persists between sessions using localStorage

## Supported Markdown Features

The ChatUI supports the following markdown features:

### Text Formatting
- **Bold text**: `**bold**`
- *Italic text*: `*italic*`
- ***Bold and italic***: `***both***`
- ~~Strikethrough~~: `~~strikethrough~~`

### Headings
```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Lists

#### Unordered Lists
```
* Item 1
* Item 2
  * Nested Item 2.1
  * Nested Item 2.2
* Item 3
```

#### Ordered Lists
```
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item
```

### Code

#### Inline Code
```
`const greeting = "Hello, World!";`
```

#### Code Blocks
````
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

// Call the function
console.log(greet('User'));
```
````

### Blockquotes
```
> This is a blockquote.
> 
> It can span multiple lines and include other Markdown elements.
```

### Tables
```
| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | Yes | With multiple levels |
| Lists | Yes | Ordered and unordered |
| Code | Yes | Inline and blocks |
| Tables | Yes | With alignment options |
```

### Task Lists
```
- [x] Completed task
- [ ] Incomplete task
```

### Horizontal Rules
```
---
```

## Implementation Details

The markdown support is implemented using:

- **micromark**: A small, fast, and precise CommonMark-compliant markdown parser
- **micromark-extension-gfm**: Extension for GitHub Flavored Markdown support
- **MarkdownRenderer**: Custom React component for rendering and styling markdown content

Key features of the implementation:

- Text color is set to black (#222) for maximum readability regardless of theme
- Links use a distinct purple color (#9e41c3) to stand out on any background
- Responsive design adapts to different screen sizes and text size preferences
- Scrollbars are hidden while maintaining scrolling functionality

## Styling Considerations

The markdown styling follows these design principles:

- Consistent spacing for better readability
- Proper indentation for nested elements
- Clear visual hierarchy for headings
- Syntax highlighting for code blocks
- Distinct styling for blockquotes and tables
- Accessible link colors with proper contrast

## Usage in Projects

When integrating the ChatUI in your projects, consider:

1. Providing markdown formatting hints to users
2. Ensuring your backend responses use consistent markdown formatting
3. Testing your markdown with different text sizes and themes
4. Providing examples of supported markdown features in your documentation

## Common Issues and Troubleshooting

If markdown is not rendering correctly:

1. Ensure the text contains valid markdown syntax
2. Check that the MarkdownRenderer component is being used
3. Verify the message is being sent through the proper channel
4. Check browser console for any errors related to markdown parsing

## Related Documentation

- [Application Setup Guide](../getting-started.md)
- [Component Architecture](../../architecture/components.md)
- [API Response Format](../../api/responses.md) 