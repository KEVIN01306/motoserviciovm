import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
  res.send('Roles route');
});

export default router;