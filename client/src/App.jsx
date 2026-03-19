import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Profile from "./pages/Profile.jsx";
import Swipe from "./pages/Swipe.jsx";
import Notifications from "./pages/Notifications.jsx";
import Matches from "./pages/Matches.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Hackathons from "./pages/Hackathons.jsx";
import HostHackathon from "./pages/HostHackathon.jsx";
import MyHackathons from "./pages/MyHackathons.jsx";
import AdminEvents from "./pages/AdminEvents.jsx";
import CreateBattle from "./pages/CreateBattle.jsx";
import BattleRoom from "./pages/BattleRoom.jsx";
import { useSocket } from "./contexts/SocketContext.jsx";

// Simple admin layout with just logout
function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <Link to="/admin/events" className="font-bold text-2xl bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          👑 Admin
        </Link>
        <button
          onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("isAdmin"); window.location.href = "/"; }}
          className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </header>
      <main className="p-4 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}

function Layout({ children }) {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const { unreadCount, markAsRead } = useSocket();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <Link to="/" className="font-bold text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">DevLink</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {token ? (
            <>
              <Link to="/discover" className="hover:text-indigo-400 transition">Discover</Link>
              <Link to="/hackathons" className="hover:text-indigo-400 transition">Hackathons</Link>
              <Link to="/battle/create" className="hover:text-orange-400 transition">⚔️ Battle</Link>
              <Link to="/matches" className="hover:text-indigo-400 transition">Matches</Link>
              <Link
                to="/notifications"
                className="hover:text-indigo-400 transition relative"
                onClick={markAsRead}
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="hover:text-indigo-400 transition">Profile</Link>
              <button
                onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("isAdmin"); window.location.href = "/"; }}
                className="text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/hackathons" className="hover:text-indigo-400 transition">Hackathons</Link>
              <Link to="/about" className="hover:text-indigo-400 transition">About Us</Link>
              <Link to="/contact" className="hover:text-indigo-400 transition">Contact Us</Link>
              <Link to="/profile" className="hover:text-indigo-400 transition">Profile</Link>
              <Link to="/" className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">Login</Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav ref={menuRef} className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-4 absolute top-16 left-0 right-0 z-50 shadow-lg">
          <div className="flex flex-col space-y-4 text-sm font-medium">
            {token ? (
              <>
                <Link to="/discover" onClick={closeMenu} className="hover:text-indigo-400 transition py-2">Discover</Link>
                <Link to="/hackathons" onClick={closeMenu} className="hover:text-indigo-400 transition py-2">🏆 Hackathons</Link>
                <Link to="/battle/create" onClick={closeMenu} className="hover:text-orange-400 transition py-2">⚔️ Battle</Link>
                <Link to="/matches" onClick={closeMenu} className="hover:text-indigo-400 transition py-2">Matches</Link>
                <Link
                  to="/notifications"
                  onClick={() => { markAsRead(); closeMenu(); }}
                  className="hover:text-indigo-400 transition py-2 relative inline-block"
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" onClick={closeMenu} className="hover:text-indigo-400 transition py-2">Profile</Link>
                <button
                  onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("isAdmin"); window.location.href = "/"; }}
                  className="text-left text-gray-400 hover:text-white transition py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/hackathons" onClick={closeMenu} className="hover:text-indigo-400 transition py-2">🏆 Hackathons</Link>
                <Link to="/about" onClick={closeMenu} className="hover:text-indigo-400 transition py-2">About Us</Link>
                <Link to="/contact" onClick={closeMenu} className="hover:text-indigo-400 transition py-2">Contact Us</Link>
                <Link to="/profile" onClick={closeMenu} className="hover:text-indigo-400 transition py-2">Profile</Link>
                <Link to="/" onClick={closeMenu} className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition text-center">Login</Link>
              </>
            )}
          </div>
        </nav>
      )}

      <main className={token ? "p-4 max-w-5xl mx-auto" : ""}>{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/about" element={<Layout><AboutUs /></Layout>} />
      <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
      <Route path="/hackathons" element={<Layout><Hackathons /></Layout>} />
      <Route path="/discover" element={<ProtectedRoute><Layout><Swipe /></Layout></ProtectedRoute>} />
      <Route path="/swipe" element={<ProtectedRoute><Layout><Swipe /></Layout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><Layout><Matches /></Layout></ProtectedRoute>} />
      <Route path="/host-hackathon" element={<ProtectedRoute><Layout><HostHackathon /></Layout></ProtectedRoute>} />
      <Route path="/my-hackathons" element={<ProtectedRoute><Layout><MyHackathons /></Layout></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute><AdminLayout><AdminEvents /></AdminLayout></ProtectedRoute>} />
      <Route path="/battle/create" element={<ProtectedRoute><Layout><CreateBattle /></Layout></ProtectedRoute>} />
      <Route path="/battle/:code" element={<ProtectedRoute><Layout><BattleRoom /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
