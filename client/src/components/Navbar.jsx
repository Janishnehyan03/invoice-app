import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Reusable Button for consistency and accessibility
function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-700 transition-colors disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <header>
      <nav
        className="w-full bg-gray-900 shadow-lg px-4 sm:px-8 py-3 flex items-center justify-between"
        aria-label="Primary Navigation"
      >
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded"
            aria-label="Go to homepage"
          >
            <Home className="h-7 w-7 text-white drop-shadow" aria-hidden="true" />
            <span className="text-2xl font-bold tracking-wide drop-shadow-sm">
              Invoice Generator
            </span>
          </Link>
        </div>
        <Button
          onClick={handleLogout}
          className="bg-white text-sky-700 font-semibold px-5 py-2 rounded-full shadow hover:bg-sky-100 hover:text-sky-800 focus-visible:ring-sky-800"
          aria-label="Logout"
        >
          Logout
        </Button>
      </nav>
    </header>
  );
}