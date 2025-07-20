import {
  Home
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
        <Link to="/" className="flex items-center gap-2 text-white">
        <Home className="h-6 w-6 text-white" />
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Invoice Generator
        </h1>
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-full shadow hover:bg-blue-50 transition"
      >
        Logout
      </button>
    </nav>
  );
}
