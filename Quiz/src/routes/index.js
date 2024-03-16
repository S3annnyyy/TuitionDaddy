import multer from "multer";
import db from "../libs/db.js";
import pdfReader from "../libs/pdfReader.js";
import generateQuiz from "../libs/quizLLMGenerator.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { TextractClient, StartDocumentTextDetectionCommand } from "@aws-sdk/client-textract";

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }); 
const bucketName = process.env.AWS_BUCKET_NAME;
const textractClient = new TextractClient({ region: process.env.AWS_DEFAULT_REGION });
const client = new S3Client({ 
    region: process.env.AWS_DEFAULT_REGION, 
}); 

//clean console.logs()

//FOR COMPLEX MICROSERVICE
//get s3 URL links
//get by education level --> 

//schema question: , options: , index: , 
// afterwards try explanation on why it is correct

function setupRoutes(app) {
    //used to update upload.single('pdf')
    const uploadPdfAndForm = upload.fields([
        { name: 'pdf_pptx', maxCount: 1},
        { name: 'num_qns', maxCount: 1},
        { name: 'question_type', maxCount: 1}    
    ]);

    app.post('/pdf', uploadPdfAndForm, async (req, res) => {
        try {
            const files = req.files;
            const file = files['pdf_pptx'] ? files['pdf_pptx'][0] : null;
            const formFields = req.body;

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
    
            const uploadParams = new PutObjectCommand({ 
                Bucket: bucketName, 
                Body: file.buffer, 
                Key: fileName, 
                ContentType: file.mimetype, 
                ACL: 'public-read', 
            }); 

            await client.send(uploadParams); 
            const filetype = file.mimetype === 'application/pdf' ? 'PDF' : 'PPTX';
    
            const fileLocation = `https://${bucketName}.s3.amazonaws.com/${encodeFileName}`; 

            const query = 'INSERT INTO pdf_pptx_files(id, filetype) VALUES ($1, $2) RETURNING *;';
            const values = [fileLocation, filetype];

            const dbResponse = await db.query(query, values);

            //send to chatgpt using langchain(?)
            //once you set qns using chatgpt, add to res.json, which returns qns from chatgpt
            if (filetype === 'PDF') {
                //initialize textract
                const startCommand = new StartDocumentTextDetectionCommand({
                    DocumentLocation: { S3Object: { Bucket: bucketName, Name: fileName } }
                });
                const startResponse = await textractClient.send(startCommand);
                const jobId = startResponse.JobId;

                try {
                    const extractedText = await pdfReader.processTextract(jobId);
                    const generatedQuiz = await generateQuiz.generateQuiz(extractedText, numQnsValue, questionTypeValue);
                    const cleanedQuiz = generatedQuiz.replace(/\n/g, ' ')
                    //store into database
                    res.json({
                        error: false,
                        message: "PDF processed successfully.",
                        generatedQuiz: cleanedQuiz,
                        dbData: dbResponse,
                    });
                } catch (textractError) {
                    console.error('Error processing document with Textract:', textractError);
                    if (!res.headersSent) {
                        res.status(500).send({
                            error: true,
                            message: 'Error processing document with Textract.',
                        });
                    }
                }
                return;
            }

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
            if (!res.headersSent) {
                res.status(500).send({ 
                    error: true, 
                    message: 'Error uploading file.', 
                }); 
            }
        }
    });

    // app.post('/quiz', function, async (req, res))
    //extract data from db,, db.query
}

export default {
    setupRoutes
};