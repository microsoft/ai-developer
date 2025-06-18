'use client';

import { IconButton } from '@mui/material';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export const ThemeToggle = ({
  className = '',
  compact = false
}: ThemeToggleProps) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  // Get theme colors with fallbacks
  const warningColor = theme?.colors?.warning || '#ffd866'; // Yellow for sun
  const secondaryColor = theme?.colors?.secondary || '#78dce8'; // Blue for moon
  
  const iconSize = compact ? 18 : 20;
  
  return (
    <IconButton
      onClick={toggleTheme}
      className={className}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      sx={{
        bgcolor: 'transparent',
        p: compact ? 0.75 : 1,
        '&:hover': {
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
      }}
      size={compact ? "small" : "medium"}
    >
      {isDarkMode ? (
        <Sun size={iconSize} color={warningColor} />
      ) : (
        <Moon size={iconSize} color={secondaryColor} />
      )}
    </IconButton>
  );
}; 