import { useState } from "react";
import { setAuthToken } from "../lib/auth";
import Axios from "../utils/Axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await Axios.post("/auth/login", { username, password });
      setAuthToken(data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-indigo-100 to-purple-100 p-4 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl -z-10 animate-pulse" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-blue-100 space-y-6"
        autoComplete="on"
      >
        {/* App Logo & Title */}
        <div className="flex flex-col items-center gap-2 mb-3">
          {/* You can swap this svg for your logo */}
          <svg width={48} height={48} viewBox="0 0 48 48" className="mb-1">
            <defs>
              <linearGradient id="a" x1="0" x2="1" y1="1" y2="0">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <rect width="48" height="48" rx="12" fill="url(#a)" />
            <path
              d="M16 18h16M16 24h16M16 30h8"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Invoice Generator
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Sign in to your dashboard
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200 text-center animate-shake">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/30"
            placeholder="admin"
            disabled={submitting}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/30"
            placeholder="admin123"
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 disabled:opacity-60 text-white py-2.5 rounded-lg font-semibold text-lg transition-all shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z"
                />
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-xs text-gray-400 text-center pt-2">
          &copy; {new Date().getFullYear()} Invoice Generator &mdash; Secure admin access only.
        </div>
      </form>
    </div>
  );
}