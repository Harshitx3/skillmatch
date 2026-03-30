import { useState } from "react";
import api from "../lib/api.js";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";

export default function Login({ switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      // Store admin status
      if (data.user?.isAdmin) {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.removeItem("isAdmin");
      }
      // Redirect based on admin or profile completion
      if (data.user?.isAdmin) {
        window.location.href = "/admin/events";
      } else if (data.profileComplete) {
        window.location.href = "/discover";
      } else {
        window.location.href = "/profile";
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="p-4 flex flex-col h-full max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-6">Login to continue your journey.</p>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="dev@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-indigo-500/20"
          >
            Go In
          </button>
        </form>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="px-4 bg-[#0f111a] text-gray-500 font-bold">OR</span>
          </div>
        </div>

        <GoogleAuthButton />

        <p className="mt-6 text-center text-gray-400 text-sm pb-2">
          Don't have an account?{" "}
          <button onClick={switchToRegister} className="text-indigo-500 hover:text-indigo-400 font-semibold bg-transparent border-none">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
