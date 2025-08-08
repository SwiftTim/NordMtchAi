import React, { useState } from 'react';
import { Calendar, MapPin, Brain, Star, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Match, Prediction } from '../../types';
import { apiService } from '../../services/api';
import { PredictionModal } from './PredictionModal';
import toast from 'react-hot-toast';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      // First check if prediction already exists
      const existingPrediction = await apiService.getPredictionByMatchId(match.id);
      if (existingPrediction) {
        setPrediction(existingPrediction);
      } else {
        const newPrediction = await apiService.generatePrediction(match.id);
        setPrediction(newPrediction);
        toast.success('Prediction generated successfully!');
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error generating prediction:', error);
      toast.error('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, HH:mm');
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="font-medium">{match.country?.flag_emoji}</span>
            <span>{match.league}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatDate(match.match_date)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="text-lg font-semibold text-gray-900 mb-1">
              {match.home_team?.name}
            </div>
            <div className="text-sm text-gray-600">Home</div>
          </div>
          
          <div className="mx-8 text-center">
            <div className="text-2xl font-bold text-gray-400">VS</div>
          </div>
          
          <div className="text-center flex-1">
            <div className="text-lg font-semibold text-gray-900 mb-1">
              {match.away_team?.name}
            </div>
            <div className="text-sm text-gray-600">Away</div>
          </div>
        </div>

        {match.venue && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <MapPin className="h-4 w-4" />
            <span>{match.venue}</span>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handlePredict}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>{loading ? 'Generating...' : 'AI Predict'}</span>
          </button>
          
          <button
            className="px-4 py-2 text-gray-600 hover:text-orange-600 transition-colors"
            title="Add to watchlist"
          >
            <Star className="h-5 w-5" />
          </button>
        </div>
      </div>

      {prediction && (
        <PredictionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          prediction={prediction}
        />
      )}
    </>
  );
}