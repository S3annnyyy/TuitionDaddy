import express from 'express';
import multer from "multer";
import { generateQuizHandler, retrieveQuizzesHandler, openQuiz, submitQuizHandler } from '../controllers/quizController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

function setupRoutes(app) {

    const uploadPdfAndForm = upload.fields([
        { name: 'pdf_pptx', maxCount: 1 },
        { name: 'num_qns', maxCount: 1 },
        { name: 'question_type', maxCount: 1 },
        { name: 'title', maxCount: 1 },    
    ]);

    //upload pdf and get quiz
    app.post('/generate-quiz', [uploadPdfAndForm, authenticateToken], generateQuizHandler);
    //all quizzes
    app.get("/retrieve-quizzes", authenticateToken, retrieveQuizzesHandler);
    //open 1 quiz
    app.get("/quiz/:id", openQuiz);
    //submit quiz
    app.get('/submit-quiz', submitQuizHandler);
}

export default {
    setupRoutes
};