import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

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
            const uniqueSuffix = uuidv4();
            const fileName = `${file.fieldname}-${Date.now()}-${uniqueSuffix}-${file.originalname}`;
            cb(null, fileName);
        },
});

export default QuizStorage;