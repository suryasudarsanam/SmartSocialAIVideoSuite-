import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Video, User, LogOut, Upload, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, username, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Video className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CrossPost AI
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('/pricing')}
              className={`text-gray-600 hover:text-blue-600 transition-colors font-medium ${
                isActive('/pricing') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Pricing
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleNavigation('/upload')}
                  className={`flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium ${
                    isActive('/upload') ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </button>
                
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className={`flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium ${
                    isActive('/dashboard') ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{username || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('/auth')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;