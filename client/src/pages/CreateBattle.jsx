import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";

const DIFFICULTIES = ["easy", "medium", "hard", "mixed"];

export default function CreateBattle() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        difficulty: "medium",
        duration: 60,
        minPlayers: 2,
        questions: [""],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    return (
        <div className="max-w-2xl mx-auto py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        Create Battle
                    </h1>
                </div>
                <p className="text-gray-400">Set up a private coding battle and invite your friends</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Battle Title *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Friday DSA Showdown"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                    />
                </div>

                {/* Difficulty, Duration, Min Players */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Difficulty</label>
                        <select
                            name="difficulty"
                            value={form.difficulty}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition capitalize"
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
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
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
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                        />
                    </div>
                </div>

                {/* Problem Links */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-gray-300">Problem Links *</label>
                        <span className="text-xs text-gray-500">{form.questions.length}/10</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Add LeetCode, Codeforces, or any DSA problem links</p>
                    <div className="space-y-3">
                        {form.questions.map((q, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input
                                    value={q}
                                    onChange={e => handleQuestionChange(idx, e.target.value)}
                                    placeholder={`Problem ${idx + 1} URL (e.g. https://leetcode.com/problems/...)`}
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500 transition"
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
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Creating...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Create Battle
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
