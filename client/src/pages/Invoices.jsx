import { ExclamationTriangleIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useEffect, useMemo, useState } from "react";
import { DeleteConfirmationModal } from "../components/invoices/DeleteConfirmationModal";
import { InvoiceDetailModal } from "../components/invoices/InvoiceDetailModal";
import { InvoiceForm } from "../components/invoices/InvoiceForm";
import { InvoiceListHeader } from "../components/invoices/InvoiceListHeader.jsx";
import { InvoiceTable } from "../components/invoices/InvoiceTable.jsx";
import { SkeletonLoader } from "../components/invoices/SkeletonLoader";
import { Modal } from "../components/ui/Modal";
import Axios from "../utils/Axios";

// --- Empty State ---
const EmptyState = ({ onActionClick }) => (
  <div className="flex flex-col items-center justify-center text-center bg-white rounded-2xl p-12 border border-dashed border-slate-300 shadow-sm hover:shadow-md transition-all duration-200">
    <svg
      className="h-14 w-14 text-slate-400 mb-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <h3 className="text-lg font-bold text-slate-800">No invoices found</h3>
    <p className="mt-1 text-slate-500">
      Create your first invoice to get started.
    </p>
    <button
      type="button"
      onClick={onActionClick}
      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors"
    >
      <PlusIcon className="h-5 w-5" aria-hidden="true" />
      New Invoice
    </button>
  </div>
);

// --- Error State ---
const ErrorState = ({ message }) => (
  <div className="text-center bg-red-50 rounded-xl p-10 border border-red-200 shadow-sm">
    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
    <h3 className="mt-3 text-lg font-bold text-red-800">An error occurred</h3>
    <p className="mt-1 text-sm text-red-600">{message}</p>
  </div>
);

// --- Main Invoices Page ---
export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Fetch Invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await Axios.get("/invoices");
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch invoices error:", err);
        setError("Failed to load invoices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices;
    const lower = searchTerm.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(lower) ||
        inv.client.name.toLowerCase().includes(lower) ||
        (inv.workName && inv.workName.toLowerCase().includes(lower))
    );
  }, [invoices, searchTerm]);

  // Handlers
  const handleOpenNew = () => {
    setSelectedInvoice(null);
    setIsFormOpen(true);
  };
  const handleOpenDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };
  const handleOpenEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };
  const handleOpenDelete = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteConfirmOpen(true);
  };

  const handleCreated = () => window.location.reload();
  const handleUpdated = () => window.location.reload();

  const handleConfirmDelete = async () => {
    if (!selectedInvoice) return;
    setIsDeleting(true);
    try {
      await Axios.delete(`/invoices/${selectedInvoice._id}`);
      setInvoices((prev) =>
        prev.filter((inv) => inv._id !== selectedInvoice._id)
      );
      setIsDeleteConfirmOpen(false);
      setSelectedInvoice(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete invoice.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Render main content
  const renderContent = () => {
    if (loading) return <SkeletonLoader />;
    if (error) return <ErrorState message={error} />;
    if (invoices.length === 0)
      return <EmptyState onActionClick={handleOpenNew} />;

    if (filteredInvoices.length === 0 && searchTerm)
      return (
        <div className="text-center bg-white rounded-2xl p-10 border border-dashed border-slate-300 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800">No results found</h3>
          <p className="mt-1 text-sm text-slate-500">
            No invoices matched your search for "{searchTerm}".
          </p>
        </div>
      );

    return (
      <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        <InvoiceTable
          invoices={filteredInvoices}
          onView={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-6 sm:p-8">
        {/* Search Header */}
        <InvoiceListHeader
          onNewInvoice={handleOpenNew}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Content Section */}
        <div className="mt-6">{renderContent()}</div>

        {/* Modals */}
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={selectedInvoice ? "Edit Invoice" : "Create New Invoice"}
        >
          <InvoiceForm
            onClose={() => setIsFormOpen(false)}
            onCreated={handleCreated}
            onUpdated={handleUpdated}
            invoiceToEdit={selectedInvoice}
          />
        </Modal>

        <InvoiceDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          invoice={selectedInvoice}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
          invoiceNumber={selectedInvoice?.invoiceNumber}
        />
      </main>
    </div>
  );
}
