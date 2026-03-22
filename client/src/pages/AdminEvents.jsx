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
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

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
                                    onClick={() => setSelectedEvent(ev)}
                                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-indigo-500/50 hover:bg-gray-800/30 transition cursor-pointer group"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                                        {/* Image Preview */}
                                        <div 
                                            className="w-full sm:w-40 aspect-video bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 relative group/img"
                                            onClick={(e) => {
                                                if (ev.image) {
                                                    e.stopPropagation();
                                                    setPreviewImage(ev.image);
                                                }
                                            }}
                                        >
                                            {ev.image ? (
                                                <>
                                                    <img src={ev.image} alt={ev.title} className="w-full h-full object-cover transition duration-300 group-hover/img:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                        </svg>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-[10px] uppercase tracking-widest bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">
                                                    {ev.type || "Hackathon"}
                                                </span>
                                                <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition">{ev.title}</h3>
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ml-auto sm:ml-0 ${STATUS_STYLES[ev.status]}`}>
                                                    {ev.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{ev.description}</p>
                                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                <span>📅 {formatDate(ev.date)}</span>
                                                <span className="capitalize">🌐 {ev.mode}</span>
                                                {ev.location && <span>📍 {ev.location}</span>}
                                                <span>👥 Team of {ev.teamSize}</span>
                                                <span>By: <span className="text-gray-400">{ev.createdBy?.name || "Unknown"}</span> ({ev.createdBy?.email})</span>
                                            </div>
                                            {ev.registrationLink && (
                                                <a
                                                    href={ev.registrationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-xs text-indigo-400 hover:underline mt-2 inline-block truncate max-w-full relative z-10"
                                                >
                                                    🔗 {ev.registrationLink}
                                                </a>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex sm:flex-col gap-2 flex-shrink-0 relative z-10" onClick={(e) => e.stopPropagation()}>
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

            {/* Image Preview Modal */}
            {previewImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh]">
                        <button 
                            className="absolute -top-12 right-0 text-white/70 hover:text-white transition p-2"
                            onClick={() => setPreviewImage(null)}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img 
                            src={previewImage} 
                            alt="Hackathon Banner Preview" 
                            className="w-full h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            {/* Full Detail View Modal */}
            {selectedEvent && (
                <div 
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div 
                        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header Image */}
                        <div className="relative aspect-[21/9] w-full bg-gray-800">
                            {selectedEvent.image ? (
                                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition border border-white/10"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full">
                                    {selectedEvent.type || "Hackathon"}
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_STYLES[selectedEvent.status]}`}>
                                    {selectedEvent.status}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest bg-gray-800 text-gray-400 border border-gray-700 px-3 py-1 rounded-full ml-auto">
                                    {formatDate(selectedEvent.date)}
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                            <p className="text-gray-500 text-sm mb-6">Hosted by: <span className="text-gray-300 font-medium">{selectedEvent.createdBy?.name}</span> ({selectedEvent.createdBy?.email})</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 tracking-widest">Event Mode</p>
                                    <p className="text-gray-200 font-semibold capitalize">{selectedEvent.mode}</p>
                                </div>
                                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 tracking-widest">Pricing</p>
                                    <p className="text-gray-200 font-semibold">{selectedEvent.price || "Free"}</p>
                                </div>
                                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 tracking-widest">Team Size</p>
                                    <p className="text-gray-200 font-semibold">Max {selectedEvent.teamSize} members</p>
                                </div>
                                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1 tracking-widest">Location</p>
                                    <p className="text-gray-200 font-semibold truncate">{selectedEvent.location || (selectedEvent.mode === "online" ? "Virtual" : "TBA")}</p>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    About the Event
                                </h3>
                                <div className="text-gray-400 whitespace-pre-wrap leading-relaxed bg-gray-800/20 p-4 rounded-xl border border-gray-800/50">
                                    {selectedEvent.description}
                                </div>
                            </div>

                            {selectedEvent.registrationLink && (
                                <div className="mt-8">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Official Link</h3>
                                    <a
                                        href={selectedEvent.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition break-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        {selectedEvent.registrationLink}
                                    </a>
                                </div>
                            )}

                            {/* Sticky Modal Actions */}
                            <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row gap-4">
                                {selectedEvent.status !== "approved" && (
                                    <button
                                        onClick={() => {
                                            handleAction(selectedEvent._id, "approve");
                                            setSelectedEvent(null);
                                        }}
                                        className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-lg shadow-green-600/20"
                                    >
                                        Approve Hackathon
                                    </button>
                                )}
                                {selectedEvent.status !== "rejected" && (
                                    <button
                                        onClick={() => {
                                            handleAction(selectedEvent._id, "reject");
                                            setSelectedEvent(null);
                                        }}
                                        className="flex-1 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold rounded-xl transition"
                                    >
                                        Reject Submission
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl transition border border-gray-700"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
