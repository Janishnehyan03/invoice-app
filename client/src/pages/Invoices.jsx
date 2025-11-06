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

/* ---------------- Empty State ---------------- */
const EmptyState = ({ onActionClick }) => (
  <div className="flex flex-col items-center justify-center text-center bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
    <div className="p-4 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 mb-4">
      <svg
        className="h-12 w-12 text-indigo-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>

    <h3 className="text-xl font-semibold text-gray-900">No Invoices Found</h3>
    <p className="mt-2 text-gray-500 text-sm max-w-sm">
      It looks like you haven’t created any invoices yet. Start by creating one below.
    </p>

    <button
      onClick={onActionClick}
      className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
    >
      <PlusIcon className="w-5 h-5" />
      Create Invoice
    </button>
  </div>
);

/* ---------------- Error State ---------------- */
const ErrorState = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center bg-red-50 border border-red-200 rounded-2xl p-12 shadow-sm">
    <div className="p-4 bg-red-100 rounded-full mb-4">
      <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-red-800">Something Went Wrong</h3>
    <p className="text-sm text-red-600 mt-1">{message}</p>
  </div>
);

/* ---------------- Main Component ---------------- */
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
      } catch {
        setError("Failed to load invoices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices;
    const lower = searchTerm.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber?.toLowerCase().includes(lower) ||
        inv.client?.name?.toLowerCase().includes(lower) ||
        inv.workName?.toLowerCase().includes(lower)
    );
  }, [invoices, searchTerm]);

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

  const handleConfirmDelete = async () => {
    if (!selectedInvoice) return;
    setIsDeleting(true);
    try {
      await Axios.delete(`/invoices/${selectedInvoice._id}`);
      setInvoices((prev) => prev.filter((inv) => inv._id !== selectedInvoice._id));
      setIsDeleteConfirmOpen(false);
    } catch {
      alert("Failed to delete invoice.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) return <SkeletonLoader />;
    if (error) return <ErrorState message={error} />;
    if (invoices.length === 0) return <EmptyState onActionClick={handleOpenNew} />;
    if (filteredInvoices.length === 0 && searchTerm)
      return (
        <div className="bg-white/90 border border-dashed border-gray-300 rounded-2xl p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">No Results Found</h3>
          <p className="text-sm text-gray-500 mt-1">
            No invoices matched your search for "{searchTerm}".
          </p>
        </div>
      );

    return (
      <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <main className="p-6 sm:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <InvoiceListHeader
          onNewInvoice={handleOpenNew}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Content */}
        <div className="mt-8">{renderContent()}</div>

        {/* Modals */}
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={selectedInvoice ? "Edit Invoice" : "Create New Invoice"}
        >
          <InvoiceForm
            onClose={() => setIsFormOpen(false)}
            onCreated={() => window.location.reload()}
            onUpdated={() => window.location.reload()}
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
