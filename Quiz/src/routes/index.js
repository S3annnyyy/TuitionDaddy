import multer from "multer";
import db from "../libs/db.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";

//LangChain Imports
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { z } from "zod";

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }); 
const bucketName = process.env.AWS_BUCKET_NAME;
const textractClient = new TextractClient({ region: process.env.AWS_DEFAULT_REGION });
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
            if (filetype === 'PDF') {
                //initialize textract
                const startCommand = new StartDocumentTextDetectionCommand({
                    DocumentLocation: { S3Object: { Bucket: bucketName, Name: fileName } }
                });
                const startResponse = await textractClient.send(startCommand);
                const jobId = startResponse.JobId;

                try {
                    const extractedText = await processTextract(jobId);
                    res.json({
                        error: false,
                        message: "PDF processed successfully.",
                        extractedText: extractedText,
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

            //if not PDF, need to edit this
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

//to initiate process textract
async function processTextract(jobId) {
    try {
        const finalResponse = await waitForTextractJobCompletion(jobId); // Implement polling logic here

        const extractedText = finalResponse.Blocks.filter(block => block.BlockType === 'LINE').map(line => line.Text).join('\n');
        
        return extractedText;
    } catch (error) {
        console.error('Error processing document with Textract:', error);
        throw error; // Rethrow or handle as needed
    }
}

async function waitForTextractJobCompletion(jobId) {
    let jobStatus = "IN_PROGRESS";
    let response;

    while (jobStatus === "IN_PROGRESS") {
        response = await textractClient.send(new GetDocumentTextDetectionCommand({ JobId: jobId }));
        jobStatus = response.JobStatus;
        if (jobStatus === "IN_PROGRESS") {
            console.log("Job still in progress, waiting...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust timing as needed
        }
    }

    if (jobStatus === "SUCCEEDED") {
        return response; // Return the final response for processing
    } else {
        throw new Error(`Textract job failed with status: ${jobStatus}`);
    }
}

export default {
    setupRoutes
};