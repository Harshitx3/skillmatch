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
        if (count < battle.minPlayers) {
            return res.status(400).json({
                error: `Need at least ${battle.minPlayers} players. Currently: ${count}`
            });
        }

        battle.status = "live";
        battle.startTime = new Date();
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

// POST /api/battles/:id/complete - mark user as done
export async function completeBattle(req, res) {
    try {
        const battle = await Battle.findById(req.params.id);
        if (!battle) return res.status(404).json({ error: "Battle not found" });
        if (battle.status !== "live") {
            return res.status(400).json({ error: "Battle is not live" });
        }

        const participant = await Participant.findOneAndUpdate(
            { battleId: battle._id, userId: req.userId, completed: false },
            { completed: true, completedAt: new Date() },
            { new: true }
        );
        if (!participant) {
            return res.status(400).json({ error: "Already marked as done or not a participant" });
        }

        // Get leaderboard and emit update
        const leaderboard = await getLeaderboardData(battle._id);
        io.to(`battle_${battle._id}`).emit("battle_update", {
            type: "participant_done",
            leaderboard,
            battleId: battle._id,
        });

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

// GET /api/battles/my - battles created by user
export async function getMyBattles(req, res) {
    try {
        const battles = await Battle.find({ createdBy: req.userId })
            .sort({ createdAt: -1 })
            .lean();
        res.json(battles);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
}
