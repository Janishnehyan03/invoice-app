import { useMemo, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Eye } from "lucide-react";

const TableRow = ({ client, onEdit, onDelete }) => (
  <tr className="group hover:bg-gray-50">
    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-gray-900">{client.name}</div>
        </div>
      </div>
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      {client.phone || "N/A"}
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
      {client.address || "N/A"}
    </td>
    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(client)}
          className="p-1.5 text-gray-500 hover:text-indigo-600"
          title="Edit"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(client)}
          className="p-1.5 text-gray-500 hover:text-red-600"
          title="Delete"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => (window.location.href = `/customers/${client._id}`)}
          className="p-1.5 text-gray-500 hover:text-green-600"
          title="View Details"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>
    </td>
  </tr>
);

const TableSkeleton = ({ rows = 5 }) =>
  [...Array(rows)].map((_, i) => (
    <tr key={i} className="animate-pulse">
      <td className="py-4 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 rounded mt-1.5"></div>
          </div>
        </div>
      </td>
      <td className="px-3 py-4">
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
      </td>
      <td className="px-3 py-4">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
      </td>
      <td className="py-4 pl-3 pr-4 sm:pr-6">
        <div className="h-5 w-16 bg-gray-200 rounded ml-auto"></div>
      </td>
    </tr>
  ));

export default function CustomerTable({
  clients,
  isLoading,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.email && c.email.toLowerCase().includes(term))
    );
  }, [clients, search]);

  const headers = ["Customer", "Phone", "Address", ""];

  return (
    <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5">
      <div className="p-4">
        <input
          type="search"
          placeholder="Search customers by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full max-w-md rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={header}
                  scope="col"
                  className={`py-3.5 text-left text-sm font-semibold text-gray-900 ${
                    idx === 0 ? "pl-4 pr-3 sm:pl-6" : "px-3"
                  } ${idx === headers.length - 1 ? "relative sm:pr-6" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <TableSkeleton />
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow
                  key={client._id}
                  client={client}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-10 px-4 text-gray-500"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
