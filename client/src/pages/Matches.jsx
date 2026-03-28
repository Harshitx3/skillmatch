import { useEffect, useState } from "react";
import api from "../lib/api.js";

export default function Matches() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  async function load() {
      const { data } = await api.get("/api/matches");
      setItems(data);
    }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = items.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.college?.toLowerCase().includes(term) ||
      u.skills?.some(s => s.toLowerCase().includes(term))
    );
  });

  async function handleRemove(id) {
    if (!window.confirm("Are you sure you want to remove this match?")) return;
    
    setRemovingId(id);
    try {
      await api.delete(`/api/matches/${id}`);
      setItems(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error("Remove match error:", err);
      alert("Failed to remove match");
    } finally {
      setRemovingId(null);
    }
  }

  const getAvatarUrl = (user) => {
    return user?.avatar || user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}&backgroundColor=ffdfbf`;
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const getAvatarColor = (name) => {
    const colors = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Your Matches
        </h2>
        <p className="text-gray-400 mt-2">
          {items.length > 0
            ? `You've matched with ${items.length} developer${items.length !== 1 ? 's' : ''}!`
            : 'Start swiping to find your perfect coding partner'}
        </p>
      </div>

      {/* Search Bar */}
      {items.length > 0 && (
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, skills, or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-full px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-lg shadow-black/20"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-center text-xs text-gray-500 mt-2">
              Found {filteredItems.length} match{filteredItems.length !== 1 ? 'es' : ''} for "{searchTerm}"
            </p>
          )}
        </div>
      )}

      {/* Matches Grid */}
      {items.length > 0 ? (
        filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map(u => (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className="group bg-[#161822] border border-gray-800 rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer hover:border-violet-500/50 hover:bg-[#1f2233] transition-all duration-300 shadow-xl shadow-black/20"
              >
                <div className="relative mb-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-violet-500 transition-colors shadow-lg">
                    <img
                      src={getAvatarUrl(u)}
                      alt={u.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-[#161822] rounded-full"></div>
                </div>
                
                <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-violet-400 transition-colors line-clamp-1">
                  {u.name}
                </h3>
                <p className="text-gray-500 text-[10px] sm:text-xs truncate w-full">
                  @{u.username}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(u._id);
                  }}
                  className="mt-3 p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                  title="Remove match"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
      ) : (
        /* No Search Results */
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-400">No matches found for "{searchTerm}"</h3>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            Clear search
          </button>
        </div>
      )) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No matches yet</h3>
          <p className="text-gray-500 mb-6">Start swiping to connect with other developers</p>
          <a
            href="/discover"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Discovering
          </a>
        </div>
      )}

      {/* Profile Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="bg-[#161822] border border-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-32 bg-gradient-to-r from-violet-600 to-purple-600">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 pb-8">
              <div className="relative -mt-16 mb-4 flex justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-[#161822] overflow-hidden shadow-2xl">
                  <img
                    src={getAvatarUrl(selectedUser)}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">{selectedUser.name}</h2>
                <p className="text-violet-400 font-medium text-sm mb-2">@{selectedUser.username}</p>
                {selectedUser.college && (
                  <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {selectedUser.college}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                {selectedUser.bio && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">About</h3>
                    <p className="text-gray-300 text-sm leading-relaxed bg-gray-800/30 p-4 rounded-xl border border-gray-800/50">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}

                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Connect</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-800 rounded-xl text-sm text-gray-300 hover:border-violet-500/50 hover:bg-gray-800/50 transition-all group"
                    >
                      <div className="p-2 bg-gray-900 rounded-lg group-hover:text-violet-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      Email
                    </a>
                    
                    {selectedUser.githubUsername && (
                      <a
                        href={`https://github.com/${selectedUser.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-800 rounded-xl text-sm text-gray-300 hover:border-violet-500/50 hover:bg-gray-800/50 transition-all group"
                      >
                        <div className="p-2 bg-gray-900 rounded-lg group-hover:text-violet-400 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </div>
                        GitHub
                      </a>
                    )}

                    {selectedUser.leetcodeUsername && (
                      <a
                        href={`https://leetcode.com/${selectedUser.leetcodeUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-800 rounded-xl text-sm text-gray-300 hover:border-violet-500/50 hover:bg-gray-800/50 transition-all group"
                      >
                        <div className="p-2 bg-gray-900 rounded-lg group-hover:text-violet-400 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-4.32 4.244a1.09 1.09 0 0 0 0 1.556 1.111 1.111 0 0 0 1.572 0l3.44-3.392s.51-.511.51-.511a.41.41 0 0 1 .587 0 .42.42 0 0 1 0 .589l-5.69 5.588a1.361 1.361 0 0 0 0 1.933 1.397 1.397 0 0 0 1.957 0l5.69-5.588a1.382 1.382 0 0 0 0-1.933L14.444.414A1.369 1.369 0 0 0 13.483 0zm-3.746 9.958a1.37 1.37 0 0 0-1.957 0 1.361 1.361 0 0 0 0 1.933l4.693 4.617a1.382 1.382 0 0 0 1.932 0 1.396 1.396 0 0 0 0-1.933l-4.668-4.617z"/><path d="M20.908 11.14l-1.824-1.791a1.602 1.602 0 0 0-2.244 0 1.574 1.574 0 0 0-.012 2.22l1.823 1.791a1.602 1.602 0 0 0 2.243 0 1.574 1.574 0 0 0 .014-2.22zM2.87 11.14l1.824-1.791a1.602 1.602 0 0 1 2.244 0 1.574 1.574 0 0 1 .012 2.22L5.127 13.36a1.602 1.602 0 0 1-2.243 0 1.574 1.574 0 0 1-.014-2.22z"/></svg>
                        </div>
                        LeetCode
                      </a>
                    )}

                    {selectedUser.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${selectedUser.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-800 rounded-xl text-sm text-gray-300 hover:border-violet-500/50 hover:bg-gray-800/50 transition-all group"
                      >
                        <div className="p-2 bg-gray-900 rounded-lg group-hover:text-violet-400 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </div>
                        LinkedIn
                      </a>
                    )}

                    {selectedUser.instagram && (
                      <a
                        href={`https://instagram.com/${selectedUser.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-800 rounded-xl text-sm text-gray-300 hover:border-violet-500/50 hover:bg-gray-800/50 transition-all group"
                      >
                        <div className="p-2 bg-gray-900 rounded-lg group-hover:text-violet-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
