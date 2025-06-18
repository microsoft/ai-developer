'use client';

import React from 'react';
import { MessageSquare, Bot } from 'lucide-react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';

export type AgentMode = 'standard' | 'multiAgent';

export interface AgentToggleProps {
  mode: AgentMode;
  onToggle: (mode: AgentMode) => void;
  compact?: boolean;
  className?: string;
}

export const AgentToggle = ({
  mode = 'standard',
  onToggle,
  compact = false,
  className = '',
}: AgentToggleProps) => {
  const { theme, isDarkMode } = useTheme();
  
  // Debug mode to see theme changes
  useEffect(() => {
    console.log('AgentToggle theme changed:', { isDarkMode, theme: theme?.colors });
  }, [isDarkMode, theme]);
  
  // Helper function to convert hex to rgb
  function hexToRgb(hex: string) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Return as comma-separated string for rgba()
    return `${r}, ${g}, ${b}`;
  }
  
  // Get theme colors with fallbacks - ALIGNED WITH MessageBubble.tsx
  const standardModeColor = theme?.colors?.warning || '#ffd866'; // User message color (Warning/Yellow)
  const secondaryColor = theme?.colors?.secondary || '#78dce8'; // Light blue
  
  // Create semi-transparent colors for button backgrounds
  const chatBgColor = isDarkMode 
    ? `rgba(${hexToRgb(standardModeColor)}, 0.6)` // Use standardModeColor
    : `rgba(${hexToRgb(standardModeColor)}, 0.8)`; // Use standardModeColor
  
  const agentModeBgColor = isDarkMode 
    ? `rgba(${hexToRgb(secondaryColor)}, 0.9)` 
    : `rgba(${hexToRgb(secondaryColor)}, 0.6)`;
  
  const selectedBackgroundColor = mode === 'standard' ? chatBgColor : agentModeBgColor;

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: isDarkMode ? 'grey.800' : 'grey.200',
        borderRadius: '60px',
        p: compact ? 0.5 : 0.75,
      }}
    >
      <Tooltip title="Standard chat">
        <Button
          variant="text"
          onClick={() => onToggle('standard')}
          aria-label="Standard chat mode"
          sx={{
            borderRadius: '50px',
            p: compact ? '4px 8px' : '6px 12px',
            minWidth: 'auto',
            bgcolor: mode === 'standard' ? selectedBackgroundColor : 'transparent',
            color: isDarkMode ? 'white' : 'black',
            '&:hover': {
              bgcolor: mode === 'standard' 
                ? selectedBackgroundColor 
                : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
            // Transition for smooth hover/selection effect
            transition: 'background-color 0.2s ease-in-out',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: compact ? 0.5 : 1,
            }}
          >
            <MessageSquare size={compact ? 16 : 18} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: compact ? '0.75rem' : '0.875rem', // Smaller font on compact mode
              }}
            >
              {compact ? 'Chat' : 'Standard'}
            </Typography>
          </Box>
        </Button>
      </Tooltip>
      <Tooltip title="Multi-agent chat">
        <Button
          variant="text"
          onClick={() => onToggle('multiAgent')}
          aria-label="Multi-agent chat mode"
          sx={{
            borderRadius: '50px',
            p: compact ? '4px 8px' : '6px 12px',
            minWidth: 'auto',
            bgcolor: mode === 'multiAgent' ? selectedBackgroundColor : 'transparent',
            color: isDarkMode ? 'white' : 'black',
            '&:hover': {
              bgcolor: mode === 'multiAgent' 
                ? selectedBackgroundColor 
                : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
            // Transition for smooth hover/selection effect
            transition: 'background-color 0.2s ease-in-out',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: compact ? 0.5 : 1,
            }}
          >
            <Bot size={compact ? 16 : 18} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: compact ? '0.75rem' : '0.875rem', // Smaller font on compact mode
              }}
            >
              {compact ? 'Agents' : 'Multi-agent'}
            </Typography>
          </Box>
        </Button>
      </Tooltip>
    </Box>
  );
}; 