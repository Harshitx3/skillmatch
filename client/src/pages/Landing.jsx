import { useState } from "react";
import Modal from "../components/Modal.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

export default function Landing() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const openLogin = () => { setRegisterOpen(false); setLoginOpen(true); };
  const openRegister = () => { setLoginOpen(false); setRegisterOpen(true); };
  const closeModals = () => { setLoginOpen(false); setRegisterOpen(false); };

  return (
    <>
      <div className={`transition-filter duration-300 ${(isLoginOpen || isRegisterOpen) ? 'blur-sm' : ''}`}>
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            Build Your Next Big Thing Together
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
            The developer-first platform to find co-founders, hackathon partners, and open-source collaborators. Swipe, Match, Code.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={openRegister}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/20"
            >
              Get Started Now
            </button>
            <button
              onClick={openLogin}
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-full border border-gray-700 transition duration-300 transform hover:scale-105"
            >
              Login to Account
            </button>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-20 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-indigo-500 transition duration-300">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Smart Matching</h3>
            <p className="text-gray-400">Our swipe system connects you with developers whose skills and goals align with yours perfectly.</p>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition duration-300">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Developer Profiles</h3>
            <p className="text-gray-400">Showcase your GitHub projects, LeetCode stats, and tech stack to stand out from the crowd.</p>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-pink-500 transition duration-300">
            <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Instant Collaboration</h3>
            <p className="text-gray-400">Once you match, get direct access to contact info to jumpstart your next project immediately.</p>
          </div>
        </section>


        {/* Footer */}
        <footer className="py-10 text-center border-t border-gray-800 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} DevLink. Connect. Build. Ship.</p>
        </footer>
      </div>

      <Modal isOpen={isLoginOpen} onClose={closeModals}>
        <Login switchToRegister={openRegister} />
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={closeModals}>
        <Register switchToLogin={openLogin} />
      </Modal>
    </>
  );
}
