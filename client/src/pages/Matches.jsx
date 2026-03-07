import { useEffect, useState } from "react";
import api from "../lib/api.js";

export default function Matches() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    async function load() {
      const { data } = await api.get("/matches");
      setItems(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Matches</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(u => (
          <div key={u._id} className="bg-gray-900 border border-gray-800 rounded p-4">
            <h3 className="font-semibold">{u.name}</h3>
            <p className="text-xs text-gray-400">{u.college || ""}</p>
            <div className="text-sm mt-2 space-y-1">
              <a className="text-indigo-400" href={`mailto:${u.email}`}>{u.email}</a>
              {u.githubUsername && <div><a className="text-indigo-400" target="_blank" href={`https://github.com/${u.githubUsername}`}>GitHub</a></div>}
              {u.leetcodeUsername && <div><a className="text-indigo-400" target="_blank" href={`https://leetcode.com/${u.leetcodeUsername}`}>LeetCode</a></div>}
            </div>
          </div>
        ))}
      </div>
      {items.length===0 && <p className="text-gray-400">No matches yet.</p>}
    </div>
  );
}
