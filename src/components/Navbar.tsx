import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, HelpCircle, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={user ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">S</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">SoloSales.OS</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="relative ml-3">
                  <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                    <Link to="/settings" className="text-gray-400 hover:text-gray-600 transition-colors" title="Settings">
                      <Settings className="h-5 w-5" />
                    </Link>
                    <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" title="Help & Docs">
                      <HelpCircle className="h-5 w-5" />
                    </a>
                    <button
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Log out"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Pricing
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Start for free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/pricing" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  Pricing
                </Link>
                <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  Log in
                </Link>
                <Link to="/signup" className="block px-4 py-2 text-base font-medium text-indigo-600 hover:bg-gray-50">
                  Start for free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
