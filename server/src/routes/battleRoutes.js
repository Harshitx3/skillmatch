import { Router } from "express";
import auth from "../middleware/auth.js";
import {
    createBattle,
    getBattleByCode,
    getBattleById,
    joinBattle,
    startBattle,
    completeBattle,
    endBattle,
    completeQuestion,
    getLeaderboard,
    getMyBattles,
} from "../controllers/battleController.js";

const router = Router();

router.post("/create", auth, createBattle);
router.get("/my", auth, getMyBattles);
router.get("/:id/details", auth, getBattleById);
router.get("/:id/leaderboard", auth, getLeaderboard);
router.post("/:id/start", auth, startBattle);
router.post("/:id/complete", auth, completeBattle);
router.post("/:id/end", auth, endBattle);
router.post("/:id/questions/:idx/complete", auth, completeQuestion);
router.get("/:code", auth, getBattleByCode);    // by invite code (last to avoid conflicts)
router.post("/:code/join", auth, joinBattle);

export default router;
