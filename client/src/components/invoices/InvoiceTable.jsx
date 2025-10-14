import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

// --- HELPERS (Unchanged but good) ---

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

const getInitial = (name) =>
  (name && typeof name === "string" && name.trim()[0]?.toUpperCase()) || "C";

// --- REUSABLE & STYLED COMPONENTS ---

const ActionButton = ({ onClick, icon: Icon, label, className, ...props }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click when an action is clicked
        onClick();
      }}
      className={clsx(
        "p-2 rounded-md focus:outline-none focus-visible:ring-2",
        className
      )}
      aria-label={label}
      {...props}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};

const ClientInfo = ({
  clientName,
  invoiceNumber,
  avatarInitial,
  phone,
  address,
}) => {
  const avatarClasses =
    "flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-extrabold text-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-200 border border-indigo-200 shadow-sm";

  return (
    <div className="flex items-center gap-4">
      <div className={avatarClasses}>{avatarInitial}</div>
      <div>
        <div className="font-semibold text-gray-900 truncate max-w-xs">
          {clientName}
        </div>
        {phone && (
          <div className="text-sm text-gray-500 truncate max-w-xs">{phone}</div>
        )}
        {address && (
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {address}
          </div>
        )}
        <div className="mt-0.5 text-xs text-gray-500 font-mono tracking-tight">
          #{invoiceNumber}
        </div>
      </div>
    </div>
  );
};

const InvoiceActions = ({ invoice, onView, onEdit, onDelete }) => (
  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
    <ActionButton
      onClick={() => onView(invoice)}
      icon={EyeIcon}
      label={`View invoice ${invoice.invoiceNumber}`}
      className="text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus-visible:ring-indigo-500"
      title={`View #${invoice.invoiceNumber}`}
    />
    <ActionButton
      onClick={() => onEdit(invoice)}
      icon={PencilSquareIcon}
      label={`Edit invoice ${invoice.invoiceNumber}`}
      className="text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus-visible:ring-indigo-500"
      title={`Edit #${invoice.invoiceNumber}`}
    />
    <ActionButton
      onClick={() => onDelete(invoice)}
      icon={TrashIcon}
      label={`Delete invoice ${invoice.invoiceNumber}`}
      className="text-gray-500 hover:text-rose-600 hover:bg-rose-50 focus-visible:ring-rose-500"
      title={`Delete #${invoice.invoiceNumber}`}
    />
  </div>
);

// --- MAIN TABLE ROW COMPONENT ---

const TableRow = ({ invoice, onView, onEdit, onDelete }) => (
  <tr
    onClick={() => onView(invoice)}
    tabIndex={0}
    className="group relative cursor-pointer hover:bg-indigo-50/70 focus:outline-none focus:bg-indigo-100 transition-colors duration-150"
    aria-label={`View invoice ${invoice.invoiceNumber}`}
  >
    {/* Client & Invoice Info */}
    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
      <ClientInfo
        clientName={invoice.client?.name ?? "Unknown"}
        invoiceNumber={invoice.invoiceNumber}
        avatarInitial={getInitial(invoice.client?.name)}
        phone={invoice.client?.phone}
        address={invoice.client?.address}
      />
    </td>

    {/* Work Name */}
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">
      {invoice.workName || "N/A"}
    </td>

    {/* Work Code */}
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      {invoice.workCode || "N/A"}
    </td>

    {/* Invoice Date */}
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      {formatDate(invoice.date)}
    </td>

    {/* Actions (visible on hover/focus) */}
    <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
      <InvoiceActions
        invoice={invoice}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </td>
  </tr>
);

// --- CONSTANTS (moved outside component for performance) ---

const TABLE_HEADERS = [
  "Client & Invoice #",
  "Work Name",
  "Work Code",
  "Invoice Date",
  { name: "Actions", screenReaderOnly: true },
];

// --- EXPORTED TABLE COMPONENT ---

export const InvoiceTable = ({ invoices = [], onView, onEdit, onDelete }) => {
  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {TABLE_HEADERS.map((header, index) => (
                    <th
                      key={typeof header === "string" ? header : header.name}
                      scope="col"
                      className={clsx(
                        "py-3.5 text-left text-sm font-semibold text-gray-900 select-none",
                        index === 0 ? "pl-6" : "px-3",
                        index === TABLE_HEADERS.length - 1 && "pr-6",
                        typeof header === "object" &&
                          header.screenReaderOnly &&
                          "sr-only" // Hide header visually but keep for accessibility
                      )}
                    >
                      {typeof header === "string" ? header : header.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {invoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={TABLE_HEADERS.length}
                      className="p-12 text-center text-gray-400"
                    >
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow
                      key={String(
                        invoice.id || invoice._id || invoice.invoiceNumber
                      )}
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
        </div>
      </div>
    </div>
  );
};
