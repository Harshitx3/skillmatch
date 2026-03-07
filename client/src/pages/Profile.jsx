import { useEffect, useState } from "react";
import api from "../lib/api.js";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    college: "",
    skills: "",
    bio: "",
    githubUsername: "",
    leetcodeUsername: "",
    lookingFor: "",
    experienceLevel: ""
  });

  useEffect(() => {
    async function load() {
      try {
        const me = await api.get("/users", { params: {} });
      } catch {}
    }
    load();
  }, []);

  function set(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function save() {
    const payload = { ...form, skills: form.skills.split(",").map(s=>s.trim()).filter(Boolean) };
    await api.put("/users/profile", payload);
    alert("Saved");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <h2 className="text-2xl font-semibold">Edit Profile</h2>
      <input className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="Name" value={form.name} onChange={e=>set("name", e.target.value)} />
      <input className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="College" value={form.college} onChange={e=>set("college", e.target.value)} />
      <input className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="Skills (comma separated)" value={form.skills} onChange={e=>set("skills", e.target.value)} />
      <textarea className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="Bio" value={form.bio} onChange={e=>set("bio", e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <input className="px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="GitHub username" value={form.githubUsername} onChange={e=>set("githubUsername", e.target.value)} />
        <input className="px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="LeetCode username" value={form.leetcodeUsername} onChange={e=>set("leetcodeUsername", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select className="px-3 py-2 bg-gray-900 border border-gray-700 rounded" value={form.lookingFor} onChange={e=>set("lookingFor", e.target.value)}>
          <option value="">Looking For</option>
          <option value="hackathon">Hackathon</option>
          <option value="startup">Startup</option>
          <option value="practice">Practice</option>
        </select>
        <input className="px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="Experience level" value={form.experienceLevel} onChange={e=>set("experienceLevel", e.target.value)} />
      </div>
      <button onClick={save} className="px-4 py-2 bg-indigo-600 rounded">Save</button>
    </div>
  );
}
