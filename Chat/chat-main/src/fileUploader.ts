import express from 'express';
import multer from 'multer';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

import { publishMessageToRoom } from './sessions/sessionHandler';

const { fromEnv } = require("@aws-sdk/credential-provider-env");

function startFileUploaderService() {

    const app = express();
    const port = process.env.FILE_UPLOADER_PORT;

    const client = new S3Client({
        region: process.env.AWS_DEFAULT_REGION,
        credentials: fromEnv(),
    });
    const bucketName = process.env.AWS_BUCKET_NAME;

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    app.use(express.json());

    app.post('/upload', upload.single('image'), async (req: any, res: any) => {

        const file = req.file;

        const { userId, room } = req.body;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileName = `${uuidv4()}-${file.originalname}`;
        const encodeFileName = encodeURIComponent(fileName);

        // Prepare to upload to S3
        const uploadParams = new PutObjectCommand({
            Bucket: bucketName,
            Body: file.buffer,
            Key: fileName,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });

        try {
            await client.send(uploadParams);

            const fileLocation = `https://${bucketName}.s3.amazonaws.com/${encodeFileName}`;

            const newMessage = {
                userId,
                message: fileLocation,
                image: true,
                timestamp: new Date(),
                room,
            };
        
            publishMessageToRoom(room, newMessage).then(() => {
                res.json({ success: true, message: "Message broadcasted successfully." });
            }).catch(error => {
                res.status(500).json({ success: false, message: "An error occurred." });
                console.error(error);
            });

            res.json({
                error: false,
                message: 'File uploaded successfully.',
                url: fileLocation
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).send({
                error: true,
                message: 'Error uploading file.',
            });
        }
    });

    app.listen(port, () => {
        console.log(`File Uploader server listening at http://localhost:${port}`);
    });

}

export { startFileUploaderService };
