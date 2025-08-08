import React, { useState, useEffect } from 'react';
import { Star, Bell, Calendar, MapPin, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { WatchlistItem } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export function WatchlistPage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWatchlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadWatchlist = async () => {
    try {
      const data = await apiService.getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (matchId: string) => {
    try {
      await apiService.removeFromWatchlist(matchId);
      setWatchlist(prev => prev.filter(item => item.match_id !== matchId));
      toast.success('Removed from watchlist');
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your watchlist</h2>
          <p className="text-gray-600">Keep track of your favorite matches and get personalized alerts.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Watchlist</h1>
        <p className="text-gray-600">
          Stay updated on your favorite matches with personalized alerts and insights.
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your watchlist is empty</h2>
          <p className="text-gray-600 mb-4">
            Add matches to your watchlist to get notifications about predictions and updates.
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <span>Browse Matches</span>
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {watchlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">{item.match?.country?.flag_emoji}</span>
                  <span>{item.match?.league}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Alert settings"
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFromWatchlist(item.match_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {item.match?.home_team?.name}
                  </div>
                  <div className="text-sm text-gray-600">Home</div>
                </div>
                
                <div className="mx-8 text-center">
                  <div className="text-2xl font-bold text-gray-400">VS</div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {item.match?.away_team?.name}
                  </div>
                  <div className="text-sm text-gray-600">Away</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(item.match?.match_date || ''), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  {item.match?.venue && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{item.match.venue}</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Added {format(new Date(item.created_at), 'MMM dd')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}