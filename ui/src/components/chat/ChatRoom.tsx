import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';
import { ChatRoomProps, Message } from './ChatInterface';

const generateRoomId = (userId: string, targetId: string) => {
  const ids = [userId, targetId].sort();
  return `room_${ids[0]}_${ids[1]}`;
};

const ChatRoom = ({ userId, targetId, onLeaveRoom }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [joinMessageSent, setJoinMessageSent] = useState(false);
  const { ws, sendMessage, isConnected } = useContext(WebSocketContext);
  const roomId = generateRoomId(userId, targetId);

  useEffect(() => {
    const handleOpen = () => console.log('WebSocket connection opened');
    const handleMessage = (event: { data: string; }) => {
      const data = JSON.parse(event.data);
      if (data.history) {
        setMessages(data.history.reverse());
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };
    const handleError = (error: any) => console.error('WebSocket error:', error);

    ws?.addEventListener('open', handleOpen);
    ws?.addEventListener('message', handleMessage);
    ws?.addEventListener('error', handleError);

    return () => {
      ws?.removeEventListener('open', handleOpen);
      ws?.removeEventListener('message', handleMessage);
      ws?.removeEventListener('error', handleError);
    };
  }, [ws]);

  useEffect(() => {
    if (ws && isConnected && !joinMessageSent) {
      sendMessage({ action: 'join', userId, targetId, room: roomId });
      setJoinMessageSent(true);
    }
  }, [ws, isConnected, userId, targetId, sendMessage, joinMessageSent, roomId]);

  const handleSendMessage = () => {
    if (messageInput.trim() !== '') {
      const newMessage = { action: 'message', message: messageInput, userId, room: roomId };
      sendMessage(newMessage);
      setMessageInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      handleFileUpload(e.target.files[0]); // Call handleFileUpload with the selected file
    } else {
      setSelectedFile(null);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('room', roomId);

      try {
        const response = await fetch('http://localhost:30001/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (result.success) {
          console.log('File uploaded successfully:', result.message);
          setSelectedFile(null); // Reset file input after successful upload
        } else {
          console.error('File upload failed:', result.message);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleLeaveRoomAdjusted = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setJoinMessageSent(false);
    onLeaveRoom(e);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2">
        <h2 className="text-lg font-bold">Chat: {roomId}</h2>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleLeaveRoomAdjusted}>
          Leave Room
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{message.userId}: </span>
            {message.image ? (
              /\.(jpe?g|png|gif|bmp|webp)$/i.test(message.message) ? (
                <img src={message.message} alt="Uploaded" className="max-w-xs max-h-xs mt-2" />
              ) : (
                <a href={message.message} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Download file
                </a>
              )
            ) : (
              <span>{message.message}</span>
            )}
          </div>
        ))}

      </div>
      <div className="bg-gray-200 p-4 flex justify-between items-center">
        <input
          type="text"
          className="flex-1 px-4 py-2 mr-2 rounded-l"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSendMessage}>
          Send
        </button>

        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <label htmlFor="fileInput" className="ml-2 px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
          Upload File
        </label>
      </div>
    </div>
  );
};

export default ChatRoom;
