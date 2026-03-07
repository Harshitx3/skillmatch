import { useEffect, useState } from "react";
import api from "../lib/api.js";

export default function Swipe() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ skills: "", experienceLevel: "", lookingFor: "" });

  async function load() {
    const params = {};
    if (filters.skills) params.skills = filters.skills;
    if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
    if (filters.lookingFor) params.lookingFor = filters.lookingFor;
    const { data } = await api.get("/users", { params });
    setUsers(data);
  }

  useEffect(() => { load(); }, []);

  async function like(id) {
    await api.post("/requests", { toUser: id });
    setUsers(prev => prev.filter(u => u._id !== id));
  }

  function skip(id) {
    setUsers(prev => prev.filter(u => u._id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="skills e.g. react,node" value={filters.skills} onChange={e=>setFilters({...filters, skills:e.target.value})} />
        <input className="px-3 py-2 bg-gray-900 border border-gray-700 rounded" placeholder="experience" value={filters.experienceLevel} onChange={e=>setFilters({...filters, experienceLevel:e.target.value})} />
        <select className="px-3 py-2 bg-gray-900 border border-gray-700 rounded" value={filters.lookingFor} onChange={e=>setFilters({...filters, lookingFor:e.target.value})}>
          <option value="">Any</option>
          <option value="hackathon">Hackathon</option>
          <option value="startup">Startup</option>
          <option value="practice">Practice</option>
        </select>
        <button onClick={load} className="px-4 py-2 bg-gray-800 rounded border border-gray-700">Filter</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u => (
          <div key={u._id} className="bg-gray-900 border border-gray-800 rounded p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{u.name}</h3>
                <p className="text-xs text-gray-400">{u.college || ""}</p>
              </div>
            </div>
            <p className="text-sm mt-2">{u.bio}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {(u.skills||[]).map(s => <span key={s} className="text-xs px-2 py-1 bg-gray-800 rounded">{s}</span>)}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={()=>skip(u._id)} className="flex-1 px-3 py-2 bg-gray-800 rounded border border-gray-700">Skip</button>
              <button onClick={()=>like(u._id)} className="flex-1 px-3 py-2 bg-indigo-600 rounded">Like</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
