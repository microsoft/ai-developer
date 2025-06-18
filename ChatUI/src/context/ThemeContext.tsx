'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import darkThemeVSCode from '../themes/DarkTheme.json';
import lightThemeVSCode from '../themes/LightTheme.json';

// Default fallback colors if the theme import fails
const DEFAULT_THEME = {
  colors: {
    primary: '#ff6188',
    secondary: '#78dce8',
    success: '#a9dc76',
    info: '#78dce8',
    warning: '#ffd866',
    danger: '#fc9867',
    background: '#2d2a2e',
    surfaceBackground: '#221f22',
    surfaceForeground: '#fcfcfa',
    textPrimary: '#fcfcfa',
    textSecondary: '#939293',
    borderColor: '#727072',
    disabledBackground: '#403e41',
    disabledText: '#727072',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: '16px',
    fontWeight: {
      normal: '400',
      bold: '600'
    }
  }
};

// Create a simplified theme that maps VS Code theme colors to our application's needs
type SimplifiedTheme = typeof DEFAULT_THEME;

// Map VS Code theme to our simplified theme
const mapVSCodeThemeToSimplified = (vsCodeTheme: typeof darkThemeVSCode): SimplifiedTheme => {
  try {
    const colors = vsCodeTheme.colors || {};
    
    return {
      colors: {
        primary: colors["badge.background"] || DEFAULT_THEME.colors.primary,
        secondary: colors["editorBracketHighlight.foreground5"] || DEFAULT_THEME.colors.secondary,
        success: colors["editorGutter.addedBackground"] || DEFAULT_THEME.colors.success,
        info: colors["editorGutter.modifiedBackground"] || DEFAULT_THEME.colors.info,
        warning: colors["editorWarning.foreground"] || DEFAULT_THEME.colors.warning,
        danger: colors["editorError.foreground"] || DEFAULT_THEME.colors.danger,
        background: colors["editor.background"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.background : '#fafafa'),
        surfaceBackground: colors["sideBar.background"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.surfaceBackground : '#ffffff'),
        surfaceForeground: colors["foreground"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.surfaceForeground : '#2c292d'),
        textPrimary: colors["foreground"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.textPrimary : '#2c292d'),
        textSecondary: colors["descriptionForeground"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.textSecondary : '#727072'),
        borderColor: colors["activityBar.border"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.borderColor : '#cccccc'),
        disabledBackground: colors["editorWidget.background"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.disabledBackground : '#e6e6e6'),
        disabledText: colors["editorWhitespace.foreground"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.disabledText : '#a0a0a0'),
      },
      typography: DEFAULT_THEME.typography
    };
  } catch (error) {
    console.error('Error mapping VS Code theme:', error);
    return DEFAULT_THEME;
  }
};

// Safely create the dark and light themes
let darkTheme: SimplifiedTheme;
let lightTheme: SimplifiedTheme;

try {
  darkTheme = mapVSCodeThemeToSimplified(darkThemeVSCode);
  lightTheme = mapVSCodeThemeToSimplified(lightThemeVSCode);
} catch (error) {
  console.error('Error creating themes:', error);
  darkTheme = DEFAULT_THEME;
  lightTheme = { 
    ...DEFAULT_THEME,
    colors: {
      ...DEFAULT_THEME.colors,
      background: '#fafafa',
      surfaceBackground: '#ffffff',
      surfaceForeground: '#2c292d',
      textPrimary: '#2c292d',
      textSecondary: '#727072',
      borderColor: '#cccccc',
      disabledBackground: '#e6e6e6',
      disabledText: '#a0a0a0',
    }
  };
}

// Create theme context type
type ThemeContextType = {
  theme: SimplifiedTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  // Optional prop to override the default theme (used by Storybook)
  _storybook_isDarkMode?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children,
  _storybook_isDarkMode
}) => {
  // Check if we're in Storybook by looking for its classes on the body
  const detectStorybookDarkMode = () => {
    if (typeof window !== 'undefined') {
      // Check if we're in Storybook by looking for the 'sb-show-main' class
      const isInStorybook = document.body.classList.contains('sb-show-main');
      
      if (isInStorybook) {
        // Check if dark mode is active in Storybook
        return document.body.classList.contains('sb-theme-dark');
      }
    }
    // Default if not in Storybook or can't detect
    return typeof _storybook_isDarkMode !== 'undefined' ? _storybook_isDarkMode : true;
  };

  // Initialize with the detected value
  const [isDarkMode, setIsDarkMode] = useState(detectStorybookDarkMode());
  
  // Add a listener for Storybook theme changes
  useEffect(() => {
    const handleStorybookThemeChange = () => {
      const isInStorybook = document.body.classList.contains('sb-show-main');
      if (isInStorybook) {
        const isDark = document.body.classList.contains('sb-theme-dark');
        setIsDarkMode(isDark);
      }
    };

    // Set up a mutation observer to watch for class changes on the body
    if (typeof window !== 'undefined' && document.body.classList.contains('sb-show-main')) {
      const observer = new MutationObserver(handleStorybookThemeChange);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      
      return () => observer.disconnect();
    }
  }, []);

  // Update isDarkMode if the override prop changes
  useEffect(() => {
    if (typeof _storybook_isDarkMode !== 'undefined') {
      setIsDarkMode(_storybook_isDarkMode);
    }
  }, [_storybook_isDarkMode]);

  // Set theme based on current dark mode state
  const [theme, setTheme] = useState<SimplifiedTheme>(isDarkMode ? darkTheme : lightTheme);

  // Toggle between dark and light modes
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Update theme when isDarkMode changes
  useEffect(() => {
    // First update the theme state based on the current mode
    setTheme(isDarkMode ? darkTheme : lightTheme);
    
    // Then apply the updated theme's colors to CSS variables
    const currentTheme = isDarkMode ? darkTheme : lightTheme;
    
    try {
      // Apply theme colors to CSS variables
      Object.entries(currentTheme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      });

      // Apply other theme properties
      document.documentElement.style.setProperty('--font-family', currentTheme.typography.fontFamily);
      document.documentElement.style.setProperty('--font-size', currentTheme.typography.fontSize);
      
      // Add dark mode class to body
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [isDarkMode]); // Only depend on isDarkMode, not theme

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 