import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api.js";

const MODE_COLORS = {
    online: "bg-green-500/20 text-green-400 border-green-500/30",
    offline: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const STATUS_COLORS = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function MyHackathons() {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editForm, setEditForm] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get("/events/my");
                setMyEvents(data);
            } catch { }
            finally { setLoading(false); }
        }
        load();
    }, []);

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });
    }

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this hackathon?")) return;
        try {
            await api.delete(`/events/${id}`);
            setMyEvents(prev => prev.filter(e => e._id !== id));
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete");
        }
    }

    function startEdit(event) {
        setEditingEvent(event._id);
        setEditForm({
            title: event.title,
            description: event.description,
            date: event.date?.split('T')[0],
            mode: event.mode,
            location: event.location || "",
            registrationLink: event.registrationLink || "",
            teamSize: event.teamSize,
        });
    }

    async function handleUpdate(id) {
        try {
            const { data } = await api.put(`/events/${id}`, editForm);
            setMyEvents(prev => prev.map(e => e._id === id ? data : e));
            setEditingEvent(null);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to update");
        }
    }

    if (loading) {
        return (
            <div className="py-6">
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-32 rounded-xl bg-gray-900/50 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        📋 My Hackathons
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {myEvents.length > 0 ? `You have ${myEvents.length} hackathon${myEvents.length !== 1 ? "s" : ""}` : "You haven't hosted any hackathons yet"}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/hackathons"
                        className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition text-sm"
                    >
                        ← All Hackathons
                    </Link>
                    <Link
                        to="/host-hackathon"
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition text-sm"
                    >
                        + Host New
                    </Link>
                </div>
            </div>

            {myEvents.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Hackathons Yet</h3>
                    <p className="text-gray-500 mb-6">Host your first hackathon to see it here!</p>
                    <Link
                        to="/host-hackathon"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition"
                    >
                        Host a Hackathon
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {myEvents.map(ev => (
                        <div key={ev._id} className="bg-gray-900/70 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
                            {editingEvent === ev._id ? (
                                // Edit Form
                                <div className="space-y-4">
                                    <input
                                        value={editForm.title}
                                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                        placeholder="Title"
                                    />
                                    <textarea
                                        value={editForm.description}
                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                        rows={2}
                                        placeholder="Description"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="date"
                                            value={editForm.date}
                                            onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                        />
                                        <select
                                            value={editForm.mode}
                                            onChange={e => setEditForm({ ...editForm, mode: e.target.value })}
                                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                        >
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                        </select>
                                    </div>
                                    <input
                                        value={editForm.location}
                                        onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                        placeholder="Location"
                                    />
                                    <input
                                        value={editForm.registrationLink}
                                        onChange={e => setEditForm({ ...editForm, registrationLink: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                        placeholder="Registration Link"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdate(ev._id)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                                        >
                                            ✅ Save
                                        </button>
                                        <button
                                            onClick={() => setEditingEvent(null)}
                                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                                        >
                                            ❌ Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <h3 className="font-bold text-white text-lg">{ev.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[ev.status]}`}>
                                                {ev.status === "pending" ? "⏳ Pending" : ev.status === "approved" ? "✅ Approved" : "❌ Rejected"}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${MODE_COLORS[ev.mode]}`}>
                                                {ev.mode}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-2">{ev.description}</p>
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                            <span>📅 {formatDate(ev.date)}</span>
                                            {ev.location && <span>📍 {ev.location}</span>}
                                            <span>👥 Team of {ev.teamSize}</span>
                                        </div>
                                        {ev.registrationLink && (
                                            <a
                                                href={ev.registrationLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-indigo-400 hover:underline mt-2 inline-block"
                                            >
                                                🔗 {ev.registrationLink}
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex sm:flex-col gap-2">
                                        <button
                                            onClick={() => startEdit(ev)}
                                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 rounded-lg text-sm"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ev._id)}
                                            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-lg text-sm"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
