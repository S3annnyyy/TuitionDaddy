import express from "express";
import QuizControllers from "../../controllers/quizcontroller/index.js";
import multer from "multer";
import QuizStorage from "../../libs/quizStorage.js";

const router = express.Router();
const multerInstance = multer({ storage: QuizStorage });

const uploadHandler = multerInstance.fields([
    { name: 'file', maxCount: 1 }, 
    { name: 'name' },
]);

function validateUUID(req, res, next) {
    const { id } = req.params;
    if (!validateUUIDFormat(id)) { // Ensure you implement validateUUIDFormat
        return res.status(400).send('Invalid UUID format');
    }
    next();
};

function validateUUIDFormat(id) {
    const RegexExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return RegexExp.test(id);
};


router.get("/", QuizControllers.renderQuizIndex);
router.post("/pdf/:id", validateUUID, uploadHandler, QuizControllers.handleUpload);

export default router;
