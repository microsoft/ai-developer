'use client';

import React from 'react';
import { Avatar, Box, Typography, useMediaQuery, useTheme as useMuiTheme, Paper } from '@mui/material';
import { User, Bot, Terminal, Wrench } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useChatContext } from '@/context/ChatContext';
import { useState, useEffect } from 'react';
import { Message } from './ChatMessagePanel';
import { MarkdownRenderer } from '@/components/atoms/MarkdownRenderer';
import { TextSizeOption } from './ChatMessagePanel';

export type Role = 'user' | 'assistant' | 'system' | 'tool';

export interface MessageBubbleProps {
  message: Message & { textSize?: TextSizeOption };
  className?: string;
}

// Default fallback colors - matching the AgentToggle component colors
const DEFAULT_USER_COLOR = '#ffd866'; // Warning color (yellow/orange) for user avatar
const DEFAULT_ASSISTANT_COLOR = '#78dce8';   // Secondary color (light blue) for assistant avatar
const DEFAULT_TEXT_DARK = '#fcfcfa';
const DEFAULT_TEXT_LIGHT = '#2c292d';
const DEFAULT_TOOL_BG_DARK = 'rgba(80, 80, 80, 0.2)'; // Darker subtle grey
const DEFAULT_TOOL_BG_LIGHT = 'rgba(200, 200, 200, 0.2)'; // Lighter subtle grey

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

// Helper function to adjust hex color brightness
function adjustHexColor(hex: string, amount: number): string {
  try {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));

    const rr = r.toString(16).padStart(2, '0');
    const gg = g.toString(16).padStart(2, '0');
    const bb = b.toString(16).padStart(2, '0');

    return `#${rr}${gg}${bb}`;
  } catch (e) {
    console.error("Failed to adjust hex color:", e);
    return hex; // Return original color on error
  }
}

// Helper function to attempt JSON parsing and pretty-printing
function tryFormatJson(content: string): string {
  try {
    const jsonObject = JSON.parse(content);
    // If parsing succeeds, stringify with indentation
    return JSON.stringify(jsonObject, null, 2);
  } catch (error) {
    // If parsing fails, return the original content
    return content;
  }
}

// Create a map to track agent color assignments and used colors
const agentColorAssignments: Record<string, string> = {};
const usedColors = new Set<string>();
let nextColorIndex = 0;

// Function to get or assign a color for an agent (Restored)
const getAgentColor = (agentName: string, theme: any, userColor: string): string => {
  if (agentColorAssignments[agentName]) {
    return agentColorAssignments[agentName];
  }
  const themeColorPool = [
    theme?.colors?.secondary || '#78dce8',   // Light blue
    theme?.colors?.success || '#a9dc76',     // Green
    theme?.colors?.danger || '#ff6188',      // Red/Pink
    theme?.colors?.info || '#78dce8',        // Light blue variant
    theme?.colors?.primary || '#ff6188',     // Pink/Purple
  ].filter(color => color !== userColor);
  const additionalColors = [
    '#5ad4e6', '#7bd88f', '#fc618d', '#fce566', '#fd9353', 
    '#948ae3', '#ab9df2', '#ff8f7e', '#66d9ef', '#ae81ff',
  ].filter(color => color !== userColor);
  const combinedColorPool = Array.from(new Set([...themeColorPool, ...additionalColors]));

  let color = '';
  for (let i = 0; i < combinedColorPool.length; i++) {
    const candidateColor = combinedColorPool[(nextColorIndex + i) % combinedColorPool.length];
    if (!usedColors.has(candidateColor)) {
      color = candidateColor;
      nextColorIndex = (nextColorIndex + i + 1) % combinedColorPool.length;
      break;
    }
  }
  if (!color) {
    color = combinedColorPool[nextColorIndex % combinedColorPool.length];
    nextColorIndex = (nextColorIndex + 1) % combinedColorPool.length;
  }
  agentColorAssignments[agentName] = color;
  usedColors.add(color);
  return color;
};

