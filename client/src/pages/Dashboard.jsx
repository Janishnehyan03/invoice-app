import { useEffect, useState } from "react";
import { Box, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Axios from '../utils/Axios'

// --- Reusable StatCard Component ---
function StatCard({ title, icon, description, to, stat, loading }) {
  return (
    <Link
      to={to}
      className="group block p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-200"
      aria-label={`View ${title}`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-200 transition-colors">
          {icon}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 h-10 w-24 bg-slate-200 rounded animate-pulse" />
      ) : (
        <p className="mt-4 text-4xl font-extrabold text-slate-900">
          {stat?.toLocaleString() || 0}
        </p>
      )}

      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </Link>
  );
}

// --- Header Component ---
function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-slate-500">Hello, Admin! Welcome back.</p>
      </div>
    </header>
  );
}

// --- Main Dashboard Component ---
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
      icon: <FileText size={24} aria-hidden="true" />,
      to: "/invoices",
      description: "Total active invoices",
      stat: summary.invoiceCount,
    },
    {
      title: "Customers",
      icon: <Users size={24} aria-hidden="true" />,
      to: "/customers",
      description: "Total registered customers",
      stat: summary.clientCount,
    },
    {
      title: "Items",
      icon: <Box size={24} aria-hidden="true" />,
      to: "/items",
      description: "Items in inventory",
      stat: summary.itemCount,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto p-8 sm:p-12">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsData.map((card) => (
            <StatCard key={card.title} {...card} loading={loading} />
          ))}
        </div>
      </main>
    </div>
  );
}
