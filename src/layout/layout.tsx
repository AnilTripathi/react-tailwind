import React from 'react';
import Header from './header';
import Footer from './footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto py-6 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;