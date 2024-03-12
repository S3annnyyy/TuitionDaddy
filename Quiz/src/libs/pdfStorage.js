import express from 'express'; 
import multer from 'multer'; 
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Pool } from 'pg';

// access files in memory through req.file.buffer

function PdfStorage() { 

    const app = express(); 
    const port = process.env.FILE_UPLOADER_PORT; 

    const client = new S3Client({ 
        region: process.env.AWS_DEFAULT_REGION, 
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        } 
    }); 

    const bucketName = process.env.AWS_BUCKET_NAME; 

    const pool = new Pool({
        connectionString: process.env.DB_URI,
    });

    const storage = multer.memoryStorage(); 
    const upload = multer({ storage: storage }); 

    app.use(express.json()); 

    // POST endpoint for image upload 
    app.post('/pdf/:id', upload.single('pdf'), async (req, res) => { 

        const file = req.file; 
        const userId = req.params.id;

        if (!file) { 
            return res.status(400).send('No file uploaded.'); 
        } 

        if (file.mimetype !== 'application/pdf') {
            return res.status(400).send('Only PDF files are allowed.');
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

            const query = 'INSERT INTO pdf_files(user_id, file_location) VALUES ($1, $2) RETURNING *;';
            const values = [userId, fileLocation];

            const dbResponse = await pool.query(query, values);

            res.json({
                error: false,
                message: 'PDF uploaded successfully and saved to database.',
                url: fileLocation, 
                dbData: dbResponse.rows[0],
            });
        } catch (error) { 
            console.error('Error uploading file or in database operation:', error); 
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

export { PdfStorage };