'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as AppThemeProvider, useTheme } from '@/context/ThemeContext';

// Default fallback colors for MUI theme
const DEFAULT_COLORS = {
  primary: '#ff6188',
  secondary: '#78dce8',
  info: '#fc9867',
  success: '#a9dc76',
  warning: '#ffd866',
  danger: '#fc9867',
  background: '#2d2a2e',
  surface: '#221f22',
  text: '#fcfcfa',
  textSecondary: '#939293',
};

interface MuiThemeWrapperProps {
  children: ReactNode;
}

// Helper function to get computed value of a CSS variable
const getCssVariableValue = (variableName: string): string => {
  if (typeof window === 'undefined') {
    // Provide fallback colors for SSR
    const fallbacks: Record<string, string> = {
      '--color-primary': DEFAULT_COLORS.primary,
      '--color-secondary': DEFAULT_COLORS.secondary,
      '--color-info': DEFAULT_COLORS.info,
      '--color-success': DEFAULT_COLORS.success,
      '--color-warning': DEFAULT_COLORS.warning,
      '--color-danger': DEFAULT_COLORS.danger,
      '--color-background': DEFAULT_COLORS.background,
      '--color-surfaceBackground': DEFAULT_COLORS.surface,
      '--color-textPrimary': DEFAULT_COLORS.text,
      '--color-textSecondary': DEFAULT_COLORS.textSecondary,
    };
    return fallbacks[variableName] || '#000000';
  }
  
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim() || '#000000';
};

// This component wraps the MUI ThemeProvider with our application's theme context
const MuiThemeWrapper: React.FC<MuiThemeWrapperProps> = ({ children }) => {
  const { theme, isDarkMode } = useTheme();
  // Track client-side rendering for hydration safety
  const [mounted, setMounted] = useState(false);
  
  const [themeColors, setThemeColors] = useState({
    primary: DEFAULT_COLORS.primary,
    secondary: DEFAULT_COLORS.secondary,
    info: DEFAULT_COLORS.info,
    success: DEFAULT_COLORS.success,
    warning: DEFAULT_COLORS.warning,
    danger: DEFAULT_COLORS.danger,
    background: DEFAULT_COLORS.background,
    surface: DEFAULT_COLORS.surface,
    text: DEFAULT_COLORS.text,
    textSecondary: DEFAULT_COLORS.textSecondary,
  });
  
  // Set mounted to true when component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Update color values when theme changes
  useEffect(() => {
    if (!mounted) return; // Skip during SSR
    
    try {
      // Get direct values from our theme context with fallbacks
      const primary = theme?.colors?.primary || DEFAULT_COLORS.primary;
      const secondary = theme?.colors?.secondary || DEFAULT_COLORS.secondary;
      const info = theme?.colors?.info || DEFAULT_COLORS.info;
      const success = theme?.colors?.success || DEFAULT_COLORS.success;
      const warning = theme?.colors?.warning || DEFAULT_COLORS.warning;
      const danger = theme?.colors?.danger || DEFAULT_COLORS.danger;
      const background = theme?.colors?.background || DEFAULT_COLORS.background;
      const surface = theme?.colors?.surfaceBackground || DEFAULT_COLORS.surface;
      const text = theme?.colors?.textPrimary || DEFAULT_COLORS.text;
      const textSecondary = theme?.colors?.textSecondary || DEFAULT_COLORS.textSecondary;
      
      setThemeColors({
        primary, 
        secondary,    
        info,
        success,
        warning,
        danger,
        background,
        surface,
        text,
        textSecondary,
      });
    } catch (error) {
      console.error('Error updating MUI theme colors:', error);
    }
  }, [theme, isDarkMode, mounted]);
  
  // Create Material UI theme with actual color values
  const muiTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: themeColors.primary,
      },
      secondary: {
        main: themeColors.secondary,
      },
      info: {
        main: themeColors.info,
      },
      success: {
        main: themeColors.success,
      },
      warning: {
        main: themeColors.warning,
      },
      error: {
        main: themeColors.danger,
      },
      background: {
        default: themeColors.background,
        paper: themeColors.surface,
      },
      text: {
        primary: themeColors.text,
        secondary: themeColors.textSecondary,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            color: '#ffffff',
          },
        },
      },
    },
  });

  // During SSR and initial client render, use a minimal wrapper to prevent hydration mismatches
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

// Combined ThemeProvider that includes both our app's theme and MUI theme
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AppThemeProvider>
      <MuiThemeWrapper>
        {children}
      </MuiThemeWrapper>
    </AppThemeProvider>
  );
}; 