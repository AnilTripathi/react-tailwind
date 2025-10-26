import logo from '../assets/logo.png';

import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Dashboard', to: '/' },
  { name: 'User List', to: '/users' },
  {name: 'My ToDo', to: '/mytodo' },
  { name: 'Projects', to: '/projects' },
  { name: 'About', to: '/about' },
];

const Header = () => {
  const location = useLocation();
  return (
  <header className="bg-white rounded-t-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-18" />
        </div>
        {/* Navigation */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-8">
            {navLinks.map((link) => {
              const isActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={
                      'relative text-lg font-medium px-1 transition-colors duration-150 ' +
                      (isActive
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-900')
                    }
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute left-0 -bottom-1 w-full h-1 bg-indigo-500 rounded-t-md" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Actions */}
        <div className="flex items-center space-x-6">
          {/* Notification bell */}
          <button className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          {/* Avatar */}
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User avatar"
            className="h-9 w-9 rounded-full object-cover border border-gray-300"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;