import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

/**
 * Modern, clean, and responsive table row for invoice list.
 */
const TableRow = ({ invoice, onView, onEdit, onDelete }) => (
  <tr
    key={invoice._id}
    className="transition hover:bg-indigo-50/80 group"
  >
    <td className="whitespace-nowrap py-4 pl-6 pr-4 text-sm">
      <div className="flex items-center gap-3">
        {/* User avatar or placeholder */}
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
          {invoice.to?.[0]?.toUpperCase() || "C"}
        </div>
        <div>
          <div className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors flex items-center gap-1">
            {invoice.to}
            {invoice.isPaid && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 animate-fadeIn">
                Paid
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-gray-500 tracking-wide">
            <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">
              #{invoice.invoiceNumber}
            </span>
          </div>
        </div>
      </div>
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm">
      <div className="font-medium text-gray-700 truncate max-w-xs">
        {invoice.workName || <span className="italic text-gray-400">N/A</span>}
      </div>
      <div className="mt-1 text-xs text-gray-400 flex items-center gap-2">
        <span>
          {invoice.date ? new Date(invoice.date).toLocaleDateString() : "--"}
        </span>
        {invoice.dueDate && (
          <>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-orange-500">
              Due: {new Date(invoice.dueDate).toLocaleDateString()}
            </span>
          </>
        )}
      </div>
    </td>
    <td className="whitespace-nowrap py-4 pr-6 text-right text-sm font-medium">
      <div className="flex items-center justify-end gap-1.5">
        <button
          onClick={() => onView(invoice)}
          className="rounded-full p-2 text-indigo-600 hover:text-white hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300 transition group"
          title={`View ${invoice.invoiceNumber}`}
          aria-label={`View ${invoice.invoiceNumber}`}
        >
          <EyeIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onEdit(invoice)}
          className="rounded-full p-2 text-gray-500 hover:text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 transition group"
          title={`Edit ${invoice.invoiceNumber}`}
          aria-label={`Edit ${invoice.invoiceNumber}`}
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(invoice)}
          className="rounded-full p-2 text-red-500 hover:text-white hover:bg-red-500 focus:ring-2 focus:ring-red-300 transition group"
          title={`Delete ${invoice.invoiceNumber}`}
          aria-label={`Delete ${invoice.invoiceNumber}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </td>
  </tr>
);

export const InvoiceTable = ({ invoices, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl ring-1 ring-slate-100 bg-white">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-gradient-to-r from-indigo-50 via-white to-blue-50 sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-6 pr-4 text-left text-xs font-extrabold text-slate-700 tracking-widest uppercase"
            >
              Client / Invoice #
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-xs font-extrabold text-slate-700 tracking-widest uppercase"
            >
              Work Name / Date
            </th>
            <th
              scope="col"
              className="py-3.5 pr-6 text-right text-xs font-extrabold text-slate-700 tracking-widest uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {invoices.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="p-8 text-center text-gray-400 italic bg-white"
              >
                No invoices to display.
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <TableRow
                key={invoice._id}
                invoice={invoice}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};