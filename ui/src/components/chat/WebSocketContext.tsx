import React, { createContext, useEffect, useState, useRef } from 'react';
import { WebSocketContextValue } from './ChatInterface';

export const WebSocketContext = createContext<WebSocketContextValue>({
  ws: null,
  isConnected: false,
  sendMessage: () => {},
});

export const WebSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        const newWs = new WebSocket(`ws://localhost:30000`);
        newWs.onopen = () => {
          setWs(newWs);
          wsRef.current = newWs;
          setIsConnected(true);
          console.log('WebSocket connected');
        };
        newWs.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
        newWs.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          setTimeout(connectWebSocket, 1000);
        };
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ ws, isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
