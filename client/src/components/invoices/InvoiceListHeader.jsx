import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const InvoiceListHeader = ({
  onNewInvoice,
  searchTerm,
  onSearchChange,
}) => (
  <section className="mb-12">
    {/* Top Bar */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
            Invoices
          </span>
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 max-w-md">
          Easily manage, search, and create invoices with real-time updates.
        </p>
      </div>

      <Button
        onClick={onNewInvoice}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
        <span>New Invoice</span>
      </Button>
    </div>

    {/* Search Bar */}
    <div className="mt-8">
      <div className="relative max-w-md">
        <MagnifyingGlassIcon
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <Input
          id="search"
          type="search"
          placeholder="Search by invoice #, client, or project"
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10 pr-3 py-2 w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
        />
      </div>
    </div>
  </section>
);
