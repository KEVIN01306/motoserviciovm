import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
  res.send('Permisos route');
});

export default router;