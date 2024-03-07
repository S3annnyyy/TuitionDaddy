import { STORAGE_PATH } from './quizStorage.js';
import db from "../../libs/db.js";
import fs from "fs";
import path from 'path';

// Run queries to create table if not yet exist here
async function setupQuizDatabase() {
    // await db.query()
}

setupQuizDatabase();

function renderQuizIndex(req, res) {
    try {
        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

async function handleUpload(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const file = req.files.file[0];

        const filePath = path.join(STORAGE_PATH, id, file.filename);

        // NEED TO CHANGE this once users are created already
        await db.query('INSERT INTO QUIZ_PDF (user_id, file_path, name) VALUES ($1, $2, $3)', [id, filePath, name]);
        
        // now you're done and wanna delete it
        fs.rm(file.destination, {recursive: true}, (err) => {
            if (err) {
                console.error('Error deleting the file', err);
            } else {
                console.log('File deleted successfully');
            }
        });

        res.status(200).send('File uploaded and data stored successfully.');
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).send(error);
    }
}

export default {
    renderQuizIndex,
    handleUpload
}