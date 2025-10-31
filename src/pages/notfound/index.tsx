const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-7xl font-extrabold text-indigo-500 mb-4">404</div>
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Page Not Found</h1>
      <p className="text-gray-500 mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition-colors"
      >
        Go to Home
      </a>
    </div>
  );
};

export default NotFound;
