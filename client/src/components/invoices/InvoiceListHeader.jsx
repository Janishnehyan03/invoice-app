import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const InvoiceListHeader = ({
  onNewInvoice,
  searchTerm,
  onSearchChange,
}) => (
  <section className="mb-10">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">
            Invoices
          </span>
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 max-w-md leading-relaxed">
          Manage, search, and create invoices easily — all in one place.
        </p>
      </div>

      <Button
        onClick={onNewInvoice}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white 
          bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 
          hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-800 
          shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Create Invoice</span>
      </Button>
    </div>

    {/* Search Bar */}
    <div className="mt-8">
      <div className="relative max-w-md">
        <MagnifyingGlassIcon
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 transition-all duration-200 group-hover:text-indigo-500"
        />
        <Input
          id="search"
          type="search"
          placeholder="Search invoices by number, client, or project..."
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10 pr-3 py-2 w-full rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm 
            text-gray-700 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 
            focus:ring-indigo-100 hover:border-gray-300 transition-all duration-200"
        />
      </div>
    </div>

    {/* Decorative Divider */}
    <div className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
  </section>
);
