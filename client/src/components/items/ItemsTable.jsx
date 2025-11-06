import { useMemo, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

// ✅ Utility for currency
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);

// --- Subcomponents ---
const TableRow = ({ item, onEdit, onDelete }) => {
  const sgstAmount = (item.price * item.sgst) / 100;
  const cgstAmount = (item.price * item.cgst) / 100;

  return (
    <tr className="group transition-all hover:bg-indigo-50/40">
      {/* Name */}
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 font-medium text-gray-900">
        {item.name}
      </td>

      {/* Price */}
      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-700 font-mono">
        {formatCurrency(item.price)}
      </td>

      {/* SGST */}
      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-600">
        {item.sgst}%
      </td>

      {/* CGST */}
      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-600">
        {item.cgst}%
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition"
            title="Edit item"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition"
            title="Delete item"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const TableSkeleton = ({ rows = 5 }) => (
  <>
    {[...Array(rows)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        {[...Array(5)].map((_, j) => (
          <td key={j} className="py-4 px-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

const EmptyState = ({ colSpan, searchTerm }) => (
  <tr>
    <td colSpan={colSpan} className="py-16 text-center">
      <div className="max-w-sm mx-auto">
        <h3 className="text-lg font-semibold text-gray-800">
          {searchTerm ? "No results found" : "No items yet"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {searchTerm
            ? "Try adjusting your search term."
            : "Add your first item to get started."}
        </p>
      </div>
    </td>
  </tr>
);

// --- Main Component ---
export default function ItemsTable({ items, isLoading, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const tableHeaders = ["Item Name", "Price", "SGST", "CGST", "Actions"];

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.name.toLowerCase().includes(term));
  }, [items, search]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Item List
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your catalog items and applicable taxes.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 
            placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
          
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-inner">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={header}
                  scope="col"
                  className={clsx(
                    "py-3.5 text-left text-sm font-semibold text-gray-700",
                    index === 0 ? "pl-4 pr-3 sm:pl-6" : "px-3",
                    index > 0 && index < 5 && "text-right"
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow
                  key={item._id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <EmptyState colSpan={tableHeaders.length} searchTerm={search} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
