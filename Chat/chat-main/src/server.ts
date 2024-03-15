import { connectToMongo } from './db/mongo';
import { startWebSocketServer } from './websocket/websocketServer';
import { startFileUploaderService } from './fileUploader';

async function startServer() {
    try {
        await connectToMongo();
        console.log('Connected to MongoDB.');

        startWebSocketServer();
        console.log(`WebSocket server started on ws://localhost:${process.env.WEB_SOCKET_PORT}`);

        startFileUploaderService();
        console.log('File Uploader service started.');
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
}

startServer();
