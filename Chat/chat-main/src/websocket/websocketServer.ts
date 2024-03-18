import WebSocket, { WebSocketServer } from 'ws';
import { connectToAMQP } from '../amqp/amqpSetup';
import { updateSession, removeUserFromSession, publishMessageToRoom, setupRoomQueue } from '../sessions/sessionHandler';
import { sessionsCollection, messagesCollection } from '../db/mongo';
import type { ExtendedWebSocket } from '../interfaces/ChatInterfaces';

const wss = new WebSocketServer({ port: Number(process.env.WEB_SOCKET_PORT) });
function startWebSocketServer() {

  async function getOrCreateRoom(userId: string, targetId: string) {
    // Generate a consistent room ID by sorting user IDs
    const sortedIds = [userId, targetId].sort();
    const roomId = `room_${sortedIds[0]}_${sortedIds[1]}`;
  
    // Check if the room already exists
    const existingRoom = await sessionsCollection.findOne({
      room: roomId,
    });
  
    // If the room exists, fetch its messages
    if (existingRoom) {
      const messages = await messagesCollection
        .find({ room: roomId })
        .sort({ timestamp: -1 })
        .toArray();
      return { roomId, messages };
    } else {
      // If the room does not exist, create it and return its ID with no messages
      await sessionsCollection.insertOne({ room: roomId, users: [userId, targetId] });
      return { roomId, messages: [] };
    }
  }

  wss.on('connection', async function connection(ws) {
    console.log('New WebSocket connection');
  
    const extWs = ws as ExtendedWebSocket;
  
    ws.on('message', async function incoming(message) {
      let parsedMessage;
      try {
        const messageString = message.toString();
        parsedMessage = JSON.parse(messageString);
  
        if (!parsedMessage.action) {
          throw new Error("Action is required in the message.");
        }
      } catch (error) {
        console.error(`Error processing message: ${error}`);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ error: true, message: "Invalid message format." }));
        }
        return;
      }
  
      const { action, userId, targetId, message: chatMessage, image, room } = parsedMessage;
  
      switch (action) {
        case 'join':
          const { roomId: joinRoomId, messages } = await getOrCreateRoom(userId, targetId);
          extWs.userId = userId;
          extWs.room = joinRoomId;
          await setupRoomQueue(joinRoomId, wss);
  
          // Send past messages to the user
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ history: messages }));
          }
  
          console.log(`${userId} joined room`);
  
          break;
        case 'message':
          console.log(room)
          const session = await sessionsCollection.findOne({ room, users: userId });
  
          if (session) {
            const newMessage = {
              userId,
              message: chatMessage,
              image,
              timestamp: new Date(),
              room,
            };
            await messagesCollection.insertOne(newMessage);
            publishMessageToRoom(room, newMessage);
          } else {
            console.log(`User ${userId} is not part of the room session: ${room}`);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                error: true,
                message: `You are not a member of room ${room} and cannot send messages to it.`
              }));
            }
          }
          break;
        case 'leave':
          const { roomId: leaveRoomId } = await getOrCreateRoom(userId, targetId);
          await removeUserFromSession(leaveRoomId, userId);
          console.log(`${userId} left room: ${leaveRoomId}`);
          break;
        default:
          console.log('Unknown action');
      }
    });
  });
}

// Once AMQP is connected, set up necessary channels and exchanges
connectToAMQP().then(() => {
  console.log('AMQP setup completed');
}).catch(console.error);

export { startWebSocketServer };