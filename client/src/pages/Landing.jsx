import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

export default function Landing() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const openLogin = () => { setRegisterOpen(false); setLoginOpen(true); };
  const openRegister = () => { setLoginOpen(false); setRegisterOpen(true); };
  const closeModals = () => { setLoginOpen(false); setRegisterOpen(false); };
  const goToDiscover = () => { navigate("/discover"); };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                DevLink
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={openLogin}
                    className="px-4 py-2 text-gray-300 hover:text-white transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openRegister}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <button
                  onClick={goToDiscover}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Go to App
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-white transition py-2">Features</a>
              <a href="#about" className="block text-gray-300 hover:text-white transition py-2">About</a>
              <a href="#contact" className="block text-gray-300 hover:text-white transition py-2">Contact</a>
              <div className="pt-3 border-t border-gray-800">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => { setMobileMenuOpen(false); openLogin(); }}
                      className="block w-full text-left text-gray-300 hover:text-white transition py-2"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); openRegister(); }}
                      className="block w-full text-left text-indigo-400 hover:text-indigo-300 transition py-2"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); goToDiscover(); }}
                    className="block w-full text-left text-indigo-400 hover:text-indigo-300 transition py-2"
                  >
                    Go to App
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className={`transition-filter duration-300 ${(isLoginOpen || isRegisterOpen) ? 'blur-sm' : ''}`}>
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            Build Your Next Big Thing Together
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
            The developer-first platform to find co-founders, hackathon partners, and open-source collaborators. Swipe, Match, Code.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {!isLoggedIn ? (
              <>
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
                  Go In
                </button>
              </>
            ) : (
              <button
                onClick={goToDiscover}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/20"
              >
                Start Discovering
              </button>
            )}
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="py-20 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
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
