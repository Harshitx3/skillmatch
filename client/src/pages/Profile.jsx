import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";

const GithubIcon = () => (
  <svg className="w-5 h-5 opacity-70" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LeetCodeIcon = () => (
  <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.513-.514.498-1.366-.037-1.901-.536-.535-1.388-.52-1.902.038l-10.1 10.101c-.981.982-1.594 2.311-1.594 3.76s.613 2.778 1.594 3.76l10.1 10.1c.514.515 1.366.499 1.902-.036.535-.536.55-1.387.037-1.902l-2.467-2.503a5.055 5.055 0 0 0 2.445-1.336l2.609-2.636c.514-.514.496-1.365-.039-1.901-.535-.535-1.386-.552-1.9-.038z" />
  </svg>
);

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    college: "",
    skills: "",
    bio: "",
    githubUsername: "",
    leetcodeUsername: "",
    linkedin: "",
    lookingFor: "",
    experienceLevel: "",
    avatar: ""
  });
  const [isNewUser, setIsNewUser] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: "" });
  const [originalUsername, setOriginalUsername] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const me = await api.get("/api/users/me");
        if (me?.data) {
          const data = me.data;
          // Convert skills array to string if needed
          if (Array.isArray(data.skills)) {
            data.skills = data.skills.join(", ");
          }
          setForm(prev => ({
            ...prev,
            ...data,
            // Ensure avatar is set from the data
            avatar: data.avatar || prev.avatar
          }));
          setOriginalUsername(data.username || "");
          // Check if profile is incomplete
          const hasIncompleteProfile = !data.college || !data.bio ||
            !data.skills || !data.githubUsername ||
            !data.leetcodeUsername || !data.lookingFor || !data.experienceLevel;
          setIsNewUser(hasIncompleteProfile);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
    load();
  }, []);

  function set(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  // Check username availability with debounce
  useEffect(() => {
    if (!form.username || form.username === originalUsername) {
      setUsernameStatus({ checking: false, available: null, message: "" });
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (form.username.length < 3) {
        setUsernameStatus({ checking: false, available: false, message: "Username must be at least 3 characters" });
        return;
      }

      setUsernameStatus({ checking: true, available: null, message: "Checking availability..." });

      try {
        const { data } = await api.get(`/api/users/check-username?username=${form.username}`);
        if (data.available) {
          setUsernameStatus({ checking: false, available: true, message: "✓ Username available" });
        } else {
          setUsernameStatus({ checking: false, available: false, message: "✗ Username already taken" });
        }
      } catch {
        setUsernameStatus({ checking: false, available: false, message: "Error checking username" });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [form.username, originalUsername]);

  async function save(e) {
    e.preventDefault();

    // Prepare skills as array
    const skillsArray = (form.skills || "").split(",").map(s => s.trim()).filter(Boolean);

    const payload = {
      name: form.name,
      username: form.username,
      college: form.college,
      skills: skillsArray,
      bio: form.bio,
      githubUsername: form.githubUsername,
      leetcodeUsername: form.leetcodeUsername,
      linkedin: form.linkedin,
      lookingFor: form.lookingFor,
      experienceLevel: form.experienceLevel,
      avatar: form.avatar // Include avatar URL
    };

    try {
      const response = await api.put("/api/users/profile", payload);

      // Update local form with saved data
      if (response.data) {
        const updatedData = response.data;
        if (Array.isArray(updatedData.skills)) {
          updatedData.skills = updatedData.skills.join(", ");
        }
        setForm(prev => ({ ...prev, ...updatedData }));
      }

      alert("Profile saved! You are now discoverable to other users.");
      setIsNewUser(false);
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.error || "Error saving profile");
    }
  }

  const skillsList = (form.skills || "").split(',').map(s => s.trim()).filter(Boolean);
  // Get avatar source - prioritize avatar field, fallback to dicebear
  const avatarSrc = form.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username || form.name || "User"}&backgroundColor=ffdfbf`;

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/api/upload/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.url) {
        set('avatar', response.data.url);
        alert('Profile picture uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] p-3 sm:p-4 md:p-8 font-sans text-gray-100 flex justify-center">
      <div className="w-full max-w-6xl">
        {isNewUser && (
          <div className="mb-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Welcome to DevLink! 🎉</h2>
            <p className="text-gray-300 mb-4">
              Complete your profile to start connecting with other developers, or continue as an explorer to browse anonymously.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/discover")}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
              >
                Continue as Explorer →
              </button>
            </div>
          </div>
        )}
        <div className="mb-6 md:mb-8 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-violet-500 mb-2">DevLink Profile</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage your professional presence and connect with other builders.</p>
        </div>

        <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 border border-gray-800 bg-[#161822] rounded-xl p-6 shadow-xl h-max">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4 mt-2 group cursor-pointer">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#161822] ring-2 ring-violet-500/30 bg-amber-100 relative">
                  <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <label className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${uploading ? 'pointer-events-none' : ''}`}>
                    <span className="text-white text-xs font-medium">{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {form.experienceLevel && (
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-violet-500 text-white text-[10px] font-bold px-3 py-1 rounded-full border-2 border-[#161822] uppercase tracking-wider whitespace-nowrap">
                    {form.experienceLevel}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mt-4 text-center">{form.name || "Alex Rivera"}</h2>
              <p className="text-sm text-gray-400 mt-1 text-center">{form.college || "Stanford University"}</p>
            </div>

            <div className="mb-6 text-center">
              <p className="text-sm text-gray-300 italic px-2">
                "{form.bio || "Full-stack developer passionate about building scalable AI infrastructure and modern UI/UX."}"
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Core Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skillsList.length > 0 ? skillsList.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs">
                    {skill}
                  </span>
                )) : (
                  <span className="text-sm text-gray-600">No skills added yet</span>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-800">
              <div className="flex items-center text-sm text-gray-400 gap-3">
                <GithubIcon />
                <span className="truncate">{form.githubUsername ? `github.com/${form.githubUsername}` : "github.com/arivera-dev"}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400 gap-3">
                <LeetCodeIcon />
                <span className="truncate">{form.leetcodeUsername ? `leetcode.com/${form.leetcodeUsername}` : "leetcode.com/arivera"}</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 border border-gray-800 bg-[#161822] rounded-xl p-6 md:p-8 shadow-xl">
            <div className="space-y-8">
              {/* Basic Information */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 md:mb-5">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input
                      required
                      className="w-full px-4 py-2 bg-[#0B0F19] border border-gray-800 rounded-md text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                      placeholder="Alex Rivera"
                      value={form.name} onChange={e => set("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Username <span className="text-red-500">*</span></label>
                    <input
                      required
                      className={`w-full px-4 py-2 bg-[#0B0F19] border rounded-md text-sm text-white focus:outline-none focus:ring-1 transition-colors ${usernameStatus.available === true ? 'border-green-500 focus:border-green-500 focus:ring-green-500' :
                        usernameStatus.available === false ? 'border-red-500 focus:border-red-500 focus:ring-red-500' :
                          'border-gray-800 focus:border-violet-500 focus:ring-violet-500'
                        }`}
                      placeholder="alexrivera"
                      value={form.username} onChange={e => set("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    />
                    <p className={`text-xs mt-1 ${usernameStatus.available === true ? 'text-green-400' :
                      usernameStatus.available === false ? 'text-red-400' :
                        'text-gray-500'
                      }`}>
                      {usernameStatus.message || "Unique identifier for your profile (letters, numbers, underscores only)"}
                    </p>
                  </div>
                </div>
                <div className="mb-4 md:mb-5">
                  <label className="block text-xs font-medium text-gray-400 mb-2">College / University <span className="text-red-500">*</span></label>
                  <input
                    required
                    className="w-full px-4 py-2 bg-[#0B0F19] border border-gray-800 rounded-md text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    placeholder="Stanford University"
                    value={form.college} onChange={e => set("college", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Short Bio <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    className="w-full px-4 py-3 bg-[#0B0F19] border border-gray-800 rounded-md text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 h-24 resize-none transition-colors"
                    placeholder="Full-stack developer passionate about building..."
                    value={form.bio} onChange={e => set("bio", e.target.value)}
                  />
                </div>
              </section>

              <hr className="border-gray-800" />

              {/* Skills & Connections */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 md:mb-5">Skills & Connections</h3>
                <div className="mb-4 md:mb-5">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Professional Skills</label>
                  <div className="w-full px-2 py-1.5 flex flex-wrap gap-2 items-center bg-[#0B0F19] border border-gray-800 rounded-md focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all min-h-[42px]">
                    {skillsList.map(skill => (
                      <span key={skill} className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/20 text-violet-300 rounded text-xs select-none">
                        {skill}
                        <button
                          type="button"
                          className="hover:text-white focus:outline-none"
                          onClick={() => {
                            const updatedSkills = skillsList.filter(s => s !== skill).join(', ');
                            set("skills", updatedSkills);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-500 focus:outline-none min-w-[120px] px-2 py-1"
                      placeholder={skillsList.length === 0 ? "Add skill..." : "Add skill..."}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val) {
                            if (!skillsList.includes(val)) {
                              const newSkills = form.skills ? `${form.skills}, ${val}` : val;
                              set("skills", newSkills);
                            }
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const val = e.currentTarget.value.trim();
                        if (val) {
                          if (!skillsList.includes(val)) {
                            const newSkills = form.skills ? `${form.skills}, ${val}` : val;
                            set("skills", newSkills);
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">GitHub Username <span className="text-red-500">*</span></label>
                    <input
                      required
                      className="w-full px-4 py-2 bg-[#0B0F19] border border-gray-800 rounded-md text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                      placeholder="arivera-dev"
                      value={form.githubUsername} onChange={e => set("githubUsername", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">LeetCode Username <span className="text-red-500">*</span></label>
                    <input
                      required
                      className="w-full px-4 py-2 bg-[#0B0F19] border border-gray-800 rounded-md text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                      placeholder="arivera"
                      value={form.leetcodeUsername} onChange={e => set("leetcodeUsername", e.target.value)}
                    />
                  </div>
                </div>
                <div class="mt-4 md:mt-5">
                  <label className="block text-xs font-medium text-gray-400 mb-2">LinkedIn Profile</label>
                  <input
                    className="w-full px-4 py-2 bg-[#0B0F19] border border-gray-800 rounded-md text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    placeholder="linkedin.com/in/username"
                    value={form.linkedin} onChange={e => set("linkedin", e.target.value)}
                  />
                </div>
              </section>

              <hr className="border-gray-800" />

              {/* Preferences */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Looking For <span className="text-red-500">*</span></h3>
                    <div className="space-y-4">
                      {[
                        { label: "Hackathon Partner", value: "hackathon" },
                        { label: "Coding Buddy", value: "coding" },
                        { label: "Startup Co-Founder", value: "startup" }
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center w-5 h-5">
                            <input
                              required
                              type="radio"
                              name="lookingFor"
                              value={option.value}
                              checked={form.lookingFor === option.value}
                              onChange={e => set("lookingFor", e.target.value)}
                              className="peer appearance-none w-5 h-5 border border-gray-600 rounded-full checked:border-violet-500 focus:outline-none transition-colors cursor-pointer"
                            />
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-violet-500 scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                          </div>
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Experience Level <span className="text-red-500">*</span></h3>
                    <div className="space-y-4">
                      {["Beginner", "Intermediate", "Advanced"].map(option => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center w-5 h-5">
                            <input
                              required
                              type="radio"
                              name="experienceLevel"
                              value={option}
                              checked={form.experienceLevel === option}
                              onChange={e => set("experienceLevel", e.target.value)}
                              className="peer appearance-none w-5 h-5 border border-gray-600 rounded-full checked:border-violet-500 focus:outline-none transition-colors cursor-pointer"
                            />
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-violet-500 scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                          </div>
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-800/50 mt-6 md:mt-0">
                <button type="button" className="w-full sm:w-auto text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2 order-2 sm:order-1">
                  Cancel
                </button>
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-[#8b5cf6] hover:bg-violet-500 active:bg-violet-600 text-white text-sm font-medium rounded-md transition-colors shadow-lg shadow-violet-500/20 order-1 sm:order-2">
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
