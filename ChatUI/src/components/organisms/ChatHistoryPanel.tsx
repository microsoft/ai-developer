'use client';

import React from 'react';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Divider, 
  Drawer, 
  IconButton,
  useMediaQuery,
  useTheme as useMuiTheme,
  Tooltip
} from '@mui/material';
import { ChevronLeft, ChevronRight, Menu, History } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { alpha } from '@mui/material/styles';
import { ChatMode } from '@/services/IHistoryService';

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage?: string;
  lastUpdated: Date | string;
  messageCount: number;
  mode: ChatMode;
}

export interface ChatHistoryPanelProps {
  chatHistories: ChatHistory[];
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
  drawerWidth?: number;
}

export const ChatHistoryPanel = ({
  chatHistories,
  activeChatId,
  onSelectChat,
  className = '',
  isOpen = true,
  onToggle,
  variant = 'persistent',
  drawerWidth = 280,
}: ChatHistoryPanelProps) => {
  const { theme: appTheme, isDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isExtraSmallScreen = useMediaQuery('(max-width:360px)');
  
  // Internal open state if no external control is provided
  const [internalOpen, setInternalOpen] = useState(isOpen);
  
  // Use either controlled or uncontrolled open state
  const open = onToggle ? isOpen : internalOpen;
  
  // Handle toggle
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(!internalOpen);
    }
  };
  
  // Get theme colors with fallbacks
  const primaryColor = appTheme?.colors?.primary || '#ff6188'; // Pink
  
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
  
  // Format date to readable string
  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Return proper padding based on screen size
  const getHistoryItemPadding = () => {
    if (isExtraSmallScreen) return { px: 1.5, py: 1 };
    if (isSmallScreen) return { px: 2, py: 1.5 };
    return { px: 3, py: 2 };
  };
  
  // Return the appropriate font size for list items
  const getListItemFontSize = () => {
    if (isExtraSmallScreen) return '0.8125rem'; // 13px
    if (isSmallScreen) return '0.875rem';       // 14px
    return '0.9375rem';                         // 15px
  };
  
  // For the sidebar title
  const getTitleFontSize = () => {
    if (isExtraSmallScreen) return '0.9375rem'; // 15px
    if (isSmallScreen) return '1rem';           // 16px
    return '1.125rem';                          // 18px
  };
  
  // Calculate the drawer width based on screen size
  const getActualDrawerWidth = () => {
    if (isExtraSmallScreen) return drawerWidth * 0.85; // Smaller for very small screens
    if (isSmallScreen) return drawerWidth * 0.9;       // Slightly smaller for small screens
    return drawerWidth;                                // Full size for larger screens
  };
  
  const actualDrawerWidth = getActualDrawerWidth();
  
  // Drawer content
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: isSmallScreen ? 1.5 : 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: isDarkMode ? 'grey.800' : 'grey.200',
      }}>
        <Typography 
          variant={isSmallScreen ? "subtitle1" : "h6"} 
          sx={{ 
            fontWeight: 'medium',
            color: isDarkMode ? 'white' : 'grey.900',
            fontSize: getTitleFontSize(),
          }}
        >
          Chat History
        </Typography>
        <IconButton onClick={handleToggle} size={isSmallScreen ? "small" : "medium"}>
          {open ? (
            <ChevronLeft size={isSmallScreen ? 18 : 20} color={isDarkMode ? '#aaa' : '#666'} />
          ) : (
            <ChevronRight size={isSmallScreen ? 18 : 20} color={isDarkMode ? '#aaa' : '#666'} />
          )}
        </IconButton>
      </Box>
      
      <Divider sx={{ borderColor: isDarkMode ? 'grey.800' : 'grey.200' }} />
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {chatHistories.length === 0 ? (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center',
            color: isDarkMode ? 'grey.400' : 'grey.600',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <History size={32} color={isDarkMode ? '#666' : '#999'} strokeWidth={1.5} style={{ marginBottom: 16, opacity: 0.6 }} />
            <Typography variant="body2" sx={{ maxWidth: '220px', fontSize: getListItemFontSize() }}>
              No chat history yet. Start a conversation to see it here.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', p: 0 }}>
            {chatHistories.map((chat) => (
              <ListItem 
                key={chat.id} 
                disablePadding
                divider
              >
                <ListItemButton
                  selected={chat.id === activeChatId}
                  onClick={() => onSelectChat(chat.id)}
                  sx={{
                    ...getHistoryItemPadding(),
                    borderLeft: chat.id === activeChatId ? 4 : 0,
                    borderColor: primaryColor,
                    '&.Mui-selected': {
                      bgcolor: isDarkMode 
                        ? `rgba(${hexToRgb(primaryColor)}, 0.15)` 
                        : `rgba(${hexToRgb(primaryColor)}, 0.1)`,
                      '&:hover': {
                        bgcolor: isDarkMode 
                          ? `rgba(${hexToRgb(primaryColor)}, 0.2)` 
                          : `rgba(${hexToRgb(primaryColor)}, 0.15)`,
                      }
                    }
                  }}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography 
                        component="div"
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 'medium',
                          color: isDarkMode ? 'white' : 'grey.900', 
                          fontSize: getListItemFontSize(),
                        }}
                      >
                        {chat.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography 
                          component="div"
                          variant="body2" 
                          sx={{ 
                            color: isDarkMode ? 'grey.400' : 'grey.700',
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                            fontSize: getListItemFontSize(),
                          }}
                        >
                          {chat.lastMessage || `${chat.messageCount} messages`}
                        </Typography>
                        <Typography 
                          component="div"
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            mt: 0.5,
                            color: isDarkMode ? 'grey.500' : 'grey.600',
                            fontSize: isSmallScreen ? '0.7rem' : '0.75rem',
                          }}
                        >
                          {formatDate(chat.lastUpdated)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );

  // Toggle button to show when drawer is closed
  const toggleButton = !open && (
    <Tooltip title="Open History Panel" placement="right">
      <IconButton
        onClick={handleToggle}
        size="small"
        aria-label="open history panel"
        sx={{
          position: 'absolute',
          left: 10,
          top: 16,
          bgcolor: isDarkMode ? 'grey.800' : 'white',
          color: isDarkMode ? 'grey.300' : 'grey.700',
          boxShadow: 2,
          zIndex: 1199, // Just below drawer's z-index
          p: 1.5,
          ml: 1,
          '&:hover': {
            bgcolor: isDarkMode ? 'grey.700' : 'grey.100',
            color: isDarkMode ? 'white' : 'grey.900',
          }
        }}
      >
        <Menu size={20} />
      </IconButton>
    </Tooltip>
  );
  
  return (
    <>
      <Drawer
        className={className}
        variant={variant}
        open={open}
        onClose={handleToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          width: actualDrawerWidth,
          flexShrink: 0,
          zIndex: 1200,
          position: 'absolute',
          '& .MuiDrawer-paper': {
            top: 64, // Header height
            height: 'calc(100% - 64px)',
            width: actualDrawerWidth,
            boxSizing: 'border-box',
            boxShadow: 'none',
            bgcolor: isDarkMode ? 'grey.900' : 'background.paper',
            borderRight: (theme) =>
              `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.12) : theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      {toggleButton}
    </>
  );
}; 