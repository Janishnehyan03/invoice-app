import { useEffect, useState } from "react";
import { Box, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios";

/* ─── Reusable StatCard ─────────────────────────── */
function StatCard({ title, icon, description, to, stat, loading }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      aria-label={`View ${title}`}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-80" />

      <div className="p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition">
            {icon}
          </div>
        </div>

        {loading ? (
          <div className="mt-6 h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ) : (
          <p className="mt-5 text-4xl font-extrabold text-gray-900 tracking-tight">
            {stat?.toLocaleString() || 0}
          </p>
        )}

        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
    </Link>
  );
}

/* ─── Dashboard Header ─────────────────────────── */
function Header() {
  return (
    <header className="relative mb-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 rounded-2xl text-white p-8 shadow-md">
      <div className="relative z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-white/80 text-sm md:text-base">
          Welcome back, <span className="font-semibold">Admin</span> 👋 Manage your business at a glance.
        </p>
      </div>

      {/* Soft glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-2xl" />
    </header>
  );
}

/* ─── Main Dashboard ─────────────────────────── */
export default function ProfessionalDashboard() {
  const [summary, setSummary] = useState({
    clientCount: 0,
    itemCount: 0,
    invoiceCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await Axios.get("/dashboard/summary");
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const cardsData = [
    {
      title: "Invoices",
      icon: <FileText size={22} aria-hidden="true" />,
      to: "/invoices",
      description: "Total active invoices",
      stat: summary.invoiceCount,
    },
    {
      title: "Customers",
      icon: <Users size={22} aria-hidden="true" />,
      to: "/customers",
      description: "Registered customers",
      stat: summary.clientCount,
    },
    {
      title: "Items",
      icon: <Box size={22} aria-hidden="true" />,
      to: "/items",
      description: "Inventory items",
      stat: summary.itemCount,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 flex flex-col">
      <main className="flex-1 overflow-y-auto px-6 sm:px-10 py-8">
        <Header />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsData.map((card) => (
            <StatCard key={card.title} {...card} loading={loading} />
          ))}
        </div>
      </main>
    </div>
  );
}
