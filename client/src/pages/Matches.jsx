import { useEffect, useState } from "react";
import api from "../lib/api.js";

export default function Matches() {
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await api.get("/matches");
      setItems(data);
    }
    load();
  }, []);

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

      {/* Matches Grid */}
      {items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(u => (
            <div
              key={u._id}
              className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              {/* Avatar & Name Section */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setSelectedImage(getAvatarUrl(u))}
                  className="relative group w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 shadow-lg flex-shrink-0"
                >
                  <img
                    src={getAvatarUrl(u)}
                    alt={u.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('bg-gradient-to-br', getAvatarColor(u.name));
                      e.target.parentElement.innerHTML = `<span class="w-full h-full flex items-center justify-center text-white text-xl font-bold">${getInitials(u.name)}</span>`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white truncate">{u.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{u.college || "Developer"}</p>
                </div>
              </div>

              {/* Skills Tags */}
              {u.skills && u.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {u.skills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-full border border-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                  {u.skills.length > 4 && (
                    <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-full">
                      +{u.skills.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Bio */}
              {u.bio && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{u.bio}</p>
              )}

              {/* Contact Links */}
              <div className="space-y-2 pt-4 border-t border-gray-800">
                <a
                  href={`mailto:${u.email}`}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-indigo-400 transition group/link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{u.email}</span>
                </a>

                {u.githubUsername && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://github.com/${u.githubUsername}`}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-indigo-400 transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}

                {u.leetcodeUsername && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://leetcode.com/${u.leetcodeUsername}`}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-indigo-400 transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.028c.693-.693 1.814-.693 2.508 0 .434.433.618 1.025.551 1.61a1.68 1.68 0 0 1-.071.333 1.742 1.742 0 0 1-.559.995l-2.095 2.095a.489.489 0 0 0-.117.289.49.49 0 0 0 .146.35.498.498 0 0 0 .697 0l2.096-2.095a2.726 2.726 0 0 0 .873-1.563 2.72 2.72 0 0 0-.116-1.147 2.726 2.726 0 0 0-.961-1.405c-.937-.936-2.246-1.139-3.349-.609a3.39 3.39 0 0 0-.471.271l-4.276-4.193a5.217 5.217 0 0 0-1.112-1.59 5.274 5.274 0 0 0-1.658-1.058A5.319 5.319 0 0 0 0 7.116v9.768c0 .759.157 1.5.465 2.195a5.358 5.358 0 0 0 1.282 1.801l5.433 5.433c.525.524 1.226.813 1.972.813h7.136c.746 0 1.447-.289 1.972-.813l5.433-5.433a5.358 5.358 0 0 0 1.282-1.801 5.403 5.403 0 0 0 .465-2.195V7.116a5.319 5.319 0 0 0-1.548-3.742 5.274 5.274 0 0 0-1.658-1.058A5.266 5.266 0 0 0 21.884 2.1l-3.854-4.126A1.374 1.374 0 0 0 16.517 0h-3.034z" />
                    </svg>
                    <span>LeetCode</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
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
