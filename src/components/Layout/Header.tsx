import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Settings, LogOut, Brain } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await apiService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                NordMatchAI
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Powered by AI</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Predictions
            </Link>
            <Link
              to="/watchlist"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Watchlist
            </Link>
            <Link
              to="/insights"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Insights
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-1 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {user.email}
                    </span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}