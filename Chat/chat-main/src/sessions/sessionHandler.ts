import WebSocket, { WebSocketServer } from 'ws';
import { sessionsCollection } from '../db/mongo';
import { amqpChannel } from '../amqp/amqpSetup';
import type { ExtendedWebSocket } from '../interfaces/ChatInterfaces';

async function updateSession(room: any, userId: any) {
    const session = await sessionsCollection.findOne({ room });
    if (session) {
        if (!session.users.includes(userId)) {
            session.users.push(userId);
            await sessionsCollection.updateOne({ room }, { $set: { users: session.users } });
        }
    } else {
        await sessionsCollection.insertOne({ room, users: [userId] });
    }
}

// Function to remove a user from a session
async function removeUserFromSession(room: string, userId: string) {
    const session = await sessionsCollection.findOne({ room });
    if (session && session.users.includes(userId)) {
        const updatedUsers = session.users.filter((user: string) => user !== userId);
        await sessionsCollection.updateOne({ room }, { $set: { users: updatedUsers } });
    }
}

async function publishMessageToRoom(room: any, message: any) {
    amqpChannel.publish("chatAppExchange", room, Buffer.from(JSON.stringify(message)));
}

async function setupRoomQueue(room: any, wss: WebSocketServer) {
    const queueName = `room_${room}`;
    const exchangeName = "chatAppExchange";

    await amqpChannel.assertQueue(queueName, { exclusive: false });
    await amqpChannel.bindQueue(queueName, exchangeName, room);

    amqpChannel.consume(queueName, (msg) => {
        if (msg !== null) {
            const messageContent = msg.content.toString();
            const message = JSON.parse(messageContent);

            wss.clients.forEach((client: ExtendedWebSocket) => {
                if (client.readyState === WebSocket.OPEN && client.room === room) {
                    client.send(JSON.stringify(message));
                }
            });

            amqpChannel.ack(msg);
        }
    }, { noAck: false });
}

export { updateSession, removeUserFromSession, publishMessageToRoom, setupRoomQueue };
