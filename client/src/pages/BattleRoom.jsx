import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api.js";
import { useSocket } from "../contexts/SocketContext.jsx";

const DIFF_COLORS = {
    easy: "text-green-400 bg-green-500/10 border-green-500/20",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    hard: "text-red-400 bg-red-500/10 border-red-500/20",
    mixed: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

function useCountdown(startTime, durationMin) {
    const [timeLeft, setTimeLeft] = useState(null);
    useEffect(() => {
        if (!startTime) { setTimeLeft(null); return; }
        const endTime = new Date(startTime).getTime() + durationMin * 60 * 1000;
        function tick() {
            const left = Math.max(0, endTime - Date.now());
            setTimeLeft(left);
            if (left === 0) clearInterval(timer);
        }
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [startTime, durationMin]);
    if (timeLeft === null) return null;
    return {
        mins: Math.floor(timeLeft / 60000),
        secs: Math.floor((timeLeft % 60000) / 1000),
        expired: timeLeft === 0,
        raw: timeLeft
    };
}

export default function BattleRoom() {
    const { code } = useParams();
    const navigate = useNavigate();
    const { socket } = useSocket();

    const [battle, setBattle] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [joining, setJoining] = useState(false);
    const [starting, setStarting] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const timer = useCountdown(battle?.startTime, battle?.duration);
    const battleIdRef = useRef(null);

    useEffect(() => {
        api.get("/users/me").then(({ data }) => setCurrentUserId(data._id)).catch(() => { });
    }, []);

    const loadBattle = useCallback(async () => {
        try {
            const { data } = await api.get(`/battles/${code}`);
            setBattle(data);
            setParticipants(data.participants || []);
            battleIdRef.current = data._id;
            if (data.status !== "waiting") {
                const lb = await api.get(`/battles/${data._id}/leaderboard`);
                setLeaderboard(lb.data);
                setShowLeaderboard(true);
            }
        } catch (e) {
            setError(e.response?.data?.error || "Battle not found");
        } finally {
            setLoading(false);
        }
    }, [code]);

    useEffect(() => { loadBattle(); }, [loadBattle]);

    useEffect(() => {
        if (!socket || !battleIdRef.current) return;
        socket.emit("join_battle_room", battleIdRef.current);
        socket.on("battle_update", (data) => {
            if (data.type === "player_joined") setParticipants(data.participants || []);
            else if (data.type === "battle_started") {
                setBattle(prev => prev ? { ...prev, status: "live", startTime: data.startTime } : prev);
                setShowLeaderboard(true);
            } else if (data.type === "participant_done") setLeaderboard(data.leaderboard || []);
        });
        return () => {
            socket.emit("leave_battle_room", battleIdRef.current);
            socket.off("battle_update");
        };
    }, [socket, battle?._id]);

    async function joinBattle() {
        setJoining(true);
        try {
            const { data } = await api.post(`/battles/${code}/join`);
            setParticipants(data.participants || []);
        } catch (e) { alert(e.response?.data?.error || "Failed to join"); }
        finally { setJoining(false); }
    }

    async function startBattle() {
        setStarting(true);
        try {
            const { data } = await api.post(`/battles/${battle._id}/start`);
            setBattle(prev => ({ ...prev, status: "live", startTime: data.startTime }));
            setShowLeaderboard(true);
        } catch (e) { alert(e.response?.data?.error || "Cannot start"); }
        finally { setStarting(false); }
    }

    async function markDone() {
        setCompleting(true);
        try {
            await api.post(`/battles/${battle._id}/complete`);
            const lb = await api.get(`/battles/${battle._id}/leaderboard`);
            setLeaderboard(lb.data);
        } catch (e) { alert(e.response?.data?.error || "Failed"); }
        finally { setCompleting(false); }
    }

    function copyInviteLink() {
        navigator.clipboard.writeText(`${window.location.origin}/battle/${battle.inviteCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function getAvatar(user) {
        return user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}&backgroundColor=ffdfbf`;
    }

    const isParticipant = participants.some(p => (p.userId?._id || p.userId) === currentUserId);
    const isCreator = (battle?.createdBy?._id || battle?.createdBy) === currentUserId;
    const myEntry = leaderboard.find(p => (p.userId?._id || p.userId) === currentUserId);
    const completedCount = leaderboard.filter(p => p.completed).length;

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/20 animate-pulse mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <p className="text-gray-400">Loading battle room...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto py-12 text-center">
                <p className="text-red-400 text-lg font-medium mb-4">{error}</p>
                <button onClick={() => navigate("/battle/create")} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition">
                    Create a Battle
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-6 space-y-5">
            {/* Header */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-2xl">⚔️</span>
                            <h1 className="text-2xl font-bold text-white">{battle.title}</h1>
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${battle.status === "waiting" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                                    battle.status === "live" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                        "bg-gray-700/30 text-gray-400 border-gray-700"}`}>
                                {battle.status === "waiting" ? "⏳ Waiting" : battle.status === "live" ? "🔴 Live" : "✅ Completed"}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                            <span className={`px-2 py-0.5 rounded-full border text-xs capitalize ${DIFF_COLORS[battle.difficulty]}`}>{battle.difficulty}</span>
                            <span>⏱ {battle.duration} min</span>
                            <span>👥 {participants.length} players</span>
                        </div>
                    </div>
                    {battle.status === "live" && timer && (
                        <div className={`text-center px-5 py-3 rounded-xl border ${timer.expired ? "bg-red-500/20 border-red-500/40 text-red-400" :
                                timer.raw < 300000 ? "bg-orange-500/20 border-orange-500/40 text-orange-400" :
                                    "bg-gray-800 border-gray-700 text-white"}`}>
                            <div className="text-3xl font-mono font-bold">
                                {String(timer.mins).padStart(2, "0")}:{String(timer.secs).padStart(2, "0")}
                            </div>
                            <div className="text-xs opacity-70 mt-0.5">{timer.expired ? "Time's up!" : "remaining"}</div>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Invite Code</div>
                        <div className="font-mono text-xl font-bold text-orange-400 tracking-widest">{battle.inviteCode}</div>
                    </div>
                    <button onClick={copyInviteLink} className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 border border-orange-500/30 text-sm rounded-lg transition">
                        {copied ? "✅ Copied!" : "📋 Copy Link"}
                    </button>
                </div>
            </div>

            {/* Problems */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-bold text-white mb-4">📋 Problems ({battle.questions?.length || 0})</h2>
                <div className="space-y-2">
                    {(battle.questions || []).map((q, idx) => (
                        <a key={idx} href={q} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700 hover:border-orange-500/40 transition group">
                            <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                            <span className="text-sm text-gray-300 group-hover:text-white truncate flex-1">{q}</span>
                            <svg className="w-4 h-4 text-gray-600 group-hover:text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>

            {/* Players */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                    👥 Players ({participants.length})
                    {participants.length < battle.minPlayers && (
                        <span className="ml-auto text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                            Need {battle.minPlayers - participants.length} more to start
                        </span>
                    )}
                </h2>
                <div className="flex flex-wrap gap-2">
                    {participants.map((p, idx) => {
                        const user = p.userId || {};
                        const isYou = (user._id || user) === currentUserId;
                        const isCr = (user._id || user) === (battle.createdBy?._id || battle.createdBy);
                        return (
                            <div key={idx} className="flex items-center gap-2 bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-700">
                                <img src={getAvatar(user)} alt="" className="w-8 h-8 rounded-full object-cover" />
                                <span className="text-sm text-gray-300">
                                    {user.name || user.username || "Player"}
                                    {isYou && <span className="text-xs text-indigo-400 ml-1">(you)</span>}
                                    {isCr && <span className="ml-1">👑</span>}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Leaderboard */}
            {showLeaderboard && (
                <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
                    <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                        🏆 Leaderboard
                        <span className="ml-auto text-xs text-gray-500">{completedCount}/{leaderboard.length} done</span>
                    </h2>
                    <div className="space-y-2">
                        {leaderboard.map((entry, idx) => {
                            const user = entry.userId || {};
                            const isYou = (user._id || user) === currentUserId;
                            const rankEmoji = idx === 0 && entry.completed ? "🥇" : idx === 1 && entry.completed ? "🥈" : idx === 2 && entry.completed ? "🥉" : entry.completed ? `#${idx + 1}` : "—";
                            return (
                                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${isYou ? "bg-indigo-500/10 border-indigo-500/30" : "bg-gray-800/40 border-gray-700"}`}>
                                    <span className="text-lg w-8 text-center flex-shrink-0">{rankEmoji}</span>
                                    <img src={getAvatar(user)} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                    <span className="flex-1 text-sm font-medium text-gray-200">
                                        {user.name || user.username || "Player"}
                                        {isYou && <span className="text-xs text-indigo-400 ml-1">(you)</span>}
                                    </span>
                                    {entry.completed ? (
                                        <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                                            ✅ {new Date(entry.completedAt).toLocaleTimeString()}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-500 italic">In progress...</span>
                                    )}
                                </div>
                            );
                        })}
                        {leaderboard.length === 0 && <p className="text-gray-500 text-sm">No one finished yet. Be first!</p>}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pb-4">
                {!isParticipant && battle.status === "waiting" && (
                    <button onClick={joinBattle} disabled={joining}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl transition">
                        {joining ? "Joining..." : "⚔️ Join Battle"}
                    </button>
                )}
                {isCreator && battle.status === "waiting" && isParticipant && (
                    <button onClick={startBattle} disabled={starting || participants.length < battle.minPlayers}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition">
                        {starting ? "Starting..." : `🚀 Start (${participants.length}/${battle.minPlayers} players)`}
                    </button>
                )}
                {isParticipant && battle.status === "live" && !myEntry?.completed && (
                    <button onClick={markDone} disabled={completing}
                        className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold rounded-xl transition">
                        {completing ? "Marking..." : "🏁 Mark All Done"}
                    </button>
                )}
                {myEntry?.completed && (
                    <div className="flex-1 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold rounded-xl text-center">
                        ✅ You finished!
                    </div>
                )}
            </div>
        </div>
    );
}