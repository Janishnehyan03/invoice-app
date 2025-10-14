import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-700 text-white font-sans text-center p-8">
      <h1 className="text-8xl font-bold tracking-wider m-0">404</h1>
      <h2 className="text-3xl mt-4 mb-2 font-semibold">Page Not Found</h2>
      <p className="text-lg mb-8 opacity-80">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-white text-purple-700 rounded-full font-semibold shadow-md hover:bg-purple-100 transition-colors duration-200"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