export const MessageBubble = ({
  message,
  className = '',
}: MessageBubbleProps) => {
  const { theme, isDarkMode } = useTheme();
  const { showToolMessages } = useChatContext();
  const [timeAgo, setTimeAgo] = useState(message.timestamp || '');
  const muiTheme = useMuiTheme();
  
  const { content, role, agentName, agentIdentifier, textSize = 'medium', toolCall } = message;
  
  // Destructure message props earlier for use in calculations
  const isXsScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(muiTheme.breakpoints.between('sm', 'md'));
  
  // --- Determine message type and agent info (Moved up) ---
  const agentId = agentName || agentIdentifier;
  const userColor = theme?.colors?.info || DEFAULT_USER_COLOR;
  const secondaryColor = theme?.colors?.secondary || DEFAULT_ASSISTANT_COLOR;
  
  const isUserMessage = role === 'user';
  const isToolMessage = role === 'tool';
  const isAssistantPerformingToolCall = role === 'assistant' && toolCall && showToolMessages;

  // Use theme text color primarily, fallback for consistency
  const textColor = theme?.colors?.textPrimary || (isDarkMode ? DEFAULT_TEXT_DARK : DEFAULT_TEXT_LIGHT);
  
  // Determine label text ONLY for assistant messages with an agent ID (and not a tool call indicator)
  const agentLabel = !isUserMessage && !isToolMessage && agentId && !isAssistantPerformingToolCall ? agentId : '';
  
  // Moved hook after all variable declarations that might be used as dependencies
  useEffect(() => {
    setTimeAgo(message.timestamp || '');
  }, [message.timestamp]); // Dependencies remain the same, but variables are declared above

  // --- Conditional Rendering based on Role and Visibility ---
  if (
    role === 'system' || 
    (role === 'tool' && !showToolMessages) ||
    (role === 'assistant' && toolCall && !showToolMessages)
  ) {
    return null;
  }

  let bubbleBgColor = '';
  let avatarBgColor = '';
  let avatarIconColor = '';

  // Helper function to calculate color luminance (brightness)
  function calculateLuminance(hexColor: string): number {
    const rgb = hexToRgb(hexColor).split(',').map(Number);
    return (0.2126 * (rgb[0]/255)) + (0.7152 * (rgb[1]/255)) + (0.0722 * (rgb[2]/255));
  }
  
  // Refined helper to get contrasting text color using fixed light/dark defaults
  const getContrastColor = (bgColor: string, isDarkMode: boolean) => {
    try {
      // Determine if background is light or dark based on luminance
      const luminance = calculateLuminance(bgColor);
      // Choose the default text color that provides better contrast
      return luminance > 0.55 ? DEFAULT_TEXT_LIGHT : DEFAULT_TEXT_DARK;
    } catch (e) {
      // Fallback if luminance calculation fails
      return isDarkMode ? DEFAULT_TEXT_DARK : DEFAULT_TEXT_LIGHT;
    }
  };

  if (isUserMessage) {
    // Darken avatar and bubble in dark mode for better contrast with light text
    avatarBgColor = isDarkMode ? adjustHexColor(userColor, -65) : adjustHexColor(userColor, 50);
    bubbleBgColor = avatarBgColor; // Darker bubble in light mode
    avatarIconColor = getContrastColor(avatarBgColor, isDarkMode);
  } else if (role === 'assistant') {
    const assistantDefaultColor = secondaryColor;
    let baseAssistantColor = assistantDefaultColor;
    if (agentId) {
      baseAssistantColor = getAgentColor(agentId, theme, userColor);
    }
    // Darken avatar and bubble in dark mode
    avatarBgColor = isDarkMode ? adjustHexColor(baseAssistantColor, -85) : adjustHexColor(baseAssistantColor, 85);
    bubbleBgColor = avatarBgColor; // Darker bubble in light mode
    avatarIconColor = getContrastColor(avatarBgColor, isDarkMode);
  } else if (isToolMessage) {
    // Use a subtle background derived from theme surface or fallback rgba
    bubbleBgColor = theme?.colors?.surfaceBackground ? 
                        (isDarkMode ? theme.colors.surfaceBackground : theme.colors.surfaceBackground) :
                        (isDarkMode ? DEFAULT_TOOL_BG_DARK : DEFAULT_TOOL_BG_LIGHT);
    avatarBgColor = bubbleBgColor;
    // Use the primary text color calculated earlier
    avatarIconColor = textColor;
  }
  
  const fontFamily = theme?.typography?.fontFamily || 'system-ui, sans-serif';
  const fontWeight = theme?.typography?.fontWeight?.normal || '400';
  
  const getMaxWidth = () => {
    if (isXsScreen) return '95%';
    if (isSmScreen) return '85%'; 
    return '80%';
  };

  // Calculate adjusted timestamp color
  const baseTimestampColor = theme?.colors?.textSecondary || '#888888'; // Mid-grey fallback
  const adjustedTimestampColor = adjustHexColor(baseTimestampColor, isDarkMode ? 50 : -40);

  // Main render
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        width: '100%',
        gap: 0.5, // Reduced gap slightly
        alignItems: isUserMessage ? 'flex-end' : 'flex-start',
      }}
    >
      {/* Show agent label ONLY for assistant messages with an agent ID */}
      {agentLabel && (
        <Typography
          component="div"
          variant="caption"
          sx={{
            fontWeight: 'bold',
            color: isDarkMode ? avatarBgColor : adjustHexColor(avatarBgColor, -70),
            textAlign: 'left',
            pl: isUserMessage ? 0 : '52px', // Align with avatar start
            pr: isUserMessage ? '52px' : 0, 
            mb: 0.5, // Add small margin below label
          }}
        >
          {agentLabel}
        </Typography>
      )}

      {/* Main Bubble Row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, width: '100%', justifyContent: isUserMessage ? 'flex-end' : 'flex-start' }}>
        {/* Avatar for Assistant, Tool, or Assistant+ToolCall */}
        {!isUserMessage && (
          <Avatar sx={{ bgcolor: avatarBgColor, width: 36, height: 36, mt: 0.5 }}>
            {isToolMessage ? 
              <Terminal size={18} color={textColor} /> : 
              isAssistantPerformingToolCall ?
                <Wrench size={18} color={avatarIconColor} /> :
                <Bot size={18} color={avatarIconColor} />
            }
          </Avatar>
        )}
        
        {/* Message Content Paper */}
        <Paper
          elevation={1}
          sx={{
            bgcolor: bubbleBgColor,
            color: textColor,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 3,
            maxWidth: getMaxWidth(),
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            hyphens: 'auto',
            fontFamily: fontFamily,
            fontWeight: fontWeight,
            position: 'relative', // For potential absolute positioning inside
          }}
        >
          {/* Tool Message Label */} 
          {isToolMessage && (
            <Typography variant="overline" sx={{ display: 'block', mb: 1, opacity: 0.7, fontWeight: 'bold', lineHeight: 1.2 }}>
              Tool Response
            </Typography>
          )}
          
          {/* Enhanced Tool Call Indicator for Assistant */} 
          {isAssistantPerformingToolCall && toolCall && (
            <Box sx={{
              mb: 1,
              p: 1.5,
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)', 
              borderRadius: 1.5,
              fontSize: '0.8rem',
              opacity: 0.9
             }}>
              <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>Tool Call:</Typography>
              {toolCall.map((call, index) => (
                <Box key={call.id || index} sx={{ mb: index < toolCall.length - 1 ? 1 : 0 }}>
                  <Typography variant="caption" component="div" sx={{ fontWeight: '500'}}>
                    {call.pluginName || 'UnknownPlugin'}.{call.functionName || 'unknownFunction'}
                  </Typography>
                  {call.arguments && Object.keys(call.arguments).length > 0 && (
                    <Typography component="pre" variant="caption" sx={{ mt: 0.5, pl: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all', m: 0, fontSize: '0.75rem' }}>
                       {JSON.stringify(call.arguments, null, 2)}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Main Content - No longer wrapped */} 
          {isToolMessage ? (
            <MarkdownRenderer 
              // Format content as JSON if possible, otherwise use raw content
              content={`\`\`\`json\n${tryFormatJson(content)}\n\`\`\``} 
              textSize={textSize} 
            />
          ) : (
            content ? <MarkdownRenderer content={content} textSize={textSize} /> : null
          )}
          
          {/* Timestamp */} 
          {timeAgo && (
            <Typography
              variant="caption"
              component="div"
              sx={{
                mt: 1,
                textAlign: 'right',
                fontSize: '0.7rem',
                opacity: 0.99,
                color: adjustedTimestampColor, // Use dynamically adjusted color
              }}
            >
              {timeAgo}
            </Typography>
          )}
        </Paper>
        
        {/* Avatar for User */}
        {isUserMessage && (
          <Avatar sx={{ bgcolor: avatarBgColor, width: 36, height: 36, mt: 0.5 }}>
            <User size={18} color={avatarIconColor} />
          </Avatar>
        )}
      </Box>
    </Box>
  );
}; 