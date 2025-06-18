'use client';

import { useCallback, useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { ChatHeader } from '@/components/organisms/ChatHeader';
import { ChatHistoryPanel } from '@/components/organisms/ChatHistoryPanel';
import { ChatMessagePanel } from '@/components/molecules/ChatMessagePanel';
import { ChatInputArea } from '@/components/organisms/ChatInputArea';
import { useTheme } from '@/context/ThemeContext';
import { useChatContext } from '@/context/ChatContext';
import { trackComponentRender } from '@/utils/telemetry';
import { getAppName } from '@/utils/environment';

export interface ChatPageLayoutProps {
  className?: string;
}

export const ChatPageLayout = ({
  className = '',
}: ChatPageLayoutProps) => {
  const { 
    messages, 
    chatHistories, 
    activeChatId, 
    agentMode, 
    isLoading,
    sendMessage,
    selectChat,
    setAgentMode,
    createNewChat,
    clearMessages
  } = useChatContext();
  
  const { isDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isExtraSmallMobile = useMediaQuery('(max-width:360px)');
  
  // Add mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  // Set mounted to true after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
    
    // Track component render performance
    const endTracking = trackComponentRender('ChatPageLayout', {
      isMobile,
      isSmallMobile,
      isExtraSmallMobile,
      isDarkMode,
      hasMessages: messages.length > 0,
      hasChatHistories: chatHistories.length > 0
    });
    
    // Clean up tracking when component unmounts
    return endTracking;
  }, []);
  
  // Local state for drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Toggle drawer state
  const toggleDrawer = useCallback(() => {
    setDrawerOpen(prevState => !prevState);
  }, []);

  // Handle chat selection
  const handleSelectChat = useCallback((chatId: string) => {
    selectChat(chatId);
    // In mobile view, close the drawer after selection
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [selectChat, isMobile]);

  // Handle sending a message
  const handleSendMessage = useCallback((content: string) => {
    sendMessage(content);
  }, [sendMessage]);

  // Handle new chat creation
  const handleNewChat = useCallback(() => {
    // Just clear messages and reset activeChatId without creating a new chat
    // The new chat will be created only when the first message is sent
    clearMessages();
    // Ensure drawer is open when starting a new chat if in desktop mode
    if (!isMobile && !drawerOpen) {
      setDrawerOpen(true);
    }
  }, [clearMessages, isMobile, drawerOpen, setDrawerOpen]);

  // Define the drawer width based on screen size
  const getDrawerWidth = () => {
    if (isExtraSmallMobile) return 220;
    if (isSmallMobile) return 250;
    return 280;
  };

  const drawerWidth = getDrawerWidth();

  // If not mounted yet, return empty div to avoid hydration mismatch
  if (!mounted) {
    return <div className={className} style={{ height: '100vh', width: '100%' }} />;
  }

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
        overflow: 'hidden',
      }}
    >
      <ChatHeader 
        agentMode={agentMode} 
        onAgentModeToggle={setAgentMode}
        onNewChat={handleNewChat}
        isSmallScreen={isSmallMobile}
        isExtraSmallScreen={isExtraSmallMobile}
      />
      
      <Box sx={{ position: 'relative', display: 'flex', flexGrow: 1, width: '100%', overflow: 'hidden' }}>
        {/* History Panel will render in its own absolute position */}
        <ChatHistoryPanel 
          chatHistories={chatHistories}
          activeChatId={activeChatId || undefined}
          onSelectChat={handleSelectChat}
          isOpen={drawerOpen}
          onToggle={toggleDrawer}
          variant={isMobile ? 'temporary' : 'persistent'}
          drawerWidth={drawerWidth}
        />
        
        {/* Main content area */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: '100%',
            height: '100%',
            ml: drawerOpen && !isMobile ? `${drawerWidth}px` : 0,
            transition: muiTheme.transitions.create('margin-left', {
              easing: muiTheme.transitions.easing.sharp,
              duration: muiTheme.transitions.duration.leavingScreen,
            }),
            overflow: 'hidden',
          }}
        >
          <ChatMessagePanel 
            messages={messages}
            isLoading={isLoading}
            sx={{
              flexGrow: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 'none',
              mx: 0,
            }}
          />
          
          <ChatInputArea 
            onSendMessage={handleSendMessage} 
            agentMode={agentMode}
            isLoading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
}; 