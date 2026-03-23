import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api.js";

const DIFFICULTIES = ["easy", "medium", "hard", "mixed"];

export default function CreateBattle() {
    const navigate = useNavigate();
    const [view, setView] = useState("dashboard"); // dashboard, create, join
    const [form, setForm] = useState({
        title: "",
        difficulty: "medium",
        duration: 60,
        minPlayers: 2,
        questions: [""],
    });
    const [joinCode, setJoinCode] = useState("");
    const [myBattles, setMyBattles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyBattles();
    }, []);

    async function fetchMyBattles() {
        try {
            const { data } = await api.get("/api/battles/my");
            setMyBattles(data);
        } catch (err) {
            console.error("fetchMyBattles error:", err);
        }
    }

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleQuestionChange(idx, value) {
        setForm(prev => {
            const questions = [...prev.questions];
            questions[idx] = value;
            return { ...prev, questions };
        });
    }

    function addQuestion() {
        if (form.questions.length >= 10) return;
        setForm(prev => ({ ...prev, questions: [...prev.questions, ""] }));
    }

    function removeQuestion(idx) {
        if (form.questions.length <= 1) return;
        setForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
    }

    async function handleJoin(e) {
        e.preventDefault();
        if (!joinCode.trim()) return;
        setLoading(true);
        setError("");
        try {
            const { data } = await api.post(`/battles/${joinCode.toUpperCase()}/join`);
            navigate(`/battle/${data.battle.inviteCode}`);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to join battle. Check your code.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const validQuestions = form.questions.filter(q => q.trim());
        if (validQuestions.length === 0) {
            setError("Add at least one problem link");
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post("/battles/create", {
                ...form,
                duration: Number(form.duration),
                minPlayers: Number(form.minPlayers),
                questions: validQuestions,
            });
            navigate(`/battle/${data.inviteCode}`);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create battle");
        } finally {
            setLoading(false);
        }
    }

    if (view === "create") {
        return (
            <div className="max-w-2xl mx-auto py-8 px-4">
                <button
                    onClick={() => setView("dashboard")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Battles
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        Create Battle
                    </h1>
                    <p className="text-gray-400">Set up a private coding battle and invite your friends</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Battle Title *</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Friday DSA Showdown"
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Difficulty</label>
                            <select
                                name="difficulty"
                                value={form.difficulty}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition capitalize"
                            >
                                {DIFFICULTIES.map(d => (
                                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Duration (min)</label>
                            <input
                                type="number"
                                name="duration"
                                value={form.duration}
                                onChange={handleChange}
                                min={10}
                                max={300}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Min Players</label>
                            <input
                                type="number"
                                name="minPlayers"
                                value={form.minPlayers}
                                onChange={handleChange}
                                min={1}
                                max={20}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-gray-300">Problem Links *</label>
                            <span className="text-xs text-gray-500">{form.questions.length}/10</span>
                        </div>
                        <div className="space-y-3">
                            {form.questions.map((q, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        value={q}
                                        onChange={e => handleQuestionChange(idx, e.target.value)}
                                        placeholder={`Problem ${idx + 1} URL (e.g. https://leetcode.com/problems/...)`}
                                        className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500 transition"
                                    />
                                    {form.questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(idx)}
                                            className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {form.questions.length < 10 && (
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="mt-3 flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Problem
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                    >
                        {loading ? "Creating..." : "Create Battle"}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 bg-clip-text text-transparent mb-2">
                        ⚔️ Coding Battles
                    </h1>
                    <p className="text-gray-400 text-lg">Compete with friends and sharpen your DSA skills</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setView("create")}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Join Section */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">Join with Code</h2>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">Enter the 8-character invite code shared by your friend.</p>
                        <form onSubmit={handleJoin} className="space-y-4">
                            <input
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="E.G. 8A2B3C4D"
                                maxLength={8}
                                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-indigo-500 transition"
                            />
                            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading || joinCode.length < 4}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition"
                            >
                                {loading ? "Joining..." : "Join Battle"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Past Battles */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-white">Your Past Contests</h2>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">{myBattles.length} Total</span>
                        </div>

                        {myBattles.length > 0 ? (
                            <div className="space-y-4">
                                {myBattles.map(battle => (
                                    <Link
                                        key={battle._id}
                                        to={`/battle/${battle.inviteCode}`}
                                        className="block bg-gray-950/50 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="hidden sm:block">
                                                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold border ${battle.status === 'live' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                                                        <span>{new Date(battle.createdAt).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                        <span className="text-base leading-none">{new Date(battle.createdAt).getDate()}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-orange-400 transition">{battle.title}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-gray-500 capitalize">{battle.difficulty}</span>
                                                        <span className="text-xs text-gray-700">•</span>
                                                        <span className="text-xs text-gray-500">{battle.questions?.length} Problems</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-xs px-2 py-1 rounded-md mb-2 inline-block ${battle.status === 'live' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : battle.status === 'completed' ? 'bg-gray-800 text-gray-400' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                                                    {battle.status.charAt(0).toUpperCase() + battle.status.slice(1)}
                                                </div>
                                                <p className="text-[10px] text-gray-600">Created by {battle.createdBy?.username || 'You'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-400 font-medium">No battles yet</h3>
                                <p className="text-gray-600 text-sm mt-1">Join or create a battle to start competing!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
