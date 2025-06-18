'use client';

import { Box, Typography, AppBar, Toolbar, Tooltip, IconButton } from '@mui/material';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { AgentToggle, AgentMode } from '@/components/molecules/AgentToggle';
import { useTheme } from '@/context/ThemeContext';
import { useChatContext } from '@/context/ChatContext';
import { Plus, Eye, EyeOff } from 'lucide-react';
import { getAppName } from '@/utils/environment';

export interface ChatHeaderProps {
  agentMode: AgentMode;
  onAgentModeToggle: (mode: AgentMode) => void;
  onNewChat: () => void;
  className?: string;
  drawerOpen?: boolean;
  drawerWidth?: number;
  isSmallScreen?: boolean;
  isExtraSmallScreen?: boolean;
}

/**
 * Simple function to find the first uppercase letter after position 0
 * Returns -1 if no uppercase letter is found after position 0
 */
const findSecondWordStart = (text: string): number => {
  if (!text || text.length <= 1) return -1;
  
  // Start from index 1 (second character)
  for (let i = 1; i < text.length; i++) {
    if (text[i] >= 'A' && text[i] <= 'Z') {
      return i;
    }
  }
  
  return -1;
};

export const ChatHeader = ({
  agentMode,
  onAgentModeToggle,
  onNewChat,
  className = '',
  drawerOpen = false,
  drawerWidth = 280,
  isSmallScreen = false,
  isExtraSmallScreen = false,
}: ChatHeaderProps) => {
  // Get theme directly from context - this ensures we react to theme changes
  const { theme, isDarkMode } = useTheme();
  // Get tool message state from ChatContext
  const { showToolMessages, toggleToolMessageVisibility } = useChatContext();
  
  // Use theme colors with fallbacks - directly within render to ensure reactivity
  const primaryColor = theme?.colors?.primary || '#ff6188';
  
  // Get application name from environment variables
  const appName = getAppName();
  
  // Parse app name to color by uppercase letters
  const renderAppName = () => {
    const appNameValue = appName || 'ChatUI';
    
    // Check if it's the default value
    if (appNameValue === 'ChatUI') {
      return (
        <>
          <Box component="span" sx={{ color: primaryColor }}>Chat</Box>
          <Box component="span">UI</Box>
        </>
      );
    }
    
    // For custom app names
    const secondWordIndex = findSecondWordStart(appNameValue);
    
    if (secondWordIndex === -1) {
      // No second word found, color the whole thing
      return <Box component="span" sx={{ color: primaryColor }}>{appNameValue}</Box>;
    }
    
    // Split into two parts and color accordingly
    const firstPart = appNameValue.substring(0, secondWordIndex);
    const secondPart = appNameValue.substring(secondWordIndex);
    
    return (
      <>
        <Box component="span" sx={{ color: primaryColor }}>{firstPart}</Box>
        <Box component="span">{secondPart}</Box>
      </>
    );
  };
  
  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1}
      className={className}
      sx={{
        borderBottom: 1,
        borderColor: isDarkMode ? 'grey.800' : 'grey.200',
        bgcolor: isDarkMode ? 'grey.900' : 'white',
        width: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar 
        sx={{ 
          px: { xs: 2, sm: 4, md: 6 }, // Responsive padding
          py: { xs: 1.5, sm: 2 },      // Smaller padding on small screens
          width: '100%',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isExtraSmallScreen ? 2 : isSmallScreen ? 3 : 6, // Reduce gap on small screens
          }}
        >
          <Typography 
            variant="h6" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: isDarkMode ? 'white' : 'grey.900',
              fontSize: isExtraSmallScreen ? '1rem' : isSmallScreen ? '1.125rem' : '1.25rem', // Smaller font on small screens
            }}
            suppressHydrationWarning
          >
            {renderAppName()}
          </Typography>
          <AgentToggle 
            mode={agentMode} 
            onToggle={onAgentModeToggle} 
            compact={isSmallScreen} // Pass compact prop to make toggle smaller on small screens
          />
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', gap: isSmallScreen ? 1 : 2, alignItems: 'center' }}>
          <Tooltip title="New Chat">
            <IconButton
              onClick={onNewChat}
              aria-label="New Chat"
              size={isSmallScreen ? "small" : "medium"}
              sx={{
                bgcolor: isDarkMode ? 'grey.800' : 'grey.100',
                p: isSmallScreen ? 0.75 : 1,
                '&:hover': {
                  bgcolor: isDarkMode ? 'grey.700' : 'grey.200',
                },
              }}
            >
              <Plus size={isSmallScreen ? 18 : 20} color={primaryColor} />
            </IconButton>
          </Tooltip>
          <Tooltip title={showToolMessages ? "Hide Tool Messages" : "Show Tool Messages"}>
            <IconButton 
              onClick={toggleToolMessageVisibility} 
              size={isSmallScreen ? "small" : "medium"}
              aria-label={showToolMessages ? "Hide tool messages" : "Show tool messages"}
              sx={{ 
                color: theme?.colors?.textSecondary,
                bgcolor: isDarkMode ? 'grey.800' : 'grey.100',
                p: isSmallScreen ? 0.75 : 1,
                '&:hover': {
                  bgcolor: isDarkMode ? 'grey.700' : 'grey.200',
                },
              }}
            >
              {showToolMessages ? <EyeOff size={isSmallScreen ? 18 : 20} /> : <Eye size={isSmallScreen ? 18 : 20} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle theme">
            <Box component="span">
              <ThemeToggle compact={isSmallScreen} />
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 