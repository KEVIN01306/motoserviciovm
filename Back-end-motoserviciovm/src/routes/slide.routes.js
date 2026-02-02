import { Router } from "express";
import { getSlidesHandler, getSlideHandler, postSlideHandler, putSlideHandler, deleteSlideHandler } from "../controllers/slide.controller.js";
import configureMulter from "../configs/multer.config.js";
import path from "path";

const SLIDE_UPLOAD = path.join('slides');
const upload = configureMulter({ destinationFolder: SLIDE_UPLOAD });

const router = Router();

router.get('/', getSlidesHandler);
router.get('/:id', getSlideHandler);
router.post('/', upload.single('image'), postSlideHandler);
router.put('/:id', upload.single('image'), putSlideHandler);
router.delete('/:id', deleteSlideHandler);

export default router;
