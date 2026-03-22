import Battle from "../models/Battle.js";
import Participant from "../models/Participant.js";
import { io, connectedUsers } from "../../server.js";

// POST /api/battles/create
export async function createBattle(req, res) {
    try {
        const { title, questions, difficulty, duration, minPlayers } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });

        const battle = await Battle.create({
            title,
            createdBy: req.userId,
            questions: questions || [],
            difficulty: difficulty || "medium",
            duration: duration || 60,
            minPlayers: minPlayers || 2,
        });

        // Auto-add creator as first participant
        await Participant.create({ battleId: battle._id, userId: req.userId });

        res.status(201).json(battle);
    } catch (e) {
        console.error("createBattle error:", e);
        res.status(500).json({ error: "Server error" });
    }
}

// GET /api/battles/:code - get battle by invite code
export async function getBattleByCode(req, res) {
    try {
        const battle = await Battle.findOne({ inviteCode: req.params.code.toUpperCase() })
            .populate("createdBy", "name username avatar")
            .lean();
        if (!battle) return res.status(404).json({ error: "Battle not found" });

        const participants = await Participant.find({ battleId: battle._id })
            .populate("userId", "name username avatar")
            .sort({ joinedAt: 1 })
            .lean();

        res.json({ ...battle, participants });
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// GET /api/battles/:id/details - get battle by ID
export async function getBattleById(req, res) {
    try {
        const battle = await Battle.findById(req.params.id)
            .populate("createdBy", "name username avatar")
            .lean();
        if (!battle) return res.status(404).json({ error: "Battle not found" });

        const participants = await Participant.find({ battleId: battle._id })
            .populate("userId", "name username avatar")
            .sort({ joinedAt: 1 })
            .lean();

        res.json({ ...battle, participants });
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// POST /api/battles/:code/join
export async function joinBattle(req, res) {
    try {
        const battle = await Battle.findOne({ inviteCode: req.params.code.toUpperCase() });
        if (!battle) return res.status(404).json({ error: "Battle not found" });
        if (battle.status !== "waiting") {
            return res.status(400).json({ error: "Battle already started or completed" });
        }

        // Upsert participant (avoid duplicate join)
        await Participant.findOneAndUpdate(
            { battleId: battle._id, userId: req.userId },
            { battleId: battle._id, userId: req.userId },
            { upsert: true, new: true }
        );

        // Get updated participants
        const participants = await Participant.find({ battleId: battle._id })
            .populate("userId", "name username avatar")
            .lean();

        // Notify all in battle room via socket
        io.to(`battle_${battle._id}`).emit("battle_update", {
            type: "player_joined",
            participants,
            battleId: battle._id,
        });

        res.json({ battle, participants });
    } catch (e) {
        console.error("joinBattle error:", e);
        res.status(500).json({ error: "Server error" });
    }
}

// POST /api/battles/:id/start
export async function startBattle(req, res) {
    try {
        const battle = await Battle.findById(req.params.id);
        if (!battle) return res.status(404).json({ error: "Battle not found" });
        if (battle.createdBy.toString() !== req.userId) {
            return res.status(403).json({ error: "Only the creator can start the battle" });
        }
        if (battle.status !== "waiting") {
            return res.status(400).json({ error: "Battle already started" });
        }

        const count = await Participant.countDocuments({ battleId: battle._id });
        const halfCapacity = Math.ceil(battle.minPlayers / 2);
        if (count < halfCapacity) {
            return res.status(400).json({
                error: `Need at least ${halfCapacity} players (half of min players). Currently: ${count}`
            });
        }

        // We set a start time 5 seconds in the future for a countdown
        const startTime = new Date(Date.now() + 5000);
        battle.status = "live";
        battle.startTime = startTime;
        await battle.save();

        io.to(`battle_${battle._id}`).emit("battle_update", {
            type: "battle_started",
            startTime: battle.startTime,
            battleId: battle._id,
        });

        res.json(battle);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// POST /api/battles/:id/end
export async function endBattle(req, res) {
    try {
        const battle = await Battle.findById(req.params.id);
        if (!battle) return res.status(404).json({ error: "Battle not found" });

        // Check if requester is a participant
        const isParticipant = await Participant.exists({ battleId: battle._id, userId: req.userId });
        if (!isParticipant) {
            return res.status(403).json({ error: "Only participants can end the battle" });
        }

        battle.status = "completed";
        await battle.save();

        const leaderboard = await getLeaderboardData(battle._id);
        io.to(`battle_${battle._id}`).emit("battle_update", {
            type: "battle_ended",
            leaderboard,
            battleId: battle._id,
        });

        res.json(battle);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// POST /api/battles/:id/questions/:idx/complete
export async function completeQuestion(req, res) {
    try {
        const battle = await Battle.findById(req.params.id);
        if (!battle) return res.status(404).json({ error: "Battle not found" });
        if (battle.status !== "live") {
            return res.status(400).json({ error: "Battle is not live" });
        }

        const idx = parseInt(req.params.idx);
        if (isNaN(idx) || idx < 0 || idx >= battle.questions.length) {
            return res.status(400).json({ error: "Invalid question index" });
        }

        const participant = await Participant.findOne({ battleId: battle._id, userId: req.userId });
        if (!participant) return res.status(404).json({ error: "Not a participant" });

        if (!participant.completedQuestions.includes(idx)) {
            participant.completedQuestions.push(idx);

            // If all questions are done, mark as complete
            if (participant.completedQuestions.length === battle.questions.length) {
                participant.completed = true;
                participant.completedAt = new Date();
            }
            await participant.save();
        }

        const leaderboard = await getLeaderboardData(battle._id);
        
        // Check if all participants are finished
        const allFinished = leaderboard.every(p => p.completed);
        if (allFinished && leaderboard.length > 0) {
            battle.status = "completed";
            await battle.save();
            
            io.to(`battle_${battle._id}`).emit("battle_update", {
                type: "battle_all_finished",
                leaderboard,
                battleId: battle._id,
            });
        } else {
            io.to(`battle_${battle._id}`).emit("battle_update", {
                type: "participant_progress",
                leaderboard,
                battleId: battle._id,
            });
        }

        res.json(participant);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// POST /api/battles/:id/complete - mark user as done (Legacy but kept for safety)
export async function completeBattle(req, res) {
    try {
        const battle = await Battle.findById(req.params.id);
        if (!battle) return res.status(404).json({ error: "Battle not found" });
        if (battle.status !== "live") {
            return res.status(400).json({ error: "Battle is not live" });
        }

        const participant = await Participant.findOne({ battleId: battle._id, userId: req.userId });
        if (!participant) return res.status(404).json({ error: "Not a participant" });

        // Mark all questions as done
        participant.completedQuestions = battle.questions.map((_, i) => i);
        participant.completed = true;
        participant.completedAt = new Date();
        await participant.save();

        // Get leaderboard and emit update
        const leaderboard = await getLeaderboardData(battle._id);
        
        // Check if all finished
        const allFinished = leaderboard.every(p => p.completed);
        if (allFinished && leaderboard.length > 0) {
            battle.status = "completed";
            await battle.save();
            
            io.to(`battle_${battle._id}`).emit("battle_update", {
                type: "battle_all_finished",
                leaderboard,
                battleId: battle._id,
            });
        } else {
            io.to(`battle_${battle._id}`).emit("battle_update", {
                type: "participant_done",
                leaderboard,
                battleId: battle._id,
            });
        }

        res.json(participant);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// GET /api/battles/:id/leaderboard
export async function getLeaderboard(req, res) {
    try {
        const data = await getLeaderboardData(req.params.id);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}

// Helper: get sorted leaderboard
async function getLeaderboardData(battleId) {
    const completed = await Participant.find({ battleId, completed: true })
        .populate("userId", "name username avatar")
        .sort({ completedAt: 1 })
        .lean();

    const notDone = await Participant.find({ battleId, completed: false })
        .populate("userId", "name username avatar")
        .sort({ joinedAt: 1 })
        .lean();

    return [
        ...completed.map((p, i) => ({ ...p, rank: i + 1 })),
        ...notDone.map(p => ({ ...p, rank: null })),
    ];
}

// GET /api/battles/my - battles participated in or created by user
export async function getMyBattles(req, res) {
    try {
        // Find participants with this user ID
        const participations = await Participant.find({ userId: req.userId })
            .populate({
                path: "battleId",
                populate: { path: "createdBy", select: "name username avatar" }
            })
            .sort({ joinedAt: -1 })
            .lean();

        // Extract battle objects
        const battles = participations
            .filter(p => p.battleId) // in case battle was deleted
            .map(p => ({
                ...p.battleId,
                joinedAt: p.joinedAt,
                completed: p.completed,
                completedAt: p.completedAt
            }));

        res.json(battles);
    } catch (e) {
        console.error("getMyBattles error:", e);
        res.status(500).json({ error: "Server error" });
    }
}
