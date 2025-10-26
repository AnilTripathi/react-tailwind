const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MyDemoApp. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;