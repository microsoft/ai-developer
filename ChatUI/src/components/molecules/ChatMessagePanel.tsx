'use client';

import { Box, Typography, SxProps, Theme, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MessageBubble, Role } from '@/components/molecules/MessageBubble';
import { MessageSquare, Type } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useChatContext } from '@/context/ChatContext';
import { useEffect, useRef, useState } from 'react';

// Define the ToolCall type based on the API response structure
export interface ToolCall {
  id: string;
  pluginName?: string; // Optional based on example
  functionName?: string; // Optional based on example
  arguments?: Record<string, any>; // Use Record<string, any> for flexibility
}

export interface Message {
  id: string;
  content: string;
  role: Role | 'tool'; // Changed 'TOOL' to 'tool'
  timestamp?: string;
  agentIdentifier?: string;
  agentName?: string;
  toolCall?: ToolCall[]; // Optional array of tool calls for ASSISTANT messages
  toolCallId?: string; // Optional ID linking a TOOL message to a call
}

export interface ChatMessagePanelProps {
  messages: Message[];
  className?: string;
  sx?: SxProps<Theme>;
  isLoading?: boolean;
}

// Text size options for UI density control
export type TextSizeOption = 'small' | 'medium' | 'large';

export const ChatMessagePanel = ({
  messages,
  className = '',
  sx = {},
  isLoading = false,
}: ChatMessagePanelProps) => {
  const { theme, isDarkMode } = useTheme();
  const { showToolMessages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState<TextSizeOption>('medium');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Check if a stored preference exists and use it
  useEffect(() => {
    const storedTextSize = localStorage.getItem('chatui-text-size');
    if (storedTextSize && ['small', 'medium', 'large'].includes(storedTextSize)) {
      setTextSize(storedTextSize as TextSizeOption);
    }
  }, []);
  
  // Filter messages based on role and showToolMessages state
  const visibleMessages = messages.filter(message => {
    // Always show user and assistant messages
    if (message.role === 'user' || message.role === 'assistant') {
      return true;
    }
    // Only show tool messages if showToolMessages is true
    if (message.role === 'tool' && showToolMessages) {
      return true;
    }
    // Exclude system messages and hidden tool messages
    return false;
  }).map(message => {
    // Clean up potential agent prefix from assistant messages
    if (message.role === 'assistant') {
      const agentId = message.agentName || message.agentIdentifier;
      if (agentId) {
        const agentPrefix = `[${agentId} Agent] `;
        if (message.content.startsWith(agentPrefix)) {
          return {
            ...message,
            content: message.content.substring(agentPrefix.length)
          };
        }
      }
    }
    return message;
  });
  
  // Function to scroll to the bottom of the chat
  const scrollToBottom = (immediate = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: immediate || isLoading ? 'auto' : 'smooth',
        block: 'end'
      });
    }
  };

  // Add auto-scroll behavior
  useEffect(() => {
    if (visibleMessages.length > 0) {
      scrollToBottom();
    }
  }, [visibleMessages.length, scrollToBottom]);

  // Add resize observer for handling layout changes
  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      if (visibleMessages.length > 0) {
        scrollToBottom();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visibleMessages.length, scrollToBottom]);

  // Add a MutationObserver to detect when new message content is added to the DOM
  // This is particularly helpful for streaming responses where the content changes incrementally
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new MutationObserver(() => {
      if (isLoading) {
        scrollToBottom(true);
      }
    });

    observer.observe(containerRef.current, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });

    return () => observer.disconnect();
  }, [isLoading, scrollToBottom]);
  
  // Handle opening the text size menu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the text size menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle selecting a text size
  const handleSelectTextSize = (size: TextSizeOption) => {
    setTextSize(size);
    localStorage.setItem('chatui-text-size', size);
    handleClose();
  };
  
  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100%', // Change from 100vh to 100% to fit parent container
        width: '100%',
        bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
        overflow: 'hidden',
        position: 'relative',
        ...sx
      }}
    >
      {/* Text size adjustment control */}
      <Box
        sx={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 10,
        }}
      >
        <Tooltip title={`Text Size: ${textSize}`}>
          <IconButton
            onClick={handleClick}
            size="medium"
            aria-controls={open ? 'text-size-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ 
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <Type size={24} color={isDarkMode ? '#fff' : '#000'} />
          </IconButton>
        </Tooltip>
        <Menu
          id="text-size-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'text-size-button',
          }}
        >
          <MenuItem 
            onClick={() => handleSelectTextSize('small')}
            selected={textSize === 'small'}
          >
            Small
          </MenuItem>
          <MenuItem 
            onClick={() => handleSelectTextSize('medium')}
            selected={textSize === 'medium'}
          >
            Medium
          </MenuItem>
          <MenuItem 
            onClick={() => handleSelectTextSize('large')}
            selected={textSize === 'large'}
          >
            Large
          </MenuItem>
        </Menu>
      </Box>

      {visibleMessages.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                height: 80,
                width: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                opacity: 0.6,
              }}
            >
              <MessageSquare 
                size={48} 
                color={isDarkMode ? '#888' : '#555'} 
                strokeWidth={1.5}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 2, color: isDarkMode ? 'white' : 'grey.900' }}>
              No messages yet
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'grey.400' : 'grey.600' }}>
              Start the conversation by typing a message below.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 6, 
            p: 6,
            overflow: 'auto',
            width: '100%', 
            height: '100%',
            maxWidth: '95%',
            mx: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {visibleMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={Object.assign({}, message, { textSize })}
            />
          ))}
          {/* Invisible element for scrolling to the end of messages */}
          <div ref={messagesEndRef} />
        </Box>
      )}
    </Box>
  );
}; 