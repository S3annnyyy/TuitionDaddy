import express from "express";
import QuizControllers from "../../controllers/quizcontroller/index.js";
import multer from "multer";
import PdfStorage from './pdfStorage.js';

const app = express();
const upload = multer({ storage: PdfStorage });

app.get("/", QuizControllers.renderQuizIndex);

app.post('/pdf/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params; // User or resource ID
        const { file } = req; // The uploaded file, now in memory

        // Assuming you have a function in db.js to handle file saving to the database
        // For example, db.savePdf({ userId: id, fileBuffer: file.buffer, fileName: file.originalname });
        await db.savePdf({ userId: id, fileBuffer: file.buffer, fileName: file.originalname });

        res.status(200).send('PDF file saved to database successfully.');
    } catch (error) {
        console.error('Error saving PDF to database:', error);
        res.status(500).send('Failed to save PDF to database.');
    }
});

export default app;