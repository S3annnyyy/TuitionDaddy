import React from 'react';
import ChatRoom from '../components/chat/ChatRoom';
import UserList from '../components/chat/UserList';
import { WebSocketProvider } from '../components/chat/WebSocketContext';

interface User {
  userid: string;
  username: string;
}

const Chat = () => {
  const [userId, setUserId] = React.useState('');
  const [targetId, setTargetId] = React.useState('');
  const [users] = React.useState([
    { userid: '1', username: 'User 1' },
    { userid: '2', username: 'User 2' },
    { userid: '3', username: 'User 3' },
    { userid: '4', username: 'User 4' },
  ]);

  const handleUserSelect = (user: User) => {
    if (!sessionStorage.getItem("userid")) {
      sessionStorage.setItem("userid", user.userid);
    }
    setUserId(sessionStorage.getItem("userid")!);
    setTargetId(user.userid);
  };

  const handleLeaveRoom = () => {
    setUserId('');
    setTargetId('');
  };

  return (
    <WebSocketProvider>
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Chat Application</h1>
        {!targetId && <UserList users={users} onSelectUser={handleUserSelect} />}
        {targetId && (
          <ChatRoom userId={userId} targetId={targetId} onLeaveRoom={handleLeaveRoom} />
        )}
      </div>
    </WebSocketProvider>
  );
}

export default Chat;