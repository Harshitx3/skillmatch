import { useState } from "react";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Contact Us
            </h1>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
                        <p className="leading-relaxed">
                            Have questions, suggestions, or just want to say hello? We'd love to hear from you.
                            Fill out the form and we'll get back to you as soon as possible.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-3">Contact Information</h3>
                        <div className="space-y-2">
                            <p>Email: support@devlink.com</p>
                            <p>Location: San Francisco, CA</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-3">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition">Twitter</a>
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition">GitHub</a>
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition">LinkedIn</a>
                        </div>
                    </section>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="text-green-400 text-xl mb-2">Message Sent!</div>
                            <p className="text-gray-400">Thank you for reaching out. We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white resize-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
