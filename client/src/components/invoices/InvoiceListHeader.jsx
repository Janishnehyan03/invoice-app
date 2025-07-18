import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const InvoiceListHeader = ({
  onNewInvoice,
  searchTerm,
  onSearchChange,
}) => (
  <section className="mb-10">
    {/* Top Bar */}
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900">
          <span className=" drop-shadow">
            Invoices
          </span>
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-xl">
          Review, search, and manage all invoices in your account.
        </p>
      </div>
      <div>
        <Button
          onClick={onNewInvoice}
          className="flex items-center gap-2 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          New Invoice
        </Button>
      </div>
    </div>

    {/* Search Bar */}
    <div className="mt-8">
      <div className="relative rounded-lg shadow-sm bg-white max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </span>
        <Input
          id="search"
          type="search"
          placeholder="Search invoices by #, client, or project…"
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10 py-2 text-base rounded-lg bg-white border border-blue-100 focus:border-indigo-400 focus:ring-indigo-100"
        />
      </div>
    </div>
  </section>
);