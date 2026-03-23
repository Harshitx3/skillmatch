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
            } catch { }
            finally { setLoading(false); }
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

            {/* Search and Filter Button */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search hackathons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-10 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border transition font-medium ${showFilters ? "bg-indigo-600 border-indigo-500 text-white" : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="mb-8 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Event Type</label>
                            <div className="flex flex-wrap gap-2">
                                {types.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFilterType(t)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterType === t ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
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
                                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${filterMode === m ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
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
                                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterPrice === p ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(ev => {
                        return (
                            <div
                                key={ev._id}
                                onClick={() => setSelectedEvent(ev)}
                                className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer flex flex-col"
                            >
                                {/* Banner Image */}
                                <div className="aspect-video w-full bg-gray-800 relative overflow-hidden">
                                    {ev.image ? (
                                        <img 
                                            src={ev.image} 
                                            alt={ev.title} 
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        <span className="text-[10px] uppercase tracking-wider bg-indigo-600/90 text-white px-2 py-0.5 rounded font-bold backdrop-blur-sm">
                                            {ev.type || "Hackathon"}
                                        </span>
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold backdrop-blur-sm ${ev.price === "Paid" ? "bg-amber-500/90 text-white" : "bg-emerald-500/90 text-white"}`}>
                                            {ev.price || "Free"}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 right-3">
                                        <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-md font-bold backdrop-blur-md border ${MODE_COLORS[ev.mode]}`}>
                                            {ev.mode}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-indigo-400 transition">
                                        {ev.title}
                                    </h3>
                                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                        <span>{formatDate(ev.date)}</span>
                                        <span className={new Date(ev.date) < new Date() ? "text-red-400" : "text-green-400"}>
                                            {daysLeft(ev.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Event Detail View */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedEvent(null)}>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        {/* Header Image */}
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
                                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Details */}
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="text-xs font-bold uppercase tracking-widest bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full">
                                    {selectedEvent.type || "Hackathon"}
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${MODE_COLORS[selectedEvent.mode]}`}>
                                    {selectedEvent.mode}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest bg-gray-800 text-gray-400 border border-gray-700 px-3 py-1 rounded-full ml-auto">
                                    {daysLeft(selectedEvent.date)}
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4">{selectedEvent.title}</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Date</p>
                                    <p className="text-gray-200 font-semibold">{formatDate(selectedEvent.date)}</p>
                                </div>
                                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Pricing</p>
                                    <p className="text-gray-200 font-semibold">{selectedEvent.price || "Free"}</p>
                                </div>
                                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Team Size</p>
                                    <p className="text-gray-200 font-semibold">Up to {selectedEvent.teamSize} members</p>
                                </div>
                                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50">
                                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Location</p>
                                    <p className="text-gray-200 font-semibold">{selectedEvent.location || (selectedEvent.mode === "online" ? "Virtual" : "To be announced")}</p>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-xl font-bold text-white mb-3">About the Event</h3>
                                <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">
                                    {selectedEvent.description}
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row gap-4">
                                {selectedEvent.registrationLink ? (
                                    <a
                                        href={selectedEvent.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/20"
                                    >
                                        Register Now
                                    </a>
                                ) : (
                                    <button disabled className="flex-1 py-4 bg-gray-800 text-gray-500 font-bold rounded-xl cursor-not-allowed">
                                        Registration Closed
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setSelectedEvent(null);
                                        navigate("/discover?lookingFor=hackathon");
                                    }}
                                    className="flex-1 py-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 font-bold rounded-xl transition"
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
