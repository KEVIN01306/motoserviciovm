import  { Router } from 'express'
import { getUsersHandler,getUserHandler, postUserHandler, putUserHandler, patchUserActiveHandler} from '../controllers/users.controller.js'
import { verifyTokenHandler } from '../controllers/auth.controller.js';

const router = Router();

router.get("/", verifyTokenHandler(),getUsersHandler);
router.get("/:id", verifyTokenHandler(),getUserHandler);
router.post("/", verifyTokenHandler(),postUserHandler);
router.put("/:id", verifyTokenHandler(),putUserHandler);
router.patch("/:id/active", verifyTokenHandler(),patchUserActiveHandler);

// router.get("/",getUsersHandler);
// router.get("/:id",getUserHandler);
// router.post("/",postUserHandler);
// router.put("/:id",putUserHandler);
// router.patch("/:id/active",patchUserActiveHandler);






export default router; 