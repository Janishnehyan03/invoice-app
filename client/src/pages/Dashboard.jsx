import { Box, FileText } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Large, modern Button component (for future expansion).
 */
function Button({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 text-white text-lg font-semibold shadow-lg hover:from-gray-800 hover:to-gray-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-400 focus-visible:ring-offset-2 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Large Card component for dashboard.
 */
function LargeCard({ children, className = "", ...props }) {
  return (
    <section
      className={`bg-gradient-to-br from-white via-gray-50 to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-10 sm:p-14 md:p-16 transition-shadow duration-200 hover:shadow-2xl focus-within:ring-4 focus-within:ring-gray-400 ${className}`}
      tabIndex={-1}
      {...props}
    >
      {children}
    </section>
  );
}

/**
 * BigStatCard -- prominent, highly visible dashboard card.
 */
function BigStatCard({ title, icon, description, to }) {
  return (
    <li className="flex">
      <Link
        to={to}
        className="group focus-visible:outline-none rounded-3xl w-full block"
        aria-label={`Go to ${title}`}
      >
        <LargeCard className="flex flex-col items-center gap-7 group hover:bg-gray-100/70 transition-colors duration-150 h-full justify-center text-center">
          <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-100 text-gray-700 group-hover:bg-gray-200 transition-colors duration-150 mb-2 shadow">
            {icon}
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 group-hover:text-gray-700 transition-colors duration-150">
            {title}
          </h2>
          <p className="mt-2 text-lg text-gray-500 font-medium">
            {description}
          </p>
        </LargeCard>
      </Link>
    </li>
  );
}

/**
 * Dashboard: only two big cards, centered in the viewport.
 */
export default function Dashboard() {
  const cards = [
    {
      title: "Invoices",
      icon: <FileText size={48} aria-hidden="true" focusable={false} />,
      to: "/invoices",
      description: "View and manage all your invoices",
    },
    {
      title: "Items",
      icon: <Box size={48} aria-hidden="true" focusable={false} />,
      to: "/items",
      description: "Manage inventory and billable items",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-white flex items-center justify-center">
      <nav
        aria-label="Dashboard main links"
        className="w-full max-w-5xl px-4 sm:px-8"
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 w-full items-center">
          {cards.map((card) => (
            <BigStatCard key={card.title} {...card} />
          ))}
        </ul>
      </nav>
    </main>
  );
}
