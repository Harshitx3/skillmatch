import { Router } from "express";
import auth from "../middleware/auth.js";
import {
    createEvent,
    getApprovedEvents,
    getAllEvents,
    approveEvent,
    rejectEvent,
    getMyEvents,
    updateEvent,
    deleteEvent,
} from "../controllers/eventController.js";

const router = Router();

router.post("/create", auth, createEvent);
router.get("/", getApprovedEvents);           // public
router.get("/my", auth, getMyEvents);         // user's own events
router.get("/admin", auth, getAllEvents);      // admin: all events
router.put("/:id", auth, updateEvent);         // update own event
router.delete("/:id", auth, deleteEvent);      // delete own event
router.put("/:id/approve", auth, approveEvent);
router.put("/:id/reject", auth, rejectEvent);

export default router;
