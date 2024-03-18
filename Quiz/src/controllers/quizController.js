// quizController.js
import db from "../libs/db.js";
import pdfReader from "../libs/pdfReader.js";
import generateQuizLib from "../libs/quizLLMGenerator.js";
import quizCleaner from "../libs/quizCleaner.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { TextractClient, StartDocumentTextDetectionCommand } from "@aws-sdk/client-textract";
import short from "short-uuid";

const bucketName = process.env.AWS_BUCKET_NAME;
const textractClient = new TextractClient({ region: process.env.AWS_DEFAULT_REGION });
const client = new S3Client({ region: process.env.AWS_DEFAULT_REGION });

export async function generateQuizHandler(req, res) {
    try {
        const files = req.files;
        const file = files['pdf_pptx'] ? files['pdf_pptx'][0] : null;
        const formFields = req.body;

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
            const startCommand = new StartDocumentTextDetectionCommand({
                DocumentLocation: { S3Object: { Bucket: bucketName, Name: fileName } }
            });
            const startResponse = await textractClient.send(startCommand);
            const jobId = startResponse.JobId;

            try {
                const extractedText = await pdfReader.processTextract(jobId);
                const generatedQuiz = await generateQuizLib.generateQuiz(extractedText, numQnsValue, questionTypeValue);
                const cleanedQuiz = generatedQuiz.replace(/\n/g, ' ');

                const jsonQuiz = await quizCleaner.cleanQuiz(cleanedQuiz);

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
}

export async function retrieveQuizzesHandler(req, res) {
    try {
        const userId = req.user.id;

        const retrieveQuery = 'SELECT * FROM quizzes where userID = $1';
        const userQuizValues = [userId];
        const result = await db.query(retrieveQuery, userQuizValues);

        if (result) {
            if (result.rows.length > 0) {
                res.json({
                    quizAvailable: true,
                    quizzes: result.rows,
                });
            } else {
                res.json({
                    quizAvailable: false,
                    message: 'No quizzes found for the user',
                })
            }
        }
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).send({
            error: true,
            message: 'Error fetching quizzes',
        })
    }
}

export async function openQuiz(req, res) {
    const quizId = req.params.id;

    try {
        //get from database
        const selectQuiz = 'SELECT * FROM quizzes where quizId = $1';
        const quizResult = await db.query(selectQuiz, [quizId]);

        if (quizResult.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send({ message: 'Quiz not found' });
        }
    } catch (error) {
        console.error('Error retrieving a quiz from database', error);
        res.status(500).send({ message: 'Internal server error' });
    }
}

async function uploadQuizToDatabase(quizObject, quizTitle) {
    try {
        const topics = quizObject.topics;
        const questions = quizObject.questions;

        const quizId = short.generate();

        const quizQuery = 'INSERT INTO quizzes(quizId, title, topics, questions) VALUES ($1, $2, $3, $4) RETURNING *;';
        const quizValues = [quizId, quizTitle, JSON.stringify(topics), JSON.stringify(questions)];

        const dbResponseQuiz = await db.query(quizQuery, quizValues);

        console.log('Quiz uploaded to database successfully:', dbResponseQuiz);    
    } catch (dbError) {
        console.error('Error uploading quiz to database:', dbError);
        throw dbError;
    }
}
