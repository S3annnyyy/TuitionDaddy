import quizRoutes from "./quizzes/index.js";

// the GET ALL Quiz

function setupRoutes(app) {
    app.use("/quiz", quizRoutes);

    //upload pdf files
    app.post('/upload-pdf/:userId', pdfUpload.single('pdf'), async (req, res) => {
        if (req.file && req.fileLocation) {
            // Additional logic after successful PDF upload can go here
            // For example, creating a quiz based on the uploaded PDF

            res.status(200).json({
                success: true,
                message: 'PDF uploaded successfully and saved to database.',
                url: req.fileLocation, // Respond with the URL of the uploaded PDF
            });
        } else {
            // Handle the case where PDF uploading failed
            res.status(500).json({
                success: false,
                message: 'Failed to upload PDF.',
            });
        }
    });
}

export default {
    setupRoutes
};