import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";

export default function HostHackathon() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        mode: "online",
        location: "",
        registrationLink: "",
        teamSize: 2,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/events/create", {
                ...form,
                teamSize: Number(form.teamSize),
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to submit hackathon");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="max-w-lg mx-auto mt-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Hackathon Submitted!</h2>
                <p className="text-gray-400 mb-8">
                    Your hackathon is under review. Once approved by an admin, it will appear in the public listing.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => { setSuccess(false); setForm({ title: "", description: "", date: "", mode: "online", location: "", registrationLink: "", teamSize: 2 }); }}
                        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
                    >
                        Submit Another
                    </button>
                    <button
                        onClick={() => navigate("/hackathons")}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition text-sm"
                    >
                        View Hackathons
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Host a Hackathon
                </h1>
                <p className="text-gray-400 mt-2">
                    Submit your hackathon for review. It will be visible to all users once approved.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Hackathon Title *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. HackIndia 2026"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Description *</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Describe your hackathon, themes, prizes, eligibility..."
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                    />
                </div>

                {/* Date & Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Event Date *</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Mode *</label>
                        <select
                            name="mode"
                            value={form.mode}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                        >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>
                </div>

                {/* Location */}
                {form.mode === "offline" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="e.g. IIT Delhi, New Delhi"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                )}

                {/* Registration Link & Team Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Registration Link</label>
                        <input
                            name="registrationLink"
                            value={form.registrationLink}
                            onChange={handleChange}
                            placeholder="https://devpost.com/..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Team Size</label>
                        <input
                            type="number"
                            name="teamSize"
                            value={form.teamSize}
                            onChange={handleChange}
                            min={1}
                            max={10}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Submit for Review
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
