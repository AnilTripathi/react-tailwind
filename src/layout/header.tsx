import { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { name: 'Home', to: '/home' },
  { name: 'Users', to: '/users' },
  { name: 'ToDos', to: '/mytodo' },
];

/**
 * Header component with profile dropdown menu
 * - Profile image click toggles dropdown menu
 * - Logout action moved to dropdown for better UX
 * - Keyboard accessible (Enter/Space to toggle, Esc to close)
 * - Click-outside to close functionality
 */
const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
  };

  const handleMenuItemClick = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDropdown();
    }
  };

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
              const isActive = location.pathname === link.to;
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
          {isAuthenticated && (
            <>
              {/* Notification bell */}
              <button className="text-gray-400 hover:text-gray-500 focus:outline-none">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  ref={profileButtonRef}
                  onClick={toggleDropdown}
                  onKeyDown={handleKeyDown}
                  className="h-9 w-9 rounded-full object-cover border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="menu"
                  aria-label="Profile menu"
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="User avatar"
                    className="h-full w-full rounded-full object-cover"
                  />
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl ring-1 ring-gray-200 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-200"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="py-2">
                      {/* Profile */}
                      <button
                        onClick={() => handleMenuItemClick('/profile')}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        role="menuitem"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium">Profile</span>
                      </button>

                      {/* Settings */}
                      <button
                        onClick={() => handleMenuItemClick('/settings')}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        role="menuitem"
                      >
                        <svg
                          className="w-5 h-5 mr-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="font-medium">Settings</span>
                      </button>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-2"></div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        role="menuitem"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin w-5 h-5 mr-3 text-red-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span className="font-medium">Logging out...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 mr-3 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span className="font-medium">Logout</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
