export interface ChatMessage {
    userId: string;
    message: string;
    timestamp: Date;
    room: string;
}

export interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  room?: string;
}

export interface Connection {
  userId: string;
  timestamp: Date;
  room: string;
}

export interface InternalMessage {
  room: string, 
  url: string, 
  userId: string
}