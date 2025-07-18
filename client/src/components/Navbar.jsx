import { useNavigate } from "react-router-dom";

// src/components/Navbar.jsx
export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }
  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-7 4h10a2 2 0 002-2V7a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0010.586 3H7a2 2 0 00-2 2v12a2 2 0 002 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Invoice Generator
        </h1>
      </div>
      <button
        onClick={handleLogout}
      className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-full shadow hover:bg-blue-50 transition">
        Logout
      </button>
    </nav>
  );
}
