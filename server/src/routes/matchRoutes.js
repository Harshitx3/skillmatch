import { Router } from "express";
import auth from "../middleware/auth.js";
import { getMatches, removeMatch } from "../controllers/matchController.js";

const router = Router();

router.get("/", auth, getMatches);
router.delete("/:id", auth, removeMatch);

export default router;
