import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api.js";

const MODE_COLORS = {
    online: "bg-green-500/20 text-green-400 border-green-500/30",
    offline: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default function Hackathons() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterMode, setFilterMode] = useState("All");
    const [filterPrice, setFilterPrice] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get("/api/events");
                setEvents(data);
            } catch { 
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filteredEvents = events.filter(ev => {
        const matchesSearch = ev.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || ev.type === filterType;
        const matchesMode = filterMode === "All" || ev.mode === filterMode;
        const matchesPrice = filterPrice === "All" || ev.price === filterPrice;
        return matchesSearch && matchesType && matchesMode && matchesPrice;
    });

    const types = ["All", ...new Set([
        "Hackathon",
        "AI",
        "Web Development",
        "App Development",
        "Blockchain",
        "Cybersecurity",
        "Open for All",
        ...events.map(e => e.type).filter(Boolean)
    ])];

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });
    }

    function daysLeft(dateStr) {
        const diff = Math.ceil((new Date(dateStr) - Date.now()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return "Ended";
        if (diff === 0) return "Today!";
        return `${diff} days left`;
    }

    return (
        <div className="py-6">
            {/* My Hackathons Link */}
            {token && (
                <div className="mb-6">
                    <Link
                        to="/my-hackathons"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg transition text-sm"
                    >
                        <span>📋</span>
                        My Hackathons
                    </Link>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        All Hackathons
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {events.length > 0 ? `${events.length} upcoming event${events.length !== 1 ? "s" : ""}` : "No events yet"}
                    </p>
                </div>
                {token && (
                    <Link
                        to="/host-hackathon"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Host a Hackathon
                    </Link>
                )}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search hackathons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#161822] border border-gray-800 rounded-full px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-sm transition"
                    />
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition shadow-sm ${showFilters ? "bg-indigo-600 border-indigo-600 text-white" : "bg-[#161822] border-gray-800 text-gray-300 hover:border-gray-700 hover:bg-[#1f2233]"}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                        <span className="flex items-center justify-center w-5 h-5 bg-indigo-500 text-white text-[10px] rounded-full">1</span>
                    </button>
                </div>
            </div>

            {/* Filter Panel (Dark Theme) */}
            {showFilters && (
                <div className="mb-8 p-6 bg-[#161822] border border-gray-800 rounded-2xl shadow-xl animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Event Type</label>
                            <div className="flex flex-wrap gap-2">
                                {types.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFilterType(t)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterType === t ? "bg-indigo-600 text-white" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mode Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Mode</label>
                            <div className="flex gap-2">
                                {["All", "online", "offline"].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setFilterMode(m)}
                                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${filterMode === m ? "bg-indigo-600 text-white" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Pricing</label>
                            <div className="flex gap-2">
                                {["All", "Free", "Paid"].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setFilterPrice(p)}
                                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterPrice === p ? "bg-indigo-600 text-white" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end">
                        <button
                            onClick={() => {
                                setFilterType("All");
                                setFilterMode("All");
                                setFilterPrice("All");
                                setSearchTerm("");
                            }}
                            className="text-xs font-bold text-gray-500 hover:text-indigo-400 transition uppercase tracking-widest"
                        >
                            Reset All Filters
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-56 rounded-2xl bg-gray-900/50 animate-pulse" />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Hackathons Yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to host a hackathon!</p>
                    {token && (
                        <Link
                            to="/host-hackathon"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition"
                        >
                            Host Now
                        </Link>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {filteredEvents.map(ev => {
                        return (
                            <div
                                key={ev._id}
                                onClick={() => setSelectedEvent(ev)}
                                className="group bg-[#161822] border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 cursor-pointer p-6 flex flex-col shadow-lg"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition truncate">
                                            {ev.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm font-medium mt-1 truncate">
                                            {ev.organization || "DevLink Community"}
                                        </p>

                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <span>1 - {ev.teamSize || 4} Members</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-gray-500 text-sm">
                                                <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="line-clamp-2 text-gray-400">{ev.location || (ev.mode === "online" ? "Online" : "To be announced")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Logo */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                                        {ev.image ? (
                                            <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-[11px] font-medium border border-gray-700">
                                        {ev.type || "Hackathon"}
                                    </span>
                                    {ev.price && (
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-medium border ${ev.price === "Paid" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`}>
                                            {ev.price}
                                        </span>
                                    )}
                                    {ev.skills && ev.skills.slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-[11px] font-medium border border-gray-700">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs font-medium">
                                        <span className="text-gray-500">Posted {formatDate(ev.createdAt || ev.date)}</span>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{daysLeft(ev.date)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-gray-800 rounded-full transition">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-800 rounded-full transition">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Event Detail View */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        {/* Header Image */}
                        <div className="relative aspect-[21/9] w-full bg-gray-100">
                            {selectedEvent.image ? (
                                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full backdrop-blur-md shadow-lg transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Details */}
                        <div className="p-6 sm:p-10">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="text-xs font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100 px-4 py-1.5 rounded-full">
                                    {selectedEvent.type || "Hackathon"}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest bg-gray-50 text-gray-600 border border-gray-100 px-4 py-1.5 rounded-full">
                                    {selectedEvent.mode}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-1.5 rounded-full ml-auto">
                                    {daysLeft(selectedEvent.date)}
                                </span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">{selectedEvent.title}</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Date</p>
                                    <p className="text-gray-900 font-bold">{formatDate(selectedEvent.date)}</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Pricing</p>
                                    <p className="text-gray-900 font-bold">{selectedEvent.price || "Free"}</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Team Size</p>
                                    <p className="text-gray-900 font-bold">Up to {selectedEvent.teamSize} members</p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Location</p>
                                    <p className="text-gray-900 font-bold truncate">{selectedEvent.location || (selectedEvent.mode === "online" ? "Virtual" : "TBA")}</p>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                    About the Event
                                </h3>
                                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                    {selectedEvent.description}
                                </p>
                            </div>

                            <div className="mt-10 pt-10 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                                {selectedEvent.registrationLink ? (
                                    <a
                                        href={selectedEvent.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition shadow-xl shadow-indigo-200"
                                    >
                                        Register Now
                                    </a>
                                ) : (
                                    <button disabled className="flex-1 py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed">
                                        Registration Closed
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setSelectedEvent(null);
                                        navigate("/discover?lookingFor=hackathon");
                                    }}
                                    className="flex-1 py-4 bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 font-black rounded-2xl transition"
                                >
                                    Find a Team
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
