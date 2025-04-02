import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate(); // Navigation hook
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulate login status
  const [activeCategory, setActiveCategory] = useState(null);

  // Define categories
  const categories = [
    { id: 1, name: 'Home', path: '/' },
    { id: 2, name: 'About', path: '/about' },
    { id: 3, name: 'Contact', path: '/contact' },
    { id: 4, name: 'Profile', path: '/profile' },
  ];

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false); // Simulate logout
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="relative bg-gradient-to-r from-blue-900 to-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-800">
              jobsea
            </span>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={category.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-all ${
                    activeCategory === category.id
                      ? 'bg-blue-700 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right Section - Profile & Authentication Buttons */}
          <div className="hidden md:flex md:items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-white mr-4">
              <Bell size={20} />
            </button>

            {isAuthenticated ? (
              <>
                {/* Profile Button (Visible when logged in) */}
                <button
                  onClick={() => navigate('/profile')}
                  className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg mr-4"
                >
                  <User size={18} className="text-white" />
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              /* Login Button */
              <button
                onClick={() => navigate('/login')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-800"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute z-10 w-full bg-gray-900 shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-lg ${
                  activeCategory === category.id
                    ? 'bg-purple-700 text-white'
                    : 'text-gray-300 hover:bg-purple-800 hover:text-white'
                }`}
              >
                {category.name}
              </Link>
            ))}

            {/* Conditional Login/Logout for Mobile View */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="block w-full text-left px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
