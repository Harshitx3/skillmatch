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
        type: "Hackathon",
        price: "Free",
        customType: "",
        image: "",
    });
    const [isOtherType, setIsOtherType] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const PREDEFINED_TYPES = [
        "Hackathon",
        "AI",
        "Web Development",
        "App Development",
        "Blockchain",
        "Cybersecurity",
        "Open for All",
        "Coding Contest",
        "Workshop",
        "Seminar",
    ];

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "type") {
            if (value === "Other") {
                setIsOtherType(true);
                setForm(prev => ({ ...prev, type: "Other", customType: "" }));
            } else {
                setIsOtherType(false);
                setForm(prev => ({ ...prev, type: value, customType: "" }));
            }
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/api/upload/event-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.url) {
                setForm(prev => ({ ...prev, image: response.data.url }));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const finalType = isOtherType ? form.customType : form.type;
            if (!finalType || (isOtherType && !form.customType)) {
                setError("Please specify an event type");
                setLoading(false);
                return;
            }

            await api.post("/api/events/create", {
                ...form,
                type: finalType,
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

                {/* Banner Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Hackathon Banner Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-indigo-500 transition-colors bg-gray-900/50 relative overflow-hidden group">
                        {form.image ? (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                <img src={form.image} alt="Banner Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition text-sm font-medium">
                                        Change Image
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-400">
                                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none transition">
                                        <span>{uploading ? "Uploading..." : "Upload a file"}</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Type & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Type *</label>
                        <select
                            name="type"
                            value={isOtherType ? "Other" : form.type}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                        >
                            {PREDEFINED_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                            <option value="Other">Other (Custom)</option>
                        </select>
                        {isOtherType && (
                            <input
                                name="customType"
                                value={form.customType}
                                onChange={handleChange}
                                placeholder="Enter custom type..."
                                className="mt-2 w-full bg-gray-900 border border-indigo-500/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition text-sm"
                                autoFocus
                            />
                        )}
                    </div>
                    <div className="sm:col-span-2">
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

                {/* Date, Mode & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Pricing *</label>
                        <select
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                        >
                            <option value="Free">Free</option>
                            <option value="Paid">Paid</option>
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
