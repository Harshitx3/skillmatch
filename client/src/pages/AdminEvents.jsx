import { useEffect, useState } from "react";
import api from "../lib/api.js";

const STATUS_STYLES = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const adminStatus = localStorage.getItem("isAdmin") === "true";
        setIsAdmin(adminStatus);
        setChecking(false);
        if (adminStatus) {
            load();
        } else {
            setLoading(false);
        }
    }, []);

    async function load() {
        try {
            const { data } = await api.get("/events/admin");
            setEvents(data);
        } catch {
            alert("Access denied. Admin only.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAction(id, action) {
        setActionLoading(id + action);
        try {
            await api.put(`/events/${id}/${action}`);
            setEvents(prev => prev.map(e => e._id === id ? { ...e, status: action === "approve" ? "approved" : "rejected" } : e));
        } catch (err) {
            alert(err.response?.data?.error || "Action failed");
        } finally {
            setActionLoading(null);
        }
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });
    }

    const filtered = filter === "all" ? events : events.filter(e => e.status === filter);

    const counts = {
        all: events.length,
        pending: events.filter(e => e.status === "pending").length,
        approved: events.filter(e => e.status === "approved").length,
        rejected: events.filter(e => e.status === "rejected").length,
    };

    return (
        <div className="py-6">
            {/* Access Denied */}
            {!isAdmin && !checking && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-gray-400 mb-6">This page is restricted to administrators only.</p>
                    <a href="/" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition">
                        Go Home
                    </a>
                </div>
            )}

            {isAdmin && (
                <>
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            Admin: Events Panel
                        </h1>
                        <p className="text-gray-400 mt-1">Review and manage submitted hackathons</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {["all", "pending", "approved", "rejected"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition capitalize ${filter === tab
                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                    : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                                    }`}
                            >
                                {tab}
                                <span className="ml-1.5 text-xs opacity-70">({counts[tab]})</span>
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-28 rounded-xl bg-gray-900/50 animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <p>No {filter !== "all" ? filter : ""} events found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map(ev => (
                                <div
                                    key={ev._id}
                                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <h3 className="font-bold text-white text-lg">{ev.title}</h3>
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${STATUS_STYLES[ev.status]}`}>
                                                    {ev.status}
                                                </span>
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${ev.mode === "online" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                                    }`}>
                                                    {ev.mode}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{ev.description}</p>
                                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                <span>📅 {formatDate(ev.date)}</span>
                                                {ev.location && <span>📍 {ev.location}</span>}
                                                <span>👥 Team of {ev.teamSize}</span>
                                                <span>By: <span className="text-gray-400">{ev.createdBy?.name || "Unknown"}</span> ({ev.createdBy?.email})</span>
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

                                        {/* Actions */}
                                        <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                            {ev.status !== "approved" && (
                                                <button
                                                    onClick={() => handleAction(ev._id, "approve")}
                                                    disabled={actionLoading === ev._id + "approve"}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
                                                >
                                                    {actionLoading === ev._id + "approve" ? "..." : "✓ Approve"}
                                                </button>
                                            )}
                                            {ev.status !== "rejected" && (
                                                <button
                                                    onClick={() => handleAction(ev._id, "reject")}
                                                    disabled={actionLoading === ev._id + "reject"}
                                                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 disabled:opacity-50 text-red-400 border border-red-500/30 text-sm font-medium rounded-lg transition"
                                                >
                                                    {actionLoading === ev._id + "reject" ? "..." : "✗ Reject"}
                                                </button>
                                            )}
                                            {ev.status === "approved" && ev.status !== "rejected" && (
                                                <button
                                                    onClick={() => handleAction(ev._id, "reject")}
                                                    disabled={actionLoading === ev._id + "reject"}
                                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm rounded-lg transition"
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
