// src/layouts/MainLayout.jsx
import { LayoutDashboard, FileText, Box, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

/**
 * Navigation link for the sidebar.
 */
function NavLink({ to, icon, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
          isActive
            ? "bg-slate-700 text-white"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
      >
        {icon}
        <span className="flex-1">{children}</span>
      </Link>
    </li>
  );
}

/**
 * Sidebar component (replaces Navbar).
 */
function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <LayoutDashboard size={24} />
        </div>
        <h1 className="text-xl font-bold">Invoice Maker</h1>
      </div>  
      <nav>
        <ul className="space-y-2">
          <NavLink to="/" icon={<LayoutDashboard size={20} />}>
            Dashboard
          </NavLink>
          <NavLink to="/invoices" icon={<FileText size={20} />}>
            Invoices
          </NavLink>
          <NavLink to="/items" icon={<Box size={20} />}>
            Items
          </NavLink>
          <NavLink to="/customers" icon={<Users size={20} />}>
            Customers
          </NavLink>
        </ul>
      </nav>
    </aside>
  );
}

/**
 * Main layout without navbar — only sidebar.
 */
export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}
