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
import api from "./lib/api.js";

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
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Fetch user data for the menu if token exists
  useEffect(() => {
    if (token) {
      api.get("/users/me").then(res => setUserData(res.data)).catch(() => { });
    }
  }, [token]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isLandingPage = location.pathname === "/";

  const navLinks = token ? [
    { to: "/discover", label: "Discover", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
    { to: "/hackathons", label: "Hackathons", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
    { to: "/battle/create", label: "Battle", icon: <span className="text-lg">⚔️</span>, color: "text-orange-400" },
    { to: "/matches", label: "Matches", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
    {
      to: "/notifications",
      label: "Notifications",
      onClick: markAsRead,
      badge: unreadCount,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    },
    { to: "/profile", label: "Profile", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ] : [
    { to: "/about", label: "About Us", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { to: "/contact", label: "Contact Us", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <Link to="/" className="font-bold text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">DevLink</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {token ? (
            <>
              <div className="flex items-center gap-1 mr-4 border-r border-gray-800 pr-4">
                {navLinks.filter(l => l.to !== "/profile").map(link => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={link.onClick}
                      className={`px-3 py-2 rounded-lg transition-all relative flex items-center gap-2 ${isActive ? "bg-indigo-600/10 text-indigo-400" : "text-gray-400 hover:text-white hover:bg-gray-900"} ${link.color || ""}`}
                    >
                      <span className={`${isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"}`}>{link.icon}</span>
                      {link.label}
                      {link.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-gray-950">
                          {link.badge > 9 ? '9+' : link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Profile Section */}
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all ${location.pathname === "/profile" ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400" : "border-gray-800 hover:border-gray-700 bg-gray-900/50"}`}
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-indigo-500/30">
                    <img
                      src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'user'}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="max-w-[100px] truncate">{userData?.name || "Profile"}</span>
                </Link>

                <button
                  onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("isAdmin"); window.location.href = "/"; }}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {isLandingPage && (
                <a
                  href="#features"
                  className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-all font-medium"
                >
                  Features
                </a>
              )}
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-all font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none z-[60]"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5 relative">
            <span className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeMenu}
      />
      <nav
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-gray-900 border-l border-gray-800 z-[56] md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section in Menu */}
          {token && (
            <div className="p-6 border-b border-gray-800 bg-gray-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/50 flex-shrink-0">
                  <img
                    src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'user'}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{userData?.name || "Developer"}</p>
                  <p className="text-xs text-gray-500 truncate">@{userData?.username || "user"}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="flex flex-col space-y-1">
              {token ? (
                <>
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => { link.onClick?.(); closeMenu(); }}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-gray-800 group ${link.color || "text-gray-300"}`}
                    >
                      <span className="text-gray-400 group-hover:text-indigo-400 transition-colors">{link.icon}</span>
                      <span className="font-medium group-hover:text-white transition-colors">{link.label}</span>
                      {link.badge > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {link.badge > 9 ? '9+' : link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <button
                      onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("isAdmin"); window.location.href = "/"; }}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {isLandingPage && (
                    <a href="#features" onClick={closeMenu} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                      Features
                    </a>
                  )}
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium"
                    >
                      <span className="text-gray-400">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

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
