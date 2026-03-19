import { useEffect, useState } from "react";
import api from "../lib/api.js";
import { useSocket } from "../contexts/SocketContext.jsx";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { notifications, clearNotifications } = useSocket();

  async function load() {
    const { data } = await api.get("/requests/pending");
    setItems(data);
  }
  useEffect(() => {
    load();
    clearNotifications();
  }, []);

  async function accept(id) {
    try {
      if (!id) {
        console.error("No request ID provided");
        return;
      }
      await api.put(`/requests/${id}/accept`);
      load();
    } catch (err) {
      console.error("Accept error:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Failed to accept request");
    }
  }

  async function reject(id) {
    try {
      if (!id) {
        console.error("No request ID provided");
        return;
      }
      await api.put(`/requests/${id}/reject`);
      load();
    } catch (err) {
      console.error("Reject error:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Failed to reject request");
    }
  }

  const getLookingForLabel = (lookingFor) => {
    const labels = {
      hackathon: "🏆 Hackathon Partner",
      startup: "🚀 Startup Co-Founder",
      practice: "💻 Practice Buddy"
    };
    return labels[lookingFor] || lookingFor;
  };

  const getLookingForColor = (lookingFor) => {
    const colors = {
      hackathon: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      startup: "bg-green-500/20 text-green-400 border-green-500/30",
      practice: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    };
    return colors[lookingFor] || "bg-gray-800 text-gray-400";
  };

  const totalPending = items.length + notifications.length;

  return (
    <div className="space-y-6">
      {/* Header with pending count */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Notifications</h2>
          <p className="text-gray-400 text-sm mt-1">
            {totalPending > 0 ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {totalPending} pending request{totalPending !== 1 ? 's' : ''}
              </span>
            ) : (
              "No pending requests"
            )}
          </p>
        </div>
        {totalPending > 0 && (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
            {totalPending} New
          </span>
        )}
      </div>

      {/* Real-time notifications */}
      {notifications.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            New Likes
          </h3>
          <div className="space-y-3">
            {notifications.map((notif, idx) => (
              <div key={idx} className="flex items-center justify-between bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedImage(notif.fromUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.fromUser.name}`)}
                    className="relative group"
                  >
                    <img
                      src={notif.fromUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.fromUser.name}`}
                      alt={notif.fromUser.name}
                      className="w-12 h-12 rounded-full bg-amber-100 object-cover ring-2 ring-indigo-500/50"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </button>
                  <div>
                    <p className="font-medium text-white">{notif.fromUser.name}</p>
                    <p className="text-xs text-gray-400">@{notif.fromUser.username || 'user'}</p>
                  </div>
                </div>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">Just now 🔥</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Requests */}
      <div className="space-y-3">
        {items.length > 0 && (
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            Pending Requests
          </h3>
        )}
        {items.map(r => (
          <div key={r._id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedImage(r.fromUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.fromUser.name}`)}
                className="relative group flex-shrink-0"
              >
                <img
                  src={r.fromUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.fromUser.name}`}
                  alt={r.fromUser.name}
                  className="w-14 h-14 rounded-full bg-amber-100 object-cover ring-2 ring-gray-700 group-hover:ring-indigo-500/50 transition"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </button>
              <div className="min-w-0">
                <p className="font-medium text-white">{r.fromUser.name}</p>
                {r.fromUser.lookingFor && (
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1 ${getLookingForColor(r.fromUser.lookingFor)}`}>
                    {getLookingForLabel(r.fromUser.lookingFor)}
                  </span>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {(r.fromUser.skills || []).slice(0, 3).map(s => (
                    <span key={s} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">{s}</span>
                  ))}
                  {(r.fromUser.skills || []).length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-500">+{(r.fromUser.skills || []).length - 3}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => reject(r._id)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-sm font-medium transition"
              >
                Reject
              </button>
              <button
                onClick={() => accept(r._id)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition"
              >
                Accept
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-400">No pending requests.</p>
            <p className="text-gray-500 text-sm mt-1">When someone likes your profile, you'll see them here.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Profile"
              className="w-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
