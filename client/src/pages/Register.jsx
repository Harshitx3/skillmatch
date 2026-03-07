import { useState } from "react";
import api from "../lib/api.js";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";

export default function Register({ switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", data.token);
      window.location.href = "/swipe";
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-2 text-center">Create Account</h2>
      <p className="text-gray-400 text-center mb-8">Join the community of developers.</p>
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-indigo-500/20"
        >
          Register
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-500">OR</span>
        </div>
      </div>

      <GoogleAuthButton />

      <p className="mt-8 text-center text-gray-400">
        Already have an account?{" "}
        <button onClick={switchToLogin} className="text-indigo-500 hover:text-indigo-400 font-semibold bg-transparent border-none">
          Login here
        </button>
      </p>
    </div>
  );
}
