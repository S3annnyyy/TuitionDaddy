import multer from "multer";
import db from "../libs/db.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }); 
const bucketName = process.env.AWS_BUCKET_NAME;
const client = new S3Client({ 
    region: process.env.AWS_DEFAULT_REGION, 
}); 

//clean console.logs()

//upload pdf
function setupRoutes(app) {
    //upload pdf files NEED TO EDIT THIS

    //ask gpt how to have a route that can take in multiple inputs for multi-part data form with files too
    //replaces upload.single
    app.post('/pdf', upload.single('pdf'), async (req, res) => {
        try {
            const file = req.file;

            if (!file) { 
                return res.status(400).send('No file uploaded.'); 
            } 
    
            if (file.mimetype !== 'application/pdf') {
                return res.status(400).send('Only PDF files are allowed.');
            }
    
            const fileName = `${uuid()}-${file.originalname}`; 
            const encodeFileName = encodeURIComponent(fileName); 
    
            // Prepare to upload to S3 
            const uploadParams = new PutObjectCommand({ 
                Bucket: bucketName, 
                Body: file.buffer, 
                Key: fileName, 
                ContentType: file.mimetype, 
                ACL: 'public-read', 
            }); 

            await client.send(uploadParams); 
    
            const fileLocation = `https://${bucketName}.s3.amazonaws.com/${encodeFileName}`; 

            const query = 'INSERT INTO pdf_files(id) VALUES ($1) RETURNING *;';
            const values = [fileLocation];

            const dbResponse = await db.query(query, values);

            //add code here
            //get pdf file from s3
            //figure out how to read the file with pdfreader
            //send to chatgpt using langchain(?)
            //once you set qns using chatgpt, add to res.json, which returns qns from chatgpt

            res.json({
                error: false,
                message: 'PDF uploaded successfully and saved to database.',
                url: fileLocation, 
                //questions: ,
                dbData: dbResponse,
            });
        } catch(error) {
            console.error('Error uploading file or in database operation:', error); 
            res.status(500).send({ 
                error: true, 
                message: 'Error uploading file.', 
            }); 
        }
    });
}

export default {
    setupRoutes
};