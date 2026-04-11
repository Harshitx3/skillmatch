import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";

export default function Swipe() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({ username: "", skills: "", experienceLevel: "", lookingFor: "" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [matches, setMatches] = useState(new Set());
  const cardRef = useRef(null);
  const startXRef = useRef(0);

  async function load() {
    const params = {};
    if (filters.username) params.username = filters.username;
    if (filters.skills) params.skills = filters.skills;
    if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
    if (filters.lookingFor) params.lookingFor = filters.lookingFor;
    const { data } = await api.get("/api/users", { params });

    // Refresh current matches and sent requests to filter properly
    const matchesData = await loadMatches();
    const sentData = await loadSentRequests();
    
    // Filter out already sent/matched users to avoid duplicates in swiping
    const availableUsers = data.filter(u => !sentData.has(u._id) && !matchesData.has(u._id));
    
    setUsers(availableUsers);
    setCurrentIndex(0);
  }

  async function loadCurrentUser() {
    try {
      const { data } = await api.get("/api/users/me");
      setCurrentUser(data);
    } catch { }
  }

  async function loadSentRequests() {
    try {
      // Get all requests sent by current user (including rejected)
      const { data } = await api.get("/api/requests/sent");
      // Only track pending requests as "sent" - rejected ones can be resent
      const pendingIds = new Set(
        data.filter(r => r.status === "pending").map(r => r.toUser.toString())
      );
      setSentRequests(pendingIds);
      return pendingIds;
    } catch { return new Set(); }
  }

  async function loadMatches() {
    try {
      const { data } = await api.get("/api/matches");
      const matchIds = new Set(data.map(m => m._id.toString()));
      setMatches(matchIds);
      return matchIds;
    } catch { return new Set(); }
  }

  useEffect(() => {
    load();
    loadCurrentUser();
    loadSentRequests();
    loadMatches();
  }, []);

  async function like() {
    if (currentIndex >= users.length) return;
    const user = users[currentIndex];
    if (!user || !user._id) {
      nextCard();
      return;
    }

    // Check if already matched
    if (matches.has(user._id)) {
      alert("Already connected! Check your matches.");
      nextCard();
      return;
    }

    // Check if request is already pending
    if (sentRequests.has(user._id)) {
      alert("Request already sent! Waiting for response.");
      nextCard();
      return;
    }

    try {
      await api.post("/api/requests", { toUser: user._id });
      setSentRequests(prev => new Set([...prev, user._id]));
    } catch (err) {
      console.error("Like error:", err.response?.data?.error || err.message);
      const errorMsg = err.response?.data?.error || "";
      if (errorMsg.includes("pending")) {
        setSentRequests(prev => new Set([...prev, user._id]));
      }
    }
    nextCard();
  }

  function skip() {
    nextCard();
  }

  function nextCard() {
    setDragOffset(0);
    setCurrentIndex(prev => prev + 1);
  }

  // Touch/Mouse handlers for swipe
  function handleStart(clientX) {
    setIsDragging(true);
    startXRef.current = clientX;
  }

  function handleMove(clientX) {
    if (!isDragging) return;
    const offset = clientX - startXRef.current;
    setDragOffset(offset);
  }

  function handleEnd() {
    if (!isDragging) return;
    setIsDragging(false);

    // Swipe threshold
    if (dragOffset > 100) {
      like();
    } else if (dragOffset < -100) {
      skip();
    } else {
      setDragOffset(0);
    }
  }

  const currentCard = users[currentIndex];
  const myAvatarSrc = currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || "User"}&backgroundColor=ffdfbf`;

  // Calculate rotation and opacity based on drag
  const rotation = dragOffset * 0.05;
  const opacity = Math.min(Math.abs(dragOffset) / 100, 1);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between mb-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        <span className="text-sm text-gray-400">
          {currentIndex < users.length ? `${currentIndex + 1} / ${users.length}` : "Done"}
        </span>
      </div>

      {/* Left Sidebar - Filters */}
      <div className={`lg:w-80 flex-shrink-0 space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        {/* Your Profile Card */}
        {currentUser && (
          <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/profile" className="relative group">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/50 ring-2 ring-indigo-500/20 bg-amber-100">
                  <img src={myAvatarSrc} alt="Your avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </Link>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-white truncate">{currentUser.name}</h2>
                <p className="text-xs text-gray-400">Your Profile</p>
              </div>
            </div>
            <Link
              to="/profile"
              className="block w-full text-center px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium transition"
            >
              Edit Profile
            </Link>
          </div>
        )}

        {/* Filters Section */}
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Search by name</label>
              <input
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                placeholder="Username or name..."
                value={filters.username}
                onChange={e => setFilters({ ...filters, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Skills</label>
              <input
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                placeholder="e.g. react, node"
                value={filters.skills}
                onChange={e => setFilters({ ...filters, skills: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Experience</label>
              <select
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                value={filters.experienceLevel}
                onChange={e => setFilters({ ...filters, experienceLevel: e.target.value })}
              >
                <option value="">Any</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Looking for</label>
              <select
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                value={filters.lookingFor}
                onChange={e => setFilters({ ...filters, lookingFor: e.target.value })}
              >
                <option value="">Any</option>
                <option value="hackathon">Hackathon Partner</option>
                <option value="coding">Coding Buddy</option>
                <option value="startup">Startup Co-founder</option>
              </select>
            </div>

            <button
              onClick={load}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Apply Filters
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Profiles found</span>
            <span className="font-semibold text-white">{users.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-400">Current</span>
            <span className="font-semibold text-white">
              {currentIndex < users.length ? `${currentIndex + 1} / ${users.length}` : "Done"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Profile View */}
      <div className="flex-1 min-h-0">
        {currentIndex >= users.length ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400 p-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-lg mb-2">No more profiles!</p>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or discover more developers</p>
              <button
                onClick={load}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Profile Card */}
            <div className="flex-1 relative">
              {/* Next card (background) */}
              {users[currentIndex + 1] && (
                <div className="absolute inset-0 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden scale-95 opacity-50">
                  <UserCard user={users[currentIndex + 1]} />
                </div>
              )}

              {/* Current card */}
              <div
                ref={cardRef}
                className="absolute inset-0 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none shadow-2xl"
                style={{
                  transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
                onTouchStart={e => handleStart(e.touches[0].clientX)}
                onTouchMove={e => handleMove(e.touches[0].clientX)}
                onTouchEnd={handleEnd}
                onMouseDown={e => handleStart(e.clientX)}
                onMouseMove={e => handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
              >
                {/* Like/Skip indicators */}
                <div
                  className="absolute top-6 left-6 z-10 border-4 border-green-500 text-green-500 font-bold text-2xl px-4 py-2 rounded-lg transform -rotate-12 transition-opacity"
                  style={{ opacity: dragOffset > 50 ? opacity : 0 }}
                >
                  LIKE
                </div>
                <div
                  className="absolute top-6 right-6 z-10 border-4 border-red-500 text-red-500 font-bold text-2xl px-4 py-2 rounded-lg transform rotate-12 transition-opacity"
                  style={{ opacity: dragOffset < -50 ? opacity : 0 }}
                >
                  SKIP
                </div>

                <UserCard
                  user={currentCard}
                  isRequestSent={currentCard?._id && sentRequests.has(currentCard._id)}
                  isMatched={currentCard?._id && matches.has(currentCard._id)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={skip}
                className="w-16 h-16 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center transition transform hover:scale-105"
              >
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={like}
                className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition transform hover:scale-105 shadow-lg shadow-indigo-500/30"
              >
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({ user, isRequestSent, isMatched }) {
  const avatarUrl = user?.avatar || user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}&backgroundColor=ffdfbf`;

  const getLookingForLabel = (val) => {
    const labels = {
      hackathon: "Hackathon Partner",
      coding: "Coding Buddy",
      startup: "Startup Co-founder"
    };
    if (Array.isArray(val)) {
      return val.map(v => labels[v] || v).join(", ");
    }
    return labels[val] || val;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Image Section - smaller on mobile */}
      <div className="relative h-1/2 sm:h-2/3 bg-gradient-to-b from-gray-800 to-gray-900">
        <img
          src={avatarUrl}
          alt={user?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>

        {/* Status Badge */}
        {isMatched && (
          <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Connected
          </div>
        )}
        {isRequestSent && !isMatched && (
          <div className="absolute top-4 right-4 bg-yellow-500/90 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Request Sent
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-y-auto">
        <div className="mb-2 sm:mb-4">
          <h3 className="text-xl sm:text-3xl font-bold text-white">{user?.name}</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">{user?.college || "No college listed"}</p>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4">{user?.bio || "No bio available"}</p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {(user?.skills || []).slice(0, 4).map(s => (
            <span key={s} className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
              {s}
            </span>
          ))}
          {(user?.skills || []).length > 4 && (
            <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800 text-gray-400 rounded-full">
              +{(user?.skills || []).length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          {user?.experienceLevel && (
            <span className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
              {user.experienceLevel}
            </span>
          )}
          {user?.lookingFor && (
            <span className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full"></span>
              Looking for: {getLookingForLabel(user.lookingFor)}
            </span>
          )}
        </div>

        {/* Social Links - Only show if matched */}
        {isMatched && (
          <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800 animate-fade-in">
            {user?.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition group/link"
                onClick={e => e.stopPropagation()}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate max-w-[100px] sm:max-w-none">Email</span>
              </a>
            )}
            {user?.githubUsername && (
              <a
                href={`https://github.com/${user.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition"
                onClick={e => e.stopPropagation()}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {user?.leetcodeUsername && (
              <a
                href={`https://leetcode.com/${user.leetcodeUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition"
                onClick={e => e.stopPropagation()}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.028c.693-.693 1.814-.693 2.508 0 .434.433.618 1.025.551 1.61a1.68 1.68 0 0 1-.071.333 1.742 1.742 0 0 1-.559.995l-2.095 2.095a.489.489 0 0 0-.117.289.49.49 0 0 0 .146.35.498.498 0 0 0 .697 0l2.096-2.095a2.726 2.726 0 0 0 .873-1.563 2.72 2.72 0 0 0-.116-1.147 2.726 2.726 0 0 0-.961-1.405c-.937-.936-2.246-1.139-3.349-.609a3.39 3.39 0 0 0-.471.271l-4.276-4.193a5.217 5.217 0 0 0-1.112-1.59 5.274 5.274 0 0 0-1.658-1.058A5.319 5.319 0 0 0 0 7.116v9.768c0 .759.157 1.5.465 2.195a5.358 5.358 0 0 0 1.282 1.801l5.433 5.433c.525.524 1.226.813 1.972.813h7.136c.746 0 1.447-.289 1.972-.813l5.433-5.433a5.358 5.358 0 0 0 1.282-1.801 5.403 5.403 0 0 0 .465-2.195V7.116a5.319 5.319 0 0 0-1.548-3.742 5.274 5.274 0 0 0-1.658-1.058A5.266 5.266 0 0 0 21.884 2.1l-3.854-4.126A1.374 1.374 0 0 0 16.517 0h-3.034z" />
                </svg>
                LeetCode
              </a>
            )}
          </div>
        )}

        {!isMatched && (
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              Match to unlock contact info
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
