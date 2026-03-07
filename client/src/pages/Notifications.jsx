import { useEffect, useState } from "react";
import api from "../lib/api.js";

export default function Notifications() {
  const [items, setItems] = useState([]);

  async function load() {
    const { data } = await api.get("/requests/pending");
    setItems(data);
  }
  useEffect(() => { load(); }, []);

  async function accept(id) {
    await api.put(`/requests/${id}/accept`);
    load();
  }
  async function reject(id) {
    await api.put(`/requests/${id}/reject`);
    load();
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Notifications</h2>
      <div className="space-y-2">
        {items.map(r => (
          <div key={r._id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded p-3">
            <div>
              <p className="font-medium">{r.fromUser.name}</p>
              <div className="flex gap-1 mt-1">
                {(r.fromUser.skills||[]).map(s => <span key={s} className="text-xs px-2 py-1 bg-gray-800 rounded">{s}</span>)}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>reject(r._id)} className="px-3 py-2 bg-gray-800 rounded border border-gray-700">Reject</button>
              <button onClick={()=>accept(r._id)} className="px-3 py-2 bg-indigo-600 rounded">Accept</button>
            </div>
          </div>
        ))}
        {items.length===0 && <p className="text-gray-400">No pending requests.</p>}
      </div>
    </div>
  );
}
