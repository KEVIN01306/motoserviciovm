import { Router } from "express";
import { getAboutImagesHandler, getAboutImageHandler, postAboutImageHandler, putAboutImageHandler, deleteAboutImageHandler } from "../controllers/aboutImage.controller.js";
import configureMulter from "../configs/multer.config.js";
import path from "path";

const ABOUTIMAGE_UPLOAD = path.join('aboutImage');
const upload = configureMulter({ destinationFolder: ABOUTIMAGE_UPLOAD });

const router = Router();

router.get('/', getAboutImagesHandler);
router.get('/:id', getAboutImageHandler);
router.post('/', upload.single('image'), postAboutImageHandler);
router.put('/:id', upload.single('image'), putAboutImageHandler);
router.delete('/:id', deleteAboutImageHandler);

export default router;
