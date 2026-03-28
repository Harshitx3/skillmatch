import React from 'react';
import { useNavigate } from 'react-router-dom';
import devCollaborationImg from '../assets/dev-collaboration.png';

const SparkleIcon = () => (
    <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const UserIcon = () => (
    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ChatIcon = () => (
    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

const SkillIcon = () => (
    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
);

const GithubIcon = () => (
    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
);

const LeetCodeIcon = () => (
    <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.513-.514.498-1.366-.037-1.901-.536-.535-1.388-.52-1.902.038l-10.1 10.101c-.981.982-1.594 2.311-1.594 3.76s.613 2.778 1.594 3.76l10.1 10.1c.514.515 1.366.499 1.902-.036.535-.536.55-1.387.037-1.902l-2.467-2.503a5.055 5.055 0 0 0 2.445-1.336l2.609-2.636c.514-.514.496-1.365-.039-1.901-.535-.535-1.386-.552-1.9-.038z" />
    </svg>
);

const TerminalIcon = () => (
    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export default function AboutUs() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0f111a] text-gray-100 font-sans selection:bg-violet-500/30">
            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 md:pb-20 text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-violet-600/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
                
                <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight">
                    Where Developers Meet Their<br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500 block sm:inline mt-2 sm:mt-0">
                        Next Great Collaboration
                    </span>
                </h1>
                
                <p className="relative max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-400 mb-8 md:mb-10 leading-relaxed px-2">
                    We bridge the gap between brilliant minds and ambitious ideas. 
                    Whether it's a weekend hackathon or the next unicorn startup, 
                    find your perfect coding partner on NodeMatch.
                </p>
                

            </section>

            {/* Mission Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
                    <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Removing Friction from Innovation</h2>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                            Our mission is simple: to ensure no great project dies because of a lack of talent. 
                            We believe that the best software is built by diverse, passionate teams who share 
                            a common vision. We've built the infrastructure to help you find them instantly.
                        </p>
                    </div>
                    <div className="flex-1 w-full max-w-2xl mx-auto">
                        <div className="bg-[#161822] border border-gray-800 rounded-2xl aspect-[4/3] flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.15)] group">
                            <img 
                                src={devCollaborationImg} 
                                alt="Developers collaborating" 
                                className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-gray-800/50">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">How It Works</h2>
                    <p className="text-gray-400 text-base md:text-lg">A simple process to connect with your future partner.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mb-4 border border-violet-500/20">
                            <span className="text-2xl font-bold text-violet-400">1</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Create Your Profile</h3>
                        <p className="text-gray-400 text-sm">Sign up and build a profile that showcases your skills, projects, and what you're looking for in a collaborator.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mb-4 border border-violet-500/20">
                            <span className="text-2xl font-bold text-violet-400">2</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Discover & Match</h3>
                        <p className="text-gray-400 text-sm">Explore profiles of other developers. Our smart matching algorithm helps you find the right fit based on your interests and needs.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mb-4 border border-violet-500/20">
                            <span className="text-2xl font-bold text-violet-400">3</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Start Collaborating</h3>
                        <p className="text-gray-400 text-sm">Connect with your match, discuss ideas, and start building something amazing together using our integrated tools.</p>
                    </div>
                </div>
            </section>

            {/* Core Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-gray-800/50">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">Core Features</h2>
                    <p className="text-gray-400 text-base md:text-lg">Everything you need to find a partner and build your next project.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-3">Hackathons</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">Participate in hackathons to challenge yourself, learn new skills, and meet potential collaborators in a competitive and fun environment.</p>
                    </div>
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-3">Battles</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">Engage in one-on-one coding battles to sharpen your problem-solving skills and see how you stack up against other developers.</p>
                    </div>
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-3">Smart Matching</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">Our AI-driven engine pairs you with developers whose stack and interests align perfectly with your project needs.</p>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-gray-800/50">
                <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
                    <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Our Story</h2>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                            NodeMatch was born from a simple observation: brilliant developers with great ideas often struggle to find the right people to turn those ideas into reality. We experienced this firsthand, and we knew there had to be a better way. Our goal is to create a platform that not only connects developers but also empowers them to build the future of technology, together.
                        </p>
                    </div>
                    <div className="flex-1 w-full max-w-2xl mx-auto">
                        <div className="bg-[#161822] border border-gray-800 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                           <p className="text-gray-400">The NodeMatch Team</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Cards Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-y border-gray-800/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Card 1 */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8 hover:border-violet-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-6 border border-violet-500/20 group-hover:scale-110 transition-transform">
                            <SparkleIcon />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Smart Matching</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Our AI-driven engine pairs you with developers whose stack and interests align perfectly with your project needs.
                        </p>
                    </div>
                    
                    {/* Card 2 */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8 hover:border-violet-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <UserIcon />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Developer Profiles</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Beyond a resume—showcase your actual work, GitHub contributions, and technical interests in one beautiful page.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8 hover:border-violet-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <ChatIcon />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Instant Collaboration</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Built-in tools for communication and project management to get your collaboration off the ground in minutes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Developer Ecosystem Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">The Developer Ecosystem</h2>
                    <p className="text-gray-400 text-base md:text-lg">Tools designed for the modern engineer's workflow.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills Card */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8 flex flex-col hover:border-violet-500/20 transition-colors">
                        <div className="w-10 h-10 bg-[#0f111a] rounded-lg flex items-center justify-center mb-6 border border-gray-800">
                            <SkillIcon />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Skill-Based Matching</h3>
                        <p className="text-gray-400 text-sm mb-6 flex-grow">
                            We analyze your project requirements and your coding history to find the precise skill set required for success.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {['Rust', 'Go', 'TypeScript', 'PostgreSQL'].map(skill => (
                                <span key={skill} className="px-3 py-1 text-xs font-medium bg-[#0f111a] text-gray-300 border border-gray-800 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* GitHub Sync Card */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8 flex flex-col hover:border-violet-500/20 transition-colors">
                        <div className="w-10 h-10 bg-[#0f111a] rounded-lg flex items-center justify-center mb-6 border border-gray-800">
                            <GithubIcon />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">GitHub Sync</h3>
                        <p className="text-gray-400 text-sm mb-6 flex-grow">
                            One-click integration to pull your repos and contributions directly into your profile.
                        </p>
                    </div>

                    {/* LeetCode Link Card */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8 flex flex-col hover:border-violet-500/20 transition-colors">
                        <div className="w-10 h-10 bg-[#0f111a] rounded-lg flex items-center justify-center mb-6 border border-gray-800">
                            <LeetCodeIcon />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">LeetCode Link</h3>
                        <p className="text-gray-400 text-sm mb-6 flex-grow">
                            Verify your problem-solving skills with verified algorithmic performance metrics.
                        </p>
                    </div>

                    {/* Project Collaboration Card */}
                    <div className="bg-[#161822] border border-gray-800/80 rounded-2xl p-8 flex flex-col md:flex-row gap-8 hover:border-violet-500/20 transition-colors md:col-span-2 lg:col-span-1">
                        <div className="flex-1 flex flex-col">
                            <div className="w-10 h-10 bg-[#0f111a] rounded-lg flex items-center justify-center mb-6 border border-gray-800">
                                <TerminalIcon />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Project Collaboration</h3>
                            <p className="text-gray-400 text-sm">
                                Native support for shared boards, document editing, and repository management within the NodeMatch platform.
                            </p>
                        </div>
                        <div className="flex-1 bg-[#0a0a0f] border border-gray-800 rounded-xl p-4 font-mono text-xs text-green-400 flex flex-col justify-center shadow-inner pt-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-5 bg-[#161822] border-b border-gray-800 flex items-center px-2 gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                            </div>
                            <p>$ git remote add nodematch ...</p>
                            <p className="text-gray-400">Connecting to collab server...</p>
                            <p className="text-violet-400">Success: workspace linked!</p>
                            <p className="animate-pulse">_</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 mb-8 md:mb-12">
                <div className="bg-gradient-to-b from-[#161822] to-[#0f111a] border border-gray-800/80 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
                        Find Your Next<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">
                            Coding Partner
                        </span>
                    </h2>
                    
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 md:mb-10 max-w-xl mx-auto px-2">
                        Join a community of builders. Start your next project with a team that compliments your skills.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate('/profile')}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                        >
                            Create Your Profile
                        </button>
                        <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1a1c29] hover:bg-[#222536] border border-gray-700 text-gray-300 font-medium transition-all">
                            Start Matching
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
