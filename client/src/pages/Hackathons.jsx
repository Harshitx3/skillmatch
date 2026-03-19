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
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get("/events");
                setEvents(data);
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
                    {events.map(ev => {
                        const ended = new Date(ev.date) < new Date();
                        return (
                            <div
                                key={ev._id}
                                className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col"
                            >
                                {/* Top badges */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${MODE_COLORS[ev.mode]}`}>
                                        {ev.mode === "online" ? "🌐 Online" : "📍 Offline"}
                                    </span>
                                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ml-auto ${ended ? "bg-gray-700/30 text-gray-500 border-gray-700" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"}`}>
                                        {daysLeft(ev.date)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition">
                                    {ev.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                                    {ev.description}
                                </p>

                                {/* Meta info */}
                                <div className="space-y-1.5 mb-5 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{formatDate(ev.date)}</span>
                                    </div>
                                    {ev.location && (
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span>{ev.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Team of {ev.teamSize}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {ev.registrationLink ? (
                                        <a
                                            href={ev.registrationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
                                        >
                                            Register
                                        </a>
                                    ) : (
                                        <span className="flex-1 text-center py-2 bg-gray-800 text-gray-500 text-sm rounded-lg cursor-not-allowed">
                                            No Link
                                        </span>
                                    )}
                                    <button
                                        onClick={() => navigate("/discover?lookingFor=hackathon")}
                                        className="flex-1 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border border-purple-500/30 text-sm font-semibold rounded-lg transition"
                                    >
                                        Find Team
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
