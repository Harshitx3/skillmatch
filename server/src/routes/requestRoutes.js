import { Router } from "express";
import auth from "../middleware/auth.js";
import { createRequest, getPending, acceptRequest, rejectRequest } from "../controllers/requestController.js";

const router = Router();

router.post("/", auth, createRequest);
router.get("/pending", auth, getPending);
router.put("/:id/accept", auth, acceptRequest);
router.put("/:id/reject", auth, rejectRequest);

export default router;
