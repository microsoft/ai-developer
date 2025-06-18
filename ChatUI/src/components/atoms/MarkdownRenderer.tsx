'use client';

import React from 'react';
import { Box, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  textSize?: 'small' | 'medium' | 'large';
  maxWidth?: string | number;
}

export const MarkdownRenderer = ({
  content,
  className = '',
  textSize = 'medium',
  maxWidth = '100%',
}: MarkdownRendererProps) => {
  const { theme, isDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  
  // Add breakpoint checks for responsive design
  const isXsScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  // Get theme colors and typography with fallbacks
  const fontFamily = theme?.typography?.fontFamily || 'system-ui, sans-serif';
  // Inherit text color from parent (MessageBubble)
  // Use a subtle background for code, slightly different from parent background
  const codeBackground = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
  
  // Process the markdown content with GFM support
  const htmlContent = micromark(content, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()]
  });
  
  // Determine font size based on textSize prop and screen size
  const getFontSize = () => {
    const baseSizes = {
      small: { xs: '0.75rem', default: '0.875rem' },
      medium: { xs: '0.875rem', default: '1rem' },
      large: { xs: '1rem', default: '1.125rem' }
    };
    
    return isXsScreen ? baseSizes[textSize].xs : baseSizes[textSize].default;
  };
  
  // Create CSS for styling the rendered markdown
  const markdownStyles = {
    '& p': { 
      margin: '0.75em 0',
      lineHeight: 1.5,
    },
    '& ul, & ol': { 
      paddingLeft: isXsScreen ? '1.5em' : '2em',
      margin: '0.75em 0',
    },
    '& li': { 
      margin: '0.25em 0',
    },
    '& code': {
      fontFamily: 'monospace',
      backgroundColor: codeBackground,
      padding: '0.2em 0.4em',
      borderRadius: '0.25em',
      fontSize: '0.9em',
    },
    '& pre': {
      backgroundColor: codeBackground,
      padding: isXsScreen ? '0.75em' : '1em',
      borderRadius: '0.5em',
      overflowX: 'auto',
      margin: '1em 0',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      '& code': {
        backgroundColor: 'transparent',
        padding: 0,
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }
    },
    '& blockquote': {
      borderLeft: `3px solid ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}`,
      paddingLeft: '1em',
      margin: '1em 0',
      color: 'rgba(0,0,0,0.7)',
    },
    '& a': {
      color: '#9e41c3',
      textDecoration: 'none',
      fontWeight: 'bold',
      '&:hover': {
        textDecoration: 'underline',
      }
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      margin: '1em 0 0.5em',
      lineHeight: 1.25,
      color: '#000',
    },
    '& h1': { fontSize: isXsScreen ? '1.5em' : '1.75em' },
    '& h2': { fontSize: isXsScreen ? '1.25em' : '1.5em' },
    '& h3': { fontSize: isXsScreen ? '1.1em' : '1.25em' },
    '& img': {
      maxWidth: '100%',
      borderRadius: '0.25em',
    },
    '& table': {
      borderCollapse: 'collapse',
      width: '100%',
      margin: '1em 0',
    },
    '& th, & td': {
      border: `1px solid rgba(0,0,0,0.2)`,
      padding: '0.5em',
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    '& hr': {
      border: 0,
      height: '1px',
      backgroundColor: 'rgba(0,0,0,0.1)',
      margin: '1.5em 0',
    },
    '& .task-list-item': {
      listStyle: 'none',
    },
    '& .task-list-item-checkbox': {
      marginRight: '0.5em',
    },
  };
  
  return (
    <Box
      className={className}
      sx={{
        fontFamily,
        fontSize: getFontSize(),
        // Color is inherited from parent
        maxWidth,
        ...markdownStyles,
      }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}; 