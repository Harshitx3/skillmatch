import { Router } from "express";
import auth from "../middleware/auth.js";
import { getMatches } from "../controllers/matchController.js";

const router = Router();

router.get("/", auth, getMatches);

export default router;
