'use client';

import { MessageSquare, Bot, Loader2 } from 'lucide-react';
import { Box, Typography, CircularProgress, SxProps, Theme, Fade } from '@mui/material';
import { ChatInput } from '@/components/molecules/ChatInput';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { useTheme } from '@/context/ThemeContext';

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

export interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
  agentMode: AgentMode;
  isLoading?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export const ChatInputArea = ({
  onSendMessage,
  agentMode,
  isLoading = false,
  className = '',
  sx = {},
}: ChatInputAreaProps) => {
  // Get theme directly from context to ensure reactivity to theme changes
  const { theme, isDarkMode } = useTheme();
  
  // Get theme colors with fallbacks
  const warningColor = theme?.colors?.warning || '#ffd866'; // Yellow/orange
  const secondaryColor = theme?.colors?.secondary || '#78dce8'; // Light blue
  
  // Create semi-transparent colors for icons - calculated on each render
  const chatBgColor = isDarkMode 
    ? `rgba(${hexToRgb(warningColor)}, 0.9)` 
    : `rgba(${hexToRgb(warningColor)}, 0.5)`;
  
  const agentModeBgColor = isDarkMode 
    ? `rgba(${hexToRgb(secondaryColor)}, 0.9)` 
    : `rgba(${hexToRgb(secondaryColor)}, 0.5)`;
  
  return (
    <Box
      className={className}
      sx={{
        borderTop: 1, 
        borderColor: isDarkMode ? 'grey.800' : 'grey.200',
        bgcolor: isDarkMode ? 'grey.900' : 'white', 
        p: 2,
        width: '100%',
        ...sx
      }}
    >
      <Box sx={{ maxWidth: '1200px', width: '100%', px: { xs: 1, sm: 2, md: 4 }, mx: 'auto' }}>
        <Box sx={{ 
          mb: 1.5, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          fontSize: '0.75rem',
          fontWeight: 'medium',
          color: isDarkMode ? 'grey.400' : 'grey.600'
        }}>
          {agentMode === 'standard' ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: chatBgColor,
                }}
              >
                <MessageSquare size={12} color="#222" />
              </Box>
              <Typography variant="caption" fontWeight="medium">
                Using standard chat mode
              </Typography>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: agentModeBgColor,
                }}
              >
                <Bot size={12} color="#222" />
              </Box>
              <Typography variant="caption" fontWeight="medium">
                Using multi-agent mode
              </Typography>
            </>
          )}
          {isLoading && (
            <Fade in={isLoading} timeout={300}>
              <Box sx={{ 
                ml: 'auto', 
                display: 'inline-flex', 
                alignItems: 'center',
                color: agentMode === 'standard' ? chatBgColor : agentModeBgColor,
                py: 0.5,
                px: 1,
                borderRadius: 1,
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
              }}>
                <Loader2 
                  size={14} 
                  className="animate-spin" 
                  style={{ marginRight: '6px' }} 
                />
                <Typography variant="caption" fontWeight="medium">
                  {agentMode === 'standard' ? 'Processing your request...' : 'Agents are thinking...'}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isLoading}
          placeholder={isLoading ? 'Waiting for response...' : `Type your message...`}
        />
        {isLoading && (
          <Fade in={isLoading} timeout={500}>
            <Box sx={{
              mt: 1,
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: isDarkMode ? 'grey.500' : 'grey.600',
                  fontSize: '0.7rem',
                  fontStyle: 'italic',
                }}
              >
                {agentMode === 'standard' 
                  ? 'The assistant is preparing your response...' 
                  : 'Multiple AI agents are collaborating on your request...'}
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}; 