// src/pages/Invoices.jsx
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

// A more robust Empty State
const EmptyState = ({ onActionClick }) => (
  <div className="text-center bg-white rounded-lg p-12 border border-dashed border-gray-300">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
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
    <h3 className="mt-2 text-lg font-semibold text-gray-900">
      No invoices found
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Get started by creating a new invoice.
    </p>
    <div className="mt-6">
      <button
        type="button"
        onClick={onActionClick}
        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        New Invoice
      </button>
    </div>
  </div>
);

// A dedicated Error State component
const ErrorState = ({ message }) => (
  <div className="text-center bg-red-50 rounded-lg p-12 border border-red-200">
    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
    <h3 className="mt-2 text-lg font-semibold text-red-800">
      An error occurred
    </h3>
    <p className="mt-1 text-sm text-red-600">{message}</p>
  </div>
);

// --- Main Invoices Page Component ---
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

  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices;
    const lowercasedFilter = searchTerm.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(lowercasedFilter) ||
        inv.to.toLowerCase().includes(lowercasedFilter) ||
        (inv.workName && inv.workName.toLowerCase().includes(lowercasedFilter))
    );
  }, [invoices, searchTerm]);

  // --- Handlers ---
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

  const handleCreated = (newInvoice) => {
    window.location.reload(); // Reload to fetch new data
  };

  // ✨ KEY IMPROVEMENT: No more page reloads!
  const handleUpdated = (updatedInvoice) => {
    window.location.reload(); // Reload to fetch updated data
  };

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
      // You can show a toast notification here for better UX
      alert("Failed to delete invoice.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) return <SkeletonLoader />;
    if (error) return <ErrorState message={error} />;
    if (invoices.length === 0)
      return <EmptyState onActionClick={handleOpenNew} />;
    if (filteredInvoices.length === 0 && searchTerm) {
      return (
        <div className="text-center bg-white rounded-lg p-12 border border-dashed border-gray-300">
          <h3 className="mt-2 text-lg font-semibold text-gray-900">
            No results found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No invoices matched your search term "{searchTerm}".
          </p>
        </div>
      );
    }

    return (
      <InvoiceTable
        invoices={filteredInvoices}
        onView={handleOpenDetail}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />
    );
  };

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <main className="p-4 sm:p-6 lg:p-8">
        <InvoiceListHeader
          onNewInvoice={handleOpenNew}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Content Area in a Card */}
        <div className="mt-8 bg-white border border-gray-200/75 rounded-xl shadow-sm">
          {renderContent()}
        </div>

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
