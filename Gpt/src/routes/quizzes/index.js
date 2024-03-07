import express from "express";
import QuizControllers from "../../controllers/quizcontroller/index.js";
import multer from "multer";

import QuizStorage from "../../libs/quizStorage.js";

const router = express.Router();
const multerInstance = multer({ storage: QuizStorage });

const uploadHandler = multerInstance.fields([
    { name: 'file', maxCount: 1 }, 
    { name: 'name' },
    { name: 'age' }
]);

router.get("/", QuizControllers.renderQuizIndex);
router.post("/pdf/:id", uploadHandler, QuizControllers.handleUpload);

export default router;
