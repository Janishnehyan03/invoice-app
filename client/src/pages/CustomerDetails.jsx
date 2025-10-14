import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { InvoiceDetailModal } from "../components/invoices/InvoiceDetailModal";
import { InvoiceTable } from "../components/invoices/InvoiceTable";

// --- Utility functions ---
const formatCurrency = (amount) =>
  typeof amount === "number" && !isNaN(amount)
    ? `₹${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "₹0.00";
const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "--";

// --- Helper Components ---

const StatCard = ({ label, value, subtext }) => (
  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col items-center shadow-sm">
    <dt className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
      {label}
    </dt>
    <dd className="mt-2 text-xl font-bold text-gray-900">{value}</dd>
    {subtext && <span className="text-xs text-gray-500 mt-1">{subtext}</span>}
  </div>
);

const DetailItem = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <Icon
      className="h-5 w-5 mt-1 text-gray-400 flex-shrink-0"
      aria-hidden="true"
    />
    <div className="flex flex-col">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  </div>
);

const ClientHeader = ({ client, stats }) => {
  const getInitial = (name) => (name ? name.trim()[0].toUpperCase() : "?");
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0 h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-4xl border-2 border-white shadow-sm">
            {getInitial(client.name)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Client since {formatDate(client.createdAt)}
            </p>
          </div>
        </div>
        {stats && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 sm:mt-0">
            <StatCard label="Total Invoices" value={stats.totalInvoices} />
            <StatCard
              label="Total Billed"
              value={formatCurrency(stats.totalBilled)}
            />
            <StatCard
              label="First Invoice"
              value={formatDate(stats.firstInvoiceDate)}
            />
            <StatCard
              label="Last Invoice"
              value={formatDate(stats.lastInvoiceDate)}
            />
          </dl>
        )}
      </div>
      <div className="border-t border-gray-200 mt-6 pt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          <DetailItem icon={EnvelopeIcon} label="Email">
            {client.email ? (
              <a
                href={`mailto:${client.email}`}
                className="text-indigo-600 hover:underline"
              >
                {client.email}
              </a>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </DetailItem>
          <DetailItem icon={PhoneIcon} label="Phone">
            {client.phone ? (
              <a
                href={`tel:${client.phone}`}
                className="text-indigo-600 hover:underline"
              >
                {client.phone}
              </a>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </DetailItem>
          <DetailItem icon={MapPinIcon} label="Address">
            <span className="whitespace-pre-wrap">
              {client.address || <span className="text-gray-400">—</span>}
            </span>
          </DetailItem>
        </dl>
      </div>
      {stats && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard label="Subtotal" value={formatCurrency(stats.subtotal)} />
          <StatCard
            label="Total SGST"
            value={formatCurrency(stats.totalSGST)}
          />
          <StatCard
            label="Total CGST"
            value={formatCurrency(stats.totalCGST)}
          />
          <StatCard
            label="Average Invoice Value"
            value={formatCurrency(stats.averageInvoiceValue)}
          />
          <StatCard label="Total Items Purchased" value={stats.totalQty} />
          {stats.mostFrequentItem && (
            <StatCard
              label="Most Purchased Item"
              value={
                stats.mostFrequentItem?.name ||
                stats.mostFrequentItem?._id ||
                "—"
              }
              subtext={
                typeof stats.mostFrequentItem?.price === "number"
                  ? formatCurrency(stats.mostFrequentItem.price)
                  : undefined
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

// --- Main Page ---

function ClientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const response = await Axios.get(`/clients/${id}`);
        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load client details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClientDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-bold text-lg">An Error Occurred</h3>
        <p>{error}</p>
      </div>
    );
  if (!data || !data.client)
    return (
      <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-bold text-lg">No client data found.</h3>
      </div>
    );

  const { client, clientInvoices, clientStatistics } = data;

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };
  const handleEditInvoice = (invoice) =>
    navigate(`/invoices/${invoice._id}/edit`);
  const handleDeleteInvoice = (invoice) =>
    alert(`Deleting invoice ${invoice.invoiceNumber}`);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <InvoiceDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        invoice={selectedInvoice}
      />
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/customers")}
          className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-indigo-600"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to all clients
        </button>

        <ClientHeader client={client} stats={clientStatistics} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Invoice History
          </h2>
          {clientInvoices && clientInvoices.length > 0 ? (
            <InvoiceTable
              invoices={clientInvoices}
              onView={handleViewInvoice}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
            />
          ) : (
            <p className="text-gray-500">No invoices found for this client.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientDetailsPage;
