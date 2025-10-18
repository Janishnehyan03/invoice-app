import { useMemo, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx"; // `npm install clsx`

/**
 * Formats a number as Indian Rupees (₹).
 * @param {number} amount - The amount to format.
 * @returns {string} - Formatted currency string (e.g., "₹1,234.56").
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);
};

// --- Sub-Components for the Table ---

const TableRow = ({ item, onEdit, onDelete }) => {
  // CORRECTED LOGIC: Total price is base price + taxes
  const sgstAmount = (item.price * item.sgst) / 100;
  const cgstAmount = (item.price * item.cgst) / 100;

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="font-medium text-gray-900">{item.name}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right font-mono">
        {formatCurrency(item.price)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
        {item.sgst}%
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
        {item.cgst}%
      </td>
  
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-indigo-600 hover:text-indigo-900"
            title={`Edit ${item.name}`}
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-red-600 hover:text-red-900"
            title={`Delete ${item.name}`}
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
      <tr key={i}>
        <td className="py-4 pl-4 pr-3 sm:pl-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </td>
        <td className="px-3 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        </td>
        <td className="px-3 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
        </td>
        <td className="px-3 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
        </td>
        <td className="px-3 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        </td>
        <td className="py-4 pl-3 pr-4 sm:pr-6">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-12 ml-auto"></div>
        </td>
      </tr>
    ))}
  </>
);

const EmptyState = ({ colSpan, searchTerm }) => (
  <tr>
    <td colSpan={colSpan} className="text-center py-16 px-4">
      <h3 className="text-lg font-medium text-gray-900">No items found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {searchTerm
          ? "Try adjusting your search terms."
          : "Get started by adding a new item."}
      </p>
    </td>
  </tr>
);


// --- Main Table Component ---

function ItemsTable({ items, isLoading, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const tableHeaders = ["Item Name", "Price", "SGST", "CGST",  "Actions"];

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.name.toLowerCase().includes(term));
  }, [items, search]);

  return (
    <div className="flow-root">
       <div className="mb-6 flex justify-end">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="block w-full p-3 max-w-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th
                      key={header}
                      scope="col"
                      className={clsx(
                        "py-3.5 text-left text-sm font-semibold text-gray-900",
                        index === 0 ? "pl-4 pr-3 sm:pl-6" : "px-3",
                        index > 0 && index < 5 && "text-right" // Right align numeric headers
                      )}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
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
      </div>
    </div>
  );
}

export default ItemsTable;