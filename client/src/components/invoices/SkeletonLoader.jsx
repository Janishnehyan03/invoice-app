// src/components/invoices/SkeletonLoader.jsx

const SkeletonRow = () => (
  <tr>
    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-6">
      <div className="flex items-center">
        <div className="ml-4">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-20 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
      </div>
    </td>
    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-3 w-20 bg-gray-200 rounded mt-2 animate-pulse"></div>
    </td>
    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
    </td>
    <td className="whitespace-nowrap px-3 py-5 text-sm font-medium text-gray-900">
      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
    </td>
  </tr>
);

export const SkeletonLoader = () => (
  <div className="overflow-x-auto">
    <div className="inline-block min-w-full py-2 align-middle">
      <table className="min-w-full divide-y divide-gray-200">
        {/* You can copy the thead from InvoiceTable here for a more realistic skeleton */}
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Client / Invoice #
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Project / Date
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Amount
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </tbody>
      </table>
    </div>
  </div>
);
