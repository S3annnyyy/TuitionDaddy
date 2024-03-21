export interface Message {
    userId: string;
    message: string;
    timestamp: Date;
    image?: boolean;
    room: string;
}

export interface ChatRoomProps {
    userId: string;
    targetId: string;
    onLeaveRoom: React.MouseEventHandler<HTMLButtonElement>;
}

export interface User {
    userid: string;
    username: string;
}

export interface UserListProps {
    users: User[];
    onSelectUser: (user: User) => void;
}

export interface WebSocketContextValue {
    ws: WebSocket | null;
    isConnected: boolean;
    sendMessage: (message: any) => void;
}