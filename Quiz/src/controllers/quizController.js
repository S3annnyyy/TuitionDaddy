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

// MAKE A NEW FUNCTION TO SUBMIT QUIZ WORKINGS TO THE DATABASE

export async function generateQuizHandler(req, res) {
    try {
        const userId = req.user.sub;

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

                const quizTopics = quizObject.topics;
                const quizQuestions = quizObject.questions;

                await uploadQuizToDatabase(quizObject, quizTitle, userId);

                res.json({
                    success: true,
                    message: "PDF processed and quiz generated successfully. Quiz uploaded into database as well.",
                    data: {
                        quizTopics: quizTopics,
                        quizQuestions: quizQuestions,
                        dbData: dbResponse,
                    }
                });
            } catch (textractError) {
                if (!res.headersSent) {
                    res.status(500).send({
                        success: false,
                        message: 'Error processing PDF and generating quiz.',
                        errorDetails: textractError,
                    });
                }
            }
            return;
        }

        res.json({
            success: true,
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
                success: false, 
                message: 'Error uploading file.', 
                errorDetails: error,
            }); 
        }
    }
}

export async function retrieveQuizzesHandler(req, res) {
    try {
        const userId = req.user.sub;

        const retrieveQuery = 'SELECT * FROM quizzes where user_id = $1';
        const userQuizValues = [userId];

        const result = await db.query(retrieveQuery, userQuizValues);

        if (result) {
            if (result.rows.length > 0) {
                res.json({
                    success: true,
                    quizAvailable: true,
                    quizzes: result.rows,
                });
            } else {
                res.json({
                    success: true,
                    quizAvailable: false,
                    message: 'No quizzes found for the user',
                })
            }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error fetching quizzes',
            errorDetails: error,
        })
    }
}

export async function openQuiz(req, res) {
    const quizId = req.params.id;

    try {
        //get from database
        const selectQuiz = 'SELECT * FROM quizzes where id = $1';
        const quizResult = await db.query(selectQuiz, [quizId]);

        if (quizResult.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred while retrieving the quiz.',
            errorDetails: error.message,
        });
    }
}

export async function uploadQuizToDatabase(quizObject, quizTitle, userId) {
    try {
        const topics = quizObject.topics;
        const questions = quizObject.questions;

        const quizId = short.generate();

        //and then this quizzes table will also have userID and the score but SCORE IS EMPTY INITIALLY FOR THIS FUNCTION
        const quizQuery = 'INSERT INTO quizzes(id, title, topics, questions, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
        const quizValues = [quizId, quizTitle, JSON.stringify(topics), JSON.stringify(questions), userId];

        const dbResponseQuiz = await db.query(quizQuery, quizValues);

        console.log('Quiz uploaded to database successfully:', dbResponseQuiz);    
    } catch (dbError) {
        console.error('Error uploading quiz to database:', dbError);
        throw dbError;
    }
}

export async function submitQuizHandler(req, res) {
    //logic on the frontend side SEND JSON to this backend,,,
    //this backend then compares the JSON REQ with the correct answers
    //THEN the backend calculates and returns the score to the frontend
    //THEN the frontend displays the score to the user

    try {
        // Extract data from request body
        const userAnswers = req.body.answers; //needa find out how the format from frontend to backend is for this
        const quizId = req.body.quizId;

        // Initialize variables to calculate score
        let quizMarks = 0;
        let totalQuestions = 0;

        // Retrieve the specified quiz from the database
        const selectQuiz = 'SELECT * FROM quizzes WHERE id = $1';
        const quizResult = await db.query(selectQuiz, [quizId]);

        if (quizResult.rows.length > 0) {
            const quiz = quizResult.rows[0];
            const questions = quiz.questions; //ensure that it is an array

            // Compare each qn answers
            for (const question of questions) {
                const correctAnswer = question.correctAnswer;
                const userAnswer = userAnswers[questions.indexOf(question)];
                if (correctAnswer === userAnswer) {
                    quizMarks++;
                }
                totalQuestions++;
            };            
        };

        // Calculate quiz score
        const quizScore = totalQuestions > 0 ? (quizMarks / totalQuestions) * 100 : 0;

        // Insert the quiz score into the database
        const submitQuery = 'INSERT INTO quizzes(quizScore) VALUES ($1) RETURNING *;';
        const submitValues = [quizScore];
        const dbResponseSubmit = await db.query(submitQuery, submitValues);

        console.log(dbResponseSubmit);

        res.json({
            success: true,
            message: 'Quiz submitted successfully.',
            quizScore: quizScore,
            totalQuestions: totalQuestions,
            scorePercentage: quizScore, // Assuming scorePercentage is the same as quizScore
        });
    } catch (error) {
        // Log and respond to the error
        console.error('Error submitting quiz:', error);
        res.status(500).send({
            success: false, 
            message: 'Error submitting quiz',
            errorDetails: error,
        });
    }
}
