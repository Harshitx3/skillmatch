import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Profile from "./pages/Profile.jsx";
import Swipe from "./pages/Swipe.jsx";
import Notifications from "./pages/Notifications.jsx";
import Matches from "./pages/Matches.jsx";

function Layout({ children }) {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <Link to="/" className="font-bold text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">DevLink</Link>
        <nav className="space-x-6 text-sm font-medium">
          {token ? (
            <>
              <Link to="/swipe" className="hover:text-indigo-400 transition">Swipe</Link>
              <Link to="/matches" className="hover:text-indigo-400 transition">Matches</Link>
              <Link to="/notifications" className="hover:text-indigo-400 transition">Notifications</Link>
              <Link to="/profile" className="hover:text-indigo-400 transition">Profile</Link>
              <button 
                onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}
                className="text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">Login</Link>
          )}
        </nav>
      </header>
      <main className={token ? "p-4 max-w-5xl mx-auto" : ""}>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/swipe" element={<ProtectedRoute><Layout><Swipe /></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><Layout><Matches /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
