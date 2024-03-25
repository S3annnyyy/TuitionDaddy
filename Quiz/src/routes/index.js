import express from 'express';
import multer from "multer";
import { generateQuizHandler, retrieveQuizzesHandler, openQuiz, submitQuizHandler } from '../controllers/quizController.js';

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

function setupRoutes(app) {

    const uploadPdfAndForm = upload.fields([
        { name: 'pdf_pptx', maxCount: 1 },
        { name: 'numQns', maxCount: 1 },
        { name: 'questionType', maxCount: 1 },
        { name: 'quizTitle', maxCount: 1 },    
        { name: 'userId', maxCount: 1 }, 
    ]);

    //upload pdf and get quiz
    app.post('/quiz/generate-quiz', uploadPdfAndForm, generateQuizHandler);
    //all quizzes
    app.get("/quiz", retrieveQuizzesHandler);
    //open 1 quiz
    app.get("/quiz/:id", openQuiz);
    //answer and submit quiz
    app.get('/submit-quiz', submitQuizHandler);
}

export default {
    setupRoutes
};