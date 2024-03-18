import WebSocket, { WebSocketServer } from 'ws';
import { connectToAMQP } from '../amqp/amqpSetup';
import { updateSession, removeUserFromSession, publishMessageToRoom, setupRoomQueue } from '../sessions/sessionHandler';
import type { ExtendedWebSocket } from '../interfaces/ChatInterfaces';
import { sessionsCollection, messagesCollection } from '../db/mongo';

const wss = new WebSocketServer({ port: Number(process.env.WEB_SOCKET_PORT) });
function startWebSocketServer() {
  wss.on('connection', function connection(ws) {
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

      const { action, room, message: chatMessage, userId, image } = parsedMessage;

      switch (action) {
        case 'join':
          await updateSession(room, userId);
          extWs.userId = userId;
          extWs.room = room;
          await setupRoomQueue(room, wss);

          // Fetch past messages for the room
          const pastMessages = await messagesCollection
            .find({ room: room })
            .sort({ timestamp: -1 })
            .limit(50) // Adjust the limit as necessary
            .toArray();

          // Send past messages to the user
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ history: pastMessages }));
          }

          const roomMsg = `${userId} joined room`;
          console.log(roomMsg);

          const newMessage = {
            userId,
            message: roomMsg,
            timestamp: new Date(),
            room
          };
          await messagesCollection.insertOne(newMessage);
          publishMessageToRoom(room, newMessage);
          break;
        case 'message':
          const session = await sessionsCollection.findOne({ room: room, users: userId });

          if (session) {
            const newMessage = {
              userId,
              message: chatMessage,
              image,
              timestamp: new Date(),
              room
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
          await removeUserFromSession(room, userId);
          console.log(`${userId} left room: ${room}`);
          // Consider adding logic to unbind queue from exchange if no more users are in the room
          break;
        default:
          console.log('Unknown action');
      }
    });

    ws.on('close', async function () {
      if (extWs.userId && extWs.room) {
        await removeUserFromSession(extWs.room, extWs.userId);
        console.log(`WebSocket connection closed and user ${extWs.userId} removed from room: ${extWs.room}`);
      }
    });
  });
}

// Once AMQP is connected, set up necessary channels and exchanges
connectToAMQP().then(() => {
  console.log('AMQP setup completed');
}).catch(console.error);

export { startWebSocketServer };
