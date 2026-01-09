import multer from "multer";
import path from "path";
import fs from "fs";

const directorioRaiz = path.join('.', 'public','uploads');

const createDirIfNotExists = (dir) => {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    } catch (err) {
        console.error(`Error creating directory ${dir}:`, err);
        throw 'no se pudo crear el directorio para subir archivos:' + err;
    }
};

const configureMulter = ({ destinationFolder }) => {

    createDirIfNotExists(path.join(directorioRaiz, destinationFolder));

    const storage = multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, path.join(directorioRaiz, destinationFolder));
        },

        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }

    });

    const upload = multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: function (req, file, cb) {
            const allowedTypes = /jpeg|jpg|png|gif|pdf/;
            const mimeType = allowedTypes.test(file.mimetype);
            const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            if (mimeType && extName) {
                return cb(null, true);
            }
            cb(new Error('Error: File upload only supports the following filetypes - ' + allowedTypes));
        }

    });
    return upload;
};


export default configureMulter;