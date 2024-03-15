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

function setupRoutes(app) {

    //used to update upload.single('pdf')
    const uploadPdfAndForm = upload.fields([
        { name: 'pdf_pptx', maxCount: 1},
        { name: 'num_qns', maxCount: 1},
        // below is mcq OR short answer
        { name: 'question_type', maxCount: 1}    
    ]);

    app.post('/pdf', uploadPdfAndForm, async (req, res) => {
        try {
            const files = req.files;
            const file = files['pdf_pptx'] ? files['pdf_pptx'][0] : null;
            const formFields = req.body; //this is the form fields

            //values of the form fields
            const numQnsValue = formFields.num_qns;
            const questionTypeValue = formFields.question_type;

            if (!file) { 
                return res.status(400).send('No files uploaded.'); 
            } 
    
            if (file.mimetype !== 'application/pdf' && file.mimetype !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                return res.status(400).send('Only PDF or PPTX files are allowed.');
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
            const filetype = file.mimetype === 'application/pdf' ? 'PDF' : 'PPTX'
    
            const fileLocation = `https://${bucketName}.s3.amazonaws.com/${encodeFileName}`; 

            const query = 'INSERT INTO pdf_pptx_files(id, filetype) VALUES ($1, $2) RETURNING *;';
            const values = [fileLocation, filetype];

            const dbResponse = await db.query(query, values);

            //add gpt code here
            //get pdf file from s3
            //figure out how to read the file with pdfreader
            //send to chatgpt using langchain(?)
            //once you set qns using chatgpt, add to res.json, which returns qns from chatgpt

            res.json({
                error: false,
                message: `${filetype} uploaded successfully and saved to database.`,
                url: fileLocation, 
                formFields: {
                    numQns: numQnsValue,
                    questionType: questionTypeValue
                },
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