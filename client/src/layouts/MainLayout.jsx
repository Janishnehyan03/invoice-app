// src/layouts/MainLayout.jsx
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
