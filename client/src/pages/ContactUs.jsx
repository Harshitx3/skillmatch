import React, { useState, useEffect } from "react";
import api from "../lib/api.js";
import contactImage from "../assets/ContactUs.png";

const SendIcon = () => (
    <svg className="w-8 h-8 opacity-20 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

const GithubIcon = () => (
    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
);

const TwitterIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
    </svg>
);

const LinkedinIcon = () => (
    <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const DiscordIcon = () => (
    <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
);


export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/api/contact', formData);
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [submitted]);

    return (
        <div className="min-h-screen bg-[#0f111a] text-gray-100 font-sans selection:bg-violet-500/30 pb-20">
            
            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                
                <span className="inline-block py-1 pr-3 pl-2 mb-6 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs font-semibold tracking-widest text-gray-400 uppercase shadow-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
                    Contact DevLink
                </span>

                <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-6">
                    We'd Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 italic font-serif opacity-90">Hear</span> From You
                </h1>
                
                <p className="relative max-w-2xl mx-auto text-base md:text-lg text-gray-400 leading-relaxed px-4">
                    Whether you're building the next big thing or just want to say hi, our team of architects is ready to connect with you.
                </p>
            </section>

            {/* Contact Form Card */}
            <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-6 md:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.4)]">
                    
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Send a Message</h2>
                            <p className="text-sm text-gray-400">Fill out the form below and we'll get back to you within 24 hours.</p>
                        </div>
                        <SendIcon />
                    </div>

                    {submitted ? (
                        <div className="text-center py-16 bg-[#0B0F19] rounded-xl border border-gray-800/50">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-green-400 text-xl font-medium mb-2">Message Sent Successfully!</div>
                            <p className="text-gray-400 text-sm">Thank you for reaching out. We'll be in touch shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-800 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm text-white transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-800 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm text-white transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2">Subject</label>
                                <div className="relative">
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-800 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm text-white appearance-none transition-colors"
                                        required
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Support">Technical Support</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Feedback">Feedback</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2">Message</label>
                                <textarea
                                    placeholder="Tell us how we can help..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-800 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm text-white resize-none transition-colors"
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={sending}
                                className={`w-full py-3.5 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 rounded-lg font-medium text-white transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {sending ? (
                                    <>
                                        Sending... <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    </>
                                ) : (
                                    <>
                                        Send Message <span className="font-serif italic font-bold text-lg leading-none">›</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* Social Links Section */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-800/30">
                <div className="text-center mb-8">
                    <h2 className="text-lg font-bold text-white mb-2">Join the DevLink Ecosystem</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {/* GitHub */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(52,211,153,0.05)] transition-all cursor-pointer group">
                        <div className="w-10 h-10 bg-[#0B0F19] rounded-lg flex items-center justify-center border border-gray-800 group-hover:border-emerald-500/20 transition-colors">
                            <GithubIcon />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-300">GitHub</span>
                    </div>
                    {/* Twitter */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-gray-400/30 hover:shadow-[0_0_30px_rgba(156,163,175,0.05)] transition-all cursor-pointer group">
                        <div className="w-10 h-10 bg-[#0B0F19] rounded-lg flex items-center justify-center border border-gray-800 group-hover:border-gray-500/50 transition-colors">
                            <TwitterIcon />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-300">Twitter</span>
                    </div>
                    {/* LinkedIn */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-gray-200/30 hover:shadow-[0_0_30px_rgba(229,231,235,0.05)] transition-all cursor-pointer group">
                        <div className="w-10 h-10 bg-[#0B0F19] rounded-lg flex items-center justify-center border border-gray-800 group-hover:border-gray-500/50 transition-colors">
                            <LinkedinIcon />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-300">LinkedIn</span>
                    </div>
                    {/* Discord */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-teal-500/30 hover:shadow-[0_0_30px_rgba(45,212,191,0.05)] transition-all cursor-pointer group">
                        <div className="w-10 h-10 bg-[#0B0F19] rounded-lg flex items-center justify-center border border-gray-800 group-hover:border-teal-500/20 transition-colors">
                            <DiscordIcon />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-300">Discord</span>
                    </div>
                </div>
            </section>

            {/* What Happens After Contact Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-[#1a1c29] border border-gray-800/60 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 shadow-xl relative overflow-hidden">
                    {/* Left Column */}
                    <div className="flex-1 space-y-10 relative z-10 w-full">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Happens After You Contact Us?</h2>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                Our process is built for efficiency and engineering precision. We don't believe in long wait times.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Step 1 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-sm">
                                    1
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Receipt Confirmation</h4>
                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                                        You'll get an automated confirmation that your request is safely in our queue.
                                    </p>
                                </div>
                            </div>
                            {/* Step 2 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-sm">
                                    2
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Triage & Assignment</h4>
                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                                        Our system routes your message to the specific expert best suited to help.
                                    </p>
                                </div>
                            </div>
                            {/* Step 3 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-sm">
                                    3
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Expert Response</h4>
                                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                                        A human architect will reach out with a detailed response or next steps within 24 hours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Image) */}
                    <div className="flex-1 w-full relative z-10">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#0f111a] ring-1 ring-white/10 group aspect-square lg:aspect-auto lg:h-[450px]">
                            <img 
                                src={contactImage} 
                                alt="Working engineers" 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                            />
                            {/* Overlay gradient to match dark theme */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent opacity-60"></div>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
    );
}
