import { useState } from "react";
import api from "../lib/api.js";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";

export default function Register({ switchToLogin }) {
  const [step, setStep] = useState(1); // 1: Details (Name, Email, Password), 2: OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/send-otp", { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password, otp });
      localStorage.setItem("token", data.token);
      window.location.href = "/profile";
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Invalid OTP?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-2 text-center">Create Account</h2>
        <p className="text-gray-400 text-center mb-6">Join the community of developers.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm text-center animate-fade-in">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
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
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="dev@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? "Sending OTP..." : "Continue to Verification"}
            </button>
          </form>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div className="text-center">
              <p className="text-indigo-400 font-medium mb-2">Check your inbox!</p>
              <p className="text-sm text-gray-500 mb-6">We've sent a 6-digit verification code to <br/><span className="text-gray-300">{email}</span></p>
              
              <label className="block text-sm font-medium text-gray-400 mb-2">Verification Code</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Complete Signup"}
            </button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:text-gray-400 transition"
            >
              ← Back to details
            </button>
          </form>
        )}
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
          Already have an account?{" "}
          <button onClick={switchToLogin} className="text-indigo-500 hover:text-indigo-400 font-semibold bg-transparent border-none">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
