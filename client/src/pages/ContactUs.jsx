import React from 'react';

const ContactCard = ({ title, icon, value, link, color }) => (
    <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`group bg-gray-800/40 border border-gray-700 hover:border-${color}-500/50 p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-${color}-500/10 flex flex-col items-center text-center`}
    >
        <div className={`w-12 h-12 bg-${color}-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-white font-bold tracking-tight">{value}</p>
    </a>
);

export default function ContactUs() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Get in Touch
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Have a question, feedback, or just want to say hi? Reach out to us through any of these platforms. We're always open to connecting with the developer community!
                    </p>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ContactCard 
                        title="Email"
                        value="srivastavaharshit666@gmail.com"
                        link="mailto:srivastavaharshit666@gmail.com"
                        color="indigo"
                        icon={
                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }
                    />
                    <ContactCard 
                        title="GitHub"
                        value="@Harshitx3"
                        link="https://github.com/Harshitx3"
                        color="emerald"
                        icon={
                            <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <ContactCard 
                        title="LinkedIn"
                        value="Harshit Srivastava"
                        link="https://linkedin.com/in/harshit-srivastava-0b1b1b1b1"
                        color="blue"
                        icon={
                            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        }
                    />
                </div>

                {/* Footer Section */}
                <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Want to collaborate?</h2>
                    <p className="text-gray-400 mb-8">
                        We're always looking for talented developers to build amazing things together.
                    </p>
                    <a 
                        href="mailto:srivastavaharshit666@gmail.com"
                        className="inline-flex items-center px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/20"
                    >
                        Drop an Email
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
