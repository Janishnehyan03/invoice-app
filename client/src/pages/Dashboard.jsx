import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, FileText } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    invoices: 0,
    clients: 0,
    items: 0,
  });

  useEffect(() => {
    // Mock API data - replace with real API calls
    setStats({
      invoices: 12,
      clients: 8,
      items: 24,
    });
  }, []);

  const cards = [
    {
      title: "Invoices",
      value: stats.invoices,
      icon: (
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-tr from-blue-400 to-blue-600 shadow text-white group-hover:scale-110 transition-transform">
          <FileText size={28} />
        </div>
      ),
      accent: "border-blue-100 hover:border-blue-400 focus:ring-blue-300",
      to: "/invoices",
      description: "View and manage all your invoices",
    },
    {
      title: "Items",
      value: stats.items,
      icon: (
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-tr from-purple-400 to-purple-600 shadow text-white group-hover:scale-110 transition-transform">
          <Box size={28} />
        </div>
      ),
      accent: "border-purple-100 hover:border-purple-400 focus:ring-purple-300",
      to: "/items",
      description: "Manage inventory and billable items",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-100 via-blue-50 to-gray-200 pb-32">
      {/* Header */}
      <header className="px-8 pt-14 pb-10 flex flex-col gap-2 bg-white shadow-md rounded-b-3xl mb-14 border-b border-blue-100">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <span className="bg-gradient-to-tr from-blue-400 to-purple-600 bg-clip-text text-transparent drop-shadow">
            Dashboard
          </span>
        </h1>
        <div className="text-gray-500 text-lg sm:text-xl font-medium mt-1">
          Welcome back! Here’s a quick overview of your business.
        </div>
      </header>

      {/* Stats Grid */}
      <section
        aria-label="Quick stats"
        className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-8"
      >
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            tabIndex={0}
            className="outline-none group"
            aria-label={`Go to ${card.title}`}
          >
            <div
              className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-transform duration-200 cursor-pointer p-7 flex items-center gap-7 border ${card.accent} focus:ring-2`}
            >
              {card.icon}
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </span>
                <span className="mt-2 text-sm text-gray-400">
                  {card.description}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Footer micro-copy */}
      <footer className="mt-24 flex justify-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </main>
  );
}
