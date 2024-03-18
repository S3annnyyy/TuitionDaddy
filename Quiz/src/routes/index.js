import multer from "multer";
import db from "../libs/db.js";
import pdfReader from "../libs/pdfReader.js";
import generateQuiz from "../libs/quizLLMGenerator.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { TextractClient, StartDocumentTextDetectionCommand } from "@aws-sdk/client-textract";
import quizCleaner from "../libs/quizCleaner.js";
import short from "short-uuid";

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }); 
const bucketName = process.env.AWS_BUCKET_NAME;
const textractClient = new TextractClient({ region: process.env.AWS_DEFAULT_REGION });
const client = new S3Client({ 
    region: process.env.AWS_DEFAULT_REGION, 
});

function setupRoutes(app) {
    //used to update upload.single('pdf')
    const uploadPdfAndForm = upload.fields([
        { name: 'pdf_pptx', maxCount: 1 },
        { name: 'num_qns', maxCount: 1 },
        { name: 'question_type', maxCount: 1 },
        { name: 'title', maxCount: 1 },    
    ]);

    app.post('/generate-quiz', uploadPdfAndForm, async (req, res) => {
        try {
            const files = req.files;
            const file = files['pdf_pptx'] ? files['pdf_pptx'][0] : null;
            const formFields = req.body;

            //values of the form fields
            const numQnsValue = formFields.num_qns;
            const questionTypeValue = formFields.question_type;
            const quizTitle = formFields.title;

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

            if (filetype === 'PDF') {
                //initialize textract
                const startCommand = new StartDocumentTextDetectionCommand({
                    DocumentLocation: { S3Object: { Bucket: bucketName, Name: fileName } }
                });
                const startResponse = await textractClient.send(startCommand);
                const jobId = startResponse.JobId;

                try {
                    //process pdf and generate quiz
                    const extractedText = await pdfReader.processTextract(jobId);
                    const generatedQuiz = await generateQuiz.generateQuiz(extractedText, numQnsValue, questionTypeValue);
                    const cleanedQuiz = generatedQuiz.replace(/\n/g, ' '); //remove the \n symbols

                    //run it through quiz cleaner to get the output of json object
                    const jsonQuiz = await quizCleaner.cleanQuiz(cleanedQuiz);

                    //stringify the jsonQuiz
                    const jsonString = JSON.stringify(jsonQuiz);
                    const quizObject = JSON.parse(jsonString);

                    await uploadQuizToDatabase(quizObject, quizTitle);

                    res.json({
                        error: false,
                        message: "PDF processed and quiz generated successfully. Quiz uploaded into database as well.",
                        generatedQuiz: jsonString,
                        dbData: dbResponse,
                    });
                } catch (textractError) {
                    console.error('Error processing PDF and generating quiz:', textractError);
                    if (!res.headersSent) {
                        res.status(500).send({
                            error: true,
                            message: 'Error processing PDF and generating quiz.',
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

}

async function uploadQuizToDatabase(quizObject, quizTitle) {
    try {
        //separated quiz data
        const topics = quizObject.topics;
        const questions = quizObject.questions;

        //create quiz id
        const quizId = short.generate();

        //upload quiz information into database
        const quizQuery = 'INSERT INTO quizzes(id, title, topics, questions) VALUES ($1, $2, $3, $4) RETURNING *;';
        const quizValues = [quizId, quizTitle, topics, questions];

        const dbResponseQuiz = await db.query(quizQuery, quizValues);

        console.log('Quiz uploaded to database successfully:', dbResponseQuiz);    
    } catch (dbError) {
        console.error('Error uploading quiz to database:', dbError);
        throw dbError; // Re-throw the error to be handled by the caller
    }
}

export default {
    setupRoutes
};