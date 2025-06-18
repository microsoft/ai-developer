'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { IChatService } from './IChatService';
import { IHistoryService } from './IHistoryService';
import { ServiceFactory } from './ServiceFactory';
import { MockHistoryService } from './MockHistoryService'; // Import Mock for SSR fallback type check

interface ServiceContextType {
  chatService: IChatService;
  historyService: IHistoryService;
}

// Create the context with a default undefined value
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Create a hook for using the services
export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

interface ServiceProviderProps {
  children: ReactNode;
}

// Initial service creation (safe for SSR)
// We create potentially temporary instances here that might be replaced client-side
const initialChatService = ServiceFactory.createChatService();
const initialHistoryService = ServiceFactory.createHistoryService(); // This will use the SSR fallback if mode is local

export const ServiceProvider: React.FC<ServiceProviderProps> = ({
  children,
}: ServiceProviderProps) => {
  // State for services. Initialized with SSR-safe instances.
  const [chatService, setChatService] = useState<IChatService>(initialChatService);
  const [historyService, setHistoryService] = useState<IHistoryService>(initialHistoryService);
  
  useEffect(() => {
    // This effect runs only on the client after hydration.
    // We now instantiate the definitive client-side services.
    const clientChatService = ServiceFactory.createChatService();
    const clientHistoryService = ServiceFactory.createHistoryService(); // This will correctly create LocalHistoryService if needed
    
    // Update state if the client-side instance is different from the initial SSR instance
    // (Specifically needed for LocalHistoryService replacing the Mock fallback)
    if (clientChatService !== initialChatService) {
      setChatService(clientChatService);
    }
    if (clientHistoryService !== initialHistoryService) {
       // Check specifically if the SSR fallback needs replacing
      if (initialHistoryService instanceof MockHistoryService && 
          !(clientHistoryService instanceof MockHistoryService)) {
          setHistoryService(clientHistoryService);
      } else if (process.env.NEXT_PUBLIC_CHAT_HISTORY_MODE === 'api'){
          // Potentially handle replacement if API service differs, though less likely
          // For now, we mainly focus on fixing the LocalHistoryService hydration issue
          // setHistoryService(clientHistoryService); // Uncomment if API service needs client-side update logic
      } 
    }
  }, []); // Empty dependency array ensures this runs once on mount client-side
  
  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    chatService,
    historyService,
  }), [chatService, historyService]);
  
  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

// Export the service interfaces to be used throughout the application
export type { IChatService, IHistoryService }; 