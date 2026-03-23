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
      coding: "💻 Coding Buddy"
    };
    return labels[lookingFor] || lookingFor;
  };

  const getLookingForColor = (lookingFor) => {
    const colors = {
      hackathon: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      startup: "bg-green-500/20 text-green-400 border-green-500/30",
      coding: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    };
    return colors[lookingFor] || "bg-gray-800 text-gray-400";
  };
  
  const totalPending = items.length;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header with pending count */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            {totalPending > 0 ? (
              <>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                {totalPending} pending request{totalPending !== 1 ? 's' : ''}
              </>
            ) : (
              "No pending requests"
            )}
          </p>
        </div>
      </div>

      {/* Real-time Toast/Banner for new notifications */}
      {notifications.length > 0 && (
        <div className="mb-8 animate-fade-in">
          <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">New Activity!</p>
                <p className="text-xs text-indigo-300">You have {notifications.length} new notification{notifications.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                clearNotifications();
                load();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition"
            >
              Refresh List
            </button>
          </div>
        </div>
      )}

      {/* Pending Requests List */}
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map(r => (
            <div key={r._id} className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-indigo-500/50 transition-colors">
                    <img
                      src={r.fromUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.fromUser.name}`}
                      alt={r.fromUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-gray-900">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">{r.fromUser.name}</h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                    {r.fromUser.lookingFor && (
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-bold border ${getLookingForColor(r.fromUser.lookingFor)}`}>
                        {getLookingForLabel(r.fromUser.lookingFor)}
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-bold border border-gray-700 text-gray-400 bg-gray-800/50">
                      {r.fromUser.experienceLevel || "Developer"}
                    </span>
                  </div>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                    {(r.fromUser.skills || []).slice(0, 4).map(s => (
                      <span key={s} className="text-xs px-2 py-1 bg-gray-800/80 text-gray-300 rounded-md border border-gray-700/50">
                        {s}
                      </span>
                    ))}
                    {(r.fromUser.skills || []).length > 4 && (
                      <span className="text-xs px-2 py-1 text-gray-500">
                        +{(r.fromUser.skills || []).length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => accept(r._id)}
                    className="flex-1 sm:w-32 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-indigo-600/20"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => reject(r._id)}
                    className="flex-1 sm:w-32 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-bold rounded-xl border border-gray-700 transition"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-900/30 border border-gray-800 border-dashed rounded-3xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">Inbox is empty</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              When other developers like your profile or want to collaborate, their requests will appear here.
            </p>
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
