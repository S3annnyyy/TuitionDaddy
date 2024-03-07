import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_PATH = path.join(__dirname, "..", "..", "files")

const QuizStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        let savePath = STORAGE_PATH + "/" + req.params.id;

        if (!fs.existsSync(savePath)) {
            fs.mkdirSync(savePath, {recursive: true});
        }

        cb(null, savePath);
    },
        filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    },
});

export default QuizStorage;