import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

/**
 * Large, modern, and accessible table row for invoice list.
 * Uses a gray/gray color theme to match the new dashboard.
 */
const TableRow = ({ invoice, onView, onEdit, onDelete }) => (
  <tr className="transition hover:bg-gray-50/90 group">
    <td className="whitespace-nowrap py-6 pl-8 pr-6 text-lg">
      <div className="flex items-center gap-5">
        {/* User avatar or placeholder */}
        <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-tr from-gray-500 to-gray-500 flex items-center justify-center text-white font-black text-2xl shadow-md group-hover:scale-105 transition-transform duration-150">
          {invoice.to?.[0]?.toUpperCase() || "C"}
        </div>
        <div>
          <div className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors flex items-center gap-2">
            {invoice.to}
            {invoice.isPaid && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-200 to-green-100 text-green-800 border border-green-300 animate-fadeIn">
                Paid
              </span>
            )}
          </div>
          <div className="mt-1 text-sm text-gray-500 tracking-wide">
            <span className="bg-gray-100 px-3 py-1 rounded font-mono text-gray-700 shadow">
              #{invoice.invoiceNumber}
            </span>
          </div>
        </div>
      </div>
    </td>
    <td className="whitespace-nowrap px-6 py-6 text-lg">
      <div className="font-semibold text-gray-700 truncate max-w-xs">
        {invoice.workName || <span className="italic text-gray-400">N/A</span>}
      </div>
      <div className="mt-2 text-sm text-gray-400 flex flex-wrap items-center gap-3">
        <span>
          {invoice.date ? new Date(invoice.date).toLocaleDateString() : "--"}
        </span>
        {invoice.dueDate && (
          <>
            <span className="text-gray-200">|</span>
            <span className="text-sm text-gray-600 font-medium">
              Due: {new Date(invoice.dueDate).toLocaleDateString()}
            </span>
          </>
        )}
      </div>
    </td>
    <td className="whitespace-nowrap py-6 pr-8 text-right text-lg font-medium">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onView(invoice)}
          className="rounded-full p-3 text-gray-700 hover:text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none transition shadow-sm"
          title={`View ${invoice.invoiceNumber}`}
          aria-label={`View ${invoice.invoiceNumber}`}
        >
          <EyeIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => onEdit(invoice)}
          className="rounded-full p-3 text-gray-500 hover:text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none transition shadow-sm"
          title={`Edit ${invoice.invoiceNumber}`}
          aria-label={`Edit ${invoice.invoiceNumber}`}
        >
          <PencilSquareIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => onDelete(invoice)}
          className="rounded-full p-3 text-rose-500 hover:text-white hover:bg-rose-600 focus:ring-2 focus:ring-rose-400 focus:outline-none transition shadow-sm"
          title={`Delete ${invoice.invoiceNumber}`}
          aria-label={`Delete ${invoice.invoiceNumber}`}
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
    </td>
  </tr>
);

export const InvoiceTable = ({ invoices, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-3xl shadow-2xl ring-1 ring-gray-100 bg-gradient-to-br from-white via-gray-50 to-gray-50">
      <table className="min-w-full divide-y divide-gray-100 text-base">
        <thead className="bg-gradient-to-r from-gray-100 via-white to-gray-100 sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              className="py-5 pl-8 pr-6 text-left text-sm font-black text-gray-700 tracking-widest uppercase"
            >
              Client / Invoice #
            </th>
            <th
              scope="col"
              className="px-6 py-5 text-left text-sm font-black text-gray-700 tracking-widest uppercase"
            >
              Work Name / Date
            </th>
            <th
              scope="col"
              className="py-5 pr-8 text-right text-sm font-black text-gray-700 tracking-widest uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {invoices.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="p-12 text-center text-gray-300 italic bg-white text-lg"
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
