import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
import './tailwind.css';
import '../src/styles/theme.css';
import { ThemeProvider } from '../src/context/ThemeContext';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import './mockModules'; // Import the mock modules first
import { GlobalStyles } from '@mui/material';
import darkTheme from '../src/themes/DarkTheme.json';
import lightTheme from '../src/themes/LightTheme.json';

// Default values for fallbacks
const defaultFontFamily = 'system-ui, sans-serif';
const defaultFontSize = '16px';
const defaultDarkBackground = '#2d2a2e';
const defaultLightBackground = '#fafafa';
const defaultDarkText = '#fcfcfa';
const defaultLightText = '#2c292d';

// Initialize theme CSS variables at startup
function initializeThemeVariables() {
  try {
    // Apply initial theme colors from Dark theme
    if (darkTheme.colors) {
      Object.entries(darkTheme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      });
    }
    
    // Apply typography settings with safe fallbacks
    document.documentElement.style.setProperty('--font-family', defaultFontFamily);
    document.documentElement.style.setProperty('--font-size', defaultFontSize);
  } catch (error) {
    console.error('Error initializing theme variables:', error);
  }
}

// Simple function to apply theme directly - more reliable than going through context
function applyTheme(isDarkMode: boolean) {
  try {
    const themeData = isDarkMode ? darkTheme : lightTheme;
    
    // Apply theme colors from theme files
    if (themeData.colors) {
      Object.entries(themeData.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      });
    }
    
    // Set appropriate class for the body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    
    // Store current theme in localStorage for persistence
    try {
      localStorage.setItem('storybook-theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {
      console.warn('Failed to store theme preference', e);
    }
  } catch (error) {
    console.error('Error applying theme:', error);
  }
}

// Call initialization
try {
  if (typeof window !== 'undefined') {
    initializeThemeVariables();
    
    // Try to read stored theme preference
    try {
      const storedTheme = localStorage.getItem('storybook-theme');
      if (storedTheme) {
        applyTheme(storedTheme === 'dark');
      }
    } catch (e) {
      console.warn('Failed to read theme preference', e);
    }
  }
} catch (error) {
  console.error('Failed to initialize theme:', error);
}

// Create a mock theme context value to inject directly
const createMockThemeContext = (isDarkMode: boolean) => ({
  theme: isDarkMode ? darkTheme : lightTheme,
  isDarkMode,
  toggleTheme: () => {
    applyTheme(!isDarkMode);
  }
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: darkTheme.colors?.["editor.background"] || defaultDarkBackground },
        { name: 'light', value: lightTheme.colors?.["editor.background"] || defaultLightBackground },
      ],
    },
  },
  // This decorator ensures that all stories are wrapped with the necessary theme providers
  decorators: [
    (Story, context) => {
      // Get the current theme from Storybook's toolbar selection
      const isDarkMode = context.globals.theme === 'dark';
      
      // Apply theme directly - more reliable approach
      React.useEffect(() => {
        applyTheme(isDarkMode);
      }, [isDarkMode]);
      
      // Create a themed container with appropriate context values
      return (
        <div className={`p-4 ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{ 
          backgroundColor: isDarkMode 
            ? (darkTheme.colors?.["editor.background"] || defaultDarkBackground) 
            : (lightTheme.colors?.["editor.background"] || defaultLightBackground),
          color: isDarkMode 
            ? (darkTheme.colors?.["foreground"] || defaultDarkText) 
            : (lightTheme.colors?.["foreground"] || defaultLightText),
          borderRadius: '8px',
          minWidth: '300px',
          transition: 'background-color 0.3s, color 0.3s',
        }}>
          <ThemeProvider>
            <Story />
          </ThemeProvider>
        </div>
      );
    },
  ],
  // Make the theme toggle tool always visible in the toolbar
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        // Position the theme toggle prominently in the toolbar
        icon: 'circlehollow',
        items: [
          { value: 'dark', icon: 'moon', title: 'Dark Mode' },
          { value: 'light', icon: 'sun', title: 'Light Mode' },
        ],
        // Make the toolbar item more visible with a name
        showName: true,
        // Ensure it is always one of the first items in the toolbar
        dynamicTitle: true,
      },
    },
  },
};

export default preview;