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
    const [ending, setEnding] = useState(false);
    const [copied, setCopied] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [preStartCountdown, setPreStartCountdown] = useState(null);

    const timer = useCountdown(battle?.startTime, battle?.duration);
    const battleIdRef = useRef(null);



    // Auto-end battle when timer expires (anyone can trigger this on their side, but backend handles creator check if needed)
    // Actually, based on user request, contest only ends when time is up.
    useEffect(() => {
        if (timer?.expired && battle?.status === "live") {
            // Trigger local end of battle view
            setBattle(prev => prev ? { ...prev, status: "completed" } : prev);
        }
    }, [timer?.expired, battle?.status]);

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

    const [showAllDoneOverlay, setShowAllDoneOverlay] = useState(false);

    useEffect(() => {
        if (!socket || !battleIdRef.current) return;
        socket.emit("join_battle_room", battleIdRef.current);
        socket.on("battle_update", (data) => {
            if (data.type === "player_joined") setParticipants(data.participants || []);
            else if (data.type === "battle_started") {
                setBattle(prev => prev ? { ...prev, status: "live", startTime: data.startTime } : prev);
                setShowLeaderboard(true);
            } else if (data.type === "participant_progress" || data.type === "participant_done") {
                setLeaderboard(data.leaderboard || []);
            } else if (data.type === "battle_all_finished") {
                setBattle(prev => prev ? { ...prev, status: "completed" } : prev);
                setLeaderboard(data.leaderboard || []);
                setShowAllDoneOverlay(true);
                setTimeout(() => {
                    navigate("/battle/create");
                }, 5000);
            } else if (data.type === "battle_ended") {
                setBattle(prev => prev ? { ...prev, status: "completed" } : prev);
                setLeaderboard(data.leaderboard || []);
            }
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

    async function completeQuestion(idx) {
        try {
            await api.post(`/battles/${battle._id}/questions/${idx}/complete`);
        } catch (e) { alert(e.response?.data?.error || "Failed to mark problem as done"); }
    }

    async function handleFinalizeAndExit() {
        try {
            // Officially mark battle as completed in DB if not already
            if (battle.status !== "completed") {
                await api.post(`/battles/${battle._id}/end`);
            }
            navigate("/battle/create");
        } catch (e) {
            console.error("Failed to end battle:", e);
            navigate("/battle/create"); // Navigate anyway
        }
    }

    function copyInviteLink() {
        navigator.clipboard.writeText(`${window.location.origin}/battle/${battle.inviteCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function getAvatar(user) {
        return user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}&backgroundColor=ffdfbf`;
    }

    const isCreator = (battle?.createdBy?._id || battle?.createdBy) === currentUserId;
    const isParticipant = participants?.some(p => (p.userId?._id || p.userId) === currentUserId);
    const myEntry = leaderboard?.find(p => (p.userId?._id || p.userId) === currentUserId);
    const completedCount = leaderboard?.filter(p => p.completed).length || 0;
    const allTeammatesDone = participants?.length > 0 && leaderboard?.length === participants?.length && leaderboard?.every(p => p.completed);
    const winner = (battle?.status === "completed" || timer?.expired || allTeammatesDone) && leaderboard?.length > 0 ? leaderboard[0] : null;

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/20 animate-pulse mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <p className="text-gray-400 font-medium">Loading battle room...</p>
                <p className="text-gray-600 text-xs mt-2">Connecting to arena...</p>
            </div>
        );
    }

    if (error || !battle) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-red-400 text-lg font-medium mb-4">{error || "Battle room unavailable"}</p>
                <button onClick={() => navigate("/battle/create")} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition">
                    Back to Battles
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-5 relative">
            {/* All Done Overlay */}
            {showAllDoneOverlay && (
                <div className="fixed inset-0 z-[110] bg-gray-950/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-2">Battle Finished!</h2>
                    <p className="text-gray-400 text-lg mb-8">All players have completed the challenge.</p>
                    
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-indigo-400 font-medium">
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Redirecting to dashboard...
                        </div>
                    </div>
                </div>
            )}

            {/* Countdown Overlay */}
            {preStartCountdown !== null && (
                <div className="fixed inset-0 z-[100] bg-gray-950/90 backdrop-blur-xl flex flex-col items-center justify-center">
                    <div className="text-gray-400 text-xl font-medium mb-4">Battle Starting In</div>
                    <div className="text-9xl font-black text-orange-500 animate-bounce">
                        {preStartCountdown}
                    </div>
                    <div className="mt-8 text-gray-500 flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Get ready to code!
                    </div>
                </div>
            )}

            {/* Winner Card */}
            {(battle?.status === "completed" || timer?.expired) && winner && (
                <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border border-yellow-500/40 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="text-5xl mb-4">👑</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Winner: {winner.userId?.name || winner.userId?.username}</h2>
                    <p className="text-yellow-400 font-medium">Congratulations! You've conquered the battle!</p>
                    {winner.completedAt && battle?.startTime && (
                        <p className="text-gray-500 text-sm mt-2">Finished in {Math.floor((new Date(winner.completedAt) - new Date(battle.startTime)) / 60000)} mins</p>
                    )}
                </div>
            )}

            {/* Header */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-2xl">⚔️</span>
                            <h1 className="text-2xl font-bold text-white">{battle?.title || "Untitled Battle"}</h1>
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${(battle?.status === "waiting" && !timer?.expired) ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                                    (battle?.status === "live" && !timer?.expired) ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                        "bg-gray-700/30 text-gray-400 border-gray-700"}`}>
                                {(battle?.status === "waiting" && !timer?.expired) ? "⏳ Waiting" : (battle?.status === "live" && !timer?.expired) ? "🔴 Live" : "✅ Completed"}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                            <span className={`px-2 py-0.5 rounded-full border text-xs capitalize ${DIFF_COLORS[battle?.difficulty || 'medium']}`}>{battle?.difficulty || 'medium'}</span>
                            <span>⏱ {battle?.duration || 0} min</span>
                            <span>👥 {participants?.length || 0} players</span>
                        </div>
                    </div>
                    {(battle?.status === "live" || (battle?.status === "waiting" && battle?.startTime)) && timer && (
                        <div className={`text-center px-5 py-3 rounded-xl border ${timer.expired ? "bg-red-500/20 border-red-500/40 text-red-400" :
                                timer.raw < 300000 ? "bg-orange-500/20 border-orange-500/40 text-orange-400" :
                                    "bg-gray-800 border-gray-700 text-white"}`}>
                            <div className="text-3xl font-mono font-bold">
                                {String(timer.mins || 0).padStart(2, "0")}:{String(timer.secs || 0).padStart(2, "0")}
                            </div>
                            <div className="text-xs opacity-70 mt-0.5">{timer.expired ? "Time's up!" : "remaining"}</div>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Invite Code</div>
                        <div className="font-mono text-xl font-bold text-orange-400 tracking-widest">{battle?.inviteCode || "—"}</div>
                    </div>
                    <button onClick={copyInviteLink} className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 border border-orange-500/30 text-sm rounded-lg transition">
                        {copied ? "✅ Copied!" : "📋 Copy Link"}
                    </button>
                </div>
            </div>

            {/* Problems */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-bold text-white mb-4">📋 Problems ({battle?.questions?.length || 0})</h2>
                <div className="space-y-3">
                    {(battle?.questions || []).map((q, idx) => {
                        const isDone = myEntry?.completedQuestions?.includes(idx);
                        return (
                            <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition ${isDone ? "bg-green-500/10 border-green-500/30" : "bg-gray-800/50 border-gray-700"}`}>
                                <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${isDone ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>{idx + 1}</span>
                                <a href={q} target="_blank" rel="noopener noreferrer"
                                    className="text-sm text-gray-300 hover:text-white truncate flex-1 group flex items-center gap-2">
                                    {q}
                                    <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                                {isParticipant && battle?.status === "live" && !timer?.expired && (
                                    <button
                                        onClick={() => completeQuestion(idx)}
                                        disabled={isDone}
                                        className={`p-2 rounded-lg border transition flex-shrink-0 ${isDone ? "bg-green-500/20 border-green-500/30 text-green-400 cursor-default" : "bg-gray-900 border-gray-700 text-gray-400 hover:border-orange-500/40 hover:text-white"}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Players */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                    👥 Players ({participants?.length || 0})
                    {battle && participants?.length < battle.minPlayers && (
                        <span className="ml-auto text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                            Need {(battle.minPlayers || 0) - (participants?.length || 0)} more to start
                        </span>
                    )}
                </h2>
                <div className="flex flex-wrap gap-2">
                    {participants?.map((p, idx) => {
                        const user = p.userId || {};
                        const isYou = (user._id || user) === currentUserId;
                        const isCr = (user._id || user) === (battle?.createdBy?._id || battle?.createdBy);
                        return (
                            <div key={idx} className="flex items-center gap-2 bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-700">
                                <img src={getAvatar(user)} alt="" className="w-8 h-8 rounded-full object-cover" />
                                <span className="text-sm text-gray-300">
                                    {user.name || user.username || "Player"}
                                    {isYou && <span className="text-xs text-indigo-400 ml-1">(you)</span>}
                                    {isCr && <span className="ml-1" title="Creator">👑</span>}
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
                        <span className="ml-auto text-xs text-gray-500">{completedCount}/{leaderboard?.length || 0} done</span>
                    </h2>
                    <div className="space-y-2">
                        {leaderboard?.map((entry, idx) => {
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
                                        <div className="text-[10px] text-gray-500 mt-0.5">
                                            {entry.completedQuestions?.length || 0}/{battle?.questions?.length || 0} solved
                                        </div>
                                    </span>
                                    {entry.completed ? (
                                        <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                                            ✅ {new Date(entry.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    ) : (
                                        <div className="flex gap-1">
                                            {battle?.questions?.map((_, i) => (
                                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${entry.completedQuestions?.includes(i) ? "bg-green-500" : "bg-gray-700"}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {leaderboard?.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No one finished yet. Be first!</p>}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pb-4">
                {!isParticipant && battle?.status === "waiting" && (
                    <button onClick={joinBattle} disabled={joining}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-500/20">
                        {joining ? "Joining..." : "⚔️ Join Battle"}
                    </button>
                )}
                {battle?.status === "waiting" && isParticipant && (
                    <button onClick={startBattle} disabled={starting || (participants?.length || 0) < Math.ceil((battle?.minPlayers || 2) / 2)}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-lg shadow-green-500/20">
                        {starting ? "Starting..." : `🚀 Start Battle (${participants?.length || 0}/${battle?.minPlayers || 2})`}
                    </button>
                )}
                {allTeammatesDone && (
                    <button onClick={handleFinalizeAndExit}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30 animate-pulse">
                        🏁 End Battle & Exit
                    </button>
                )}
                {myEntry?.completed && !timer?.expired && !allTeammatesDone && (
                    <div className="flex-1 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold rounded-xl text-center">
                        ✅ You finished! (Waiting for others...)
                    </div>
                )}
            </div>
        </div>
    );
}