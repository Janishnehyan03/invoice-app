// src/components/invoices/StatusBadge.jsx
import clsx from 'clsx'; // A utility for constructing className strings conditionally. `npm install clsx`

export const StatusBadge = ({ status }) => {
  const statusLower = status.toLowerCase();

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        {
          'bg-green-100 text-green-800': statusLower === 'paid',
          'bg-yellow-100 text-yellow-800': statusLower === 'pending' || statusLower === 'due',
          'bg-red-100 text-red-800': statusLower === 'overdue',
          'bg-gray-100 text-gray-800': !['paid', 'pending', 'due', 'overdue'].includes(statusLower),
        }
      )}
    >
      {status}
    </span>
  );
};