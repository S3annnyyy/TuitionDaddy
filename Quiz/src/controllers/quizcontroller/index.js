import db from "../../libs/db.js";
import fs from "fs";

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

        // Code that does whatever you need
        console.log(id, name);
        console.log(file);

        // now you're done and wanna delete it
        fs.rm(file.destination, {recursive: true}, () => {
            console.log('deleted')
        });

        // STORE THE DATA IN THE DATABASE
        // Store the path of the file and associate it with the user based on  ID

        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export default {
    renderQuizIndex,
    handleUpload
}