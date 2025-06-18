'use client';

import { useState } from 'react';
import { TextField, Box, IconButton, Tooltip } from '@mui/material';
import { Send } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Default fallback colors - matching our theme
const DEFAULT_PRIMARY = '#ff6188'; // Pink color
const DEFAULT_WARNING = '#ffd866'; // Warning color (yellow/orange)
const DEFAULT_SECONDARY = '#78dce8'; // Secondary color (light blue)
const DEFAULT_DARK_INPUT_BG = 'rgba(255, 255, 255, 0.05)';
const DEFAULT_LIGHT_INPUT_BG = '#ffffff';

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ChatInput = ({
  onSendMessage,
  placeholder = 'Type your message...',
  disabled = false,
  className = '',
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const { theme, isDarkMode } = useTheme();

  // Get theme colors with proper fallbacks
  const primaryColor = theme?.colors?.primary || '#ff6188'; // Pink
  
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

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box className={className} sx={{ width: '100%' }}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          variant="outlined"
          size="medium"
          multiline
          minRows={1}
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.75rem',
              pr: '4rem',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              '& textarea': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                '&::placeholder': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  opacity: 1,
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                  borderWidth: 1,
                }
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&.Mui-focused:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&.Mui-focused.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&:focus-visible .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent !important',
                outline: 'none',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        />
        <Box sx={{ 
          position: 'absolute', 
          right: '0.5rem', 
          bottom: '0.5rem', 
          top: 'auto',
          transform: 'none'
        }}>
          <Tooltip title="Send message (Enter)" placement="top">
            <Box component="span">
              <IconButton
                onClick={handleSendMessage}
                disabled={disabled || !message.trim()}
                aria-label="Send message"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode 
                    ? `rgba(${hexToRgb(primaryColor)}, 0.8)`
                    : primaryColor,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isDarkMode 
                      ? `rgba(${hexToRgb(primaryColor)}, 1)`
                      : `rgba(${hexToRgb(primaryColor)}, 0.9)`,
                  },
                  '&.Mui-disabled': {
                    backgroundColor: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.12)',
                    color: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(0, 0, 0, 0.26)',
                  }
                }}
              >
                <Send size={20} color="white" />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}; 