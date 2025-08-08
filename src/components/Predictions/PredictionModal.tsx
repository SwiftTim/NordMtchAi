import React from 'react';
import { X, TrendingUp, Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { Prediction } from '../../types';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: Prediction;
}

export function PredictionModal({ isOpen, onClose, prediction }: PredictionModalProps) {
  if (!isOpen) return null;

  const probabilities = [
    { name: 'Home Win', value: prediction.home_win_prob, color: '#3B82F6' },
    { name: 'Draw', value: prediction.draw_prob, color: '#6B7280' },
    { name: 'Away Win', value: prediction.away_win_prob, color: '#10B981' }
  ];

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Match Prediction</h2>
            <p className="text-gray-600 text-sm">
              {prediction.match?.home_team?.name} vs {prediction.match?.away_team?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Main Prediction */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {(prediction.home_win_prob * 100).toFixed(1)}%
                </div>
                <div className="text-gray-600 font-medium">
                  {prediction.match?.home_team?.name} Win
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-500">
                  {(prediction.draw_prob * 100).toFixed(1)}%
                </div>
                <div className="text-gray-600 font-medium">Draw</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">
                  {(prediction.away_win_prob * 100).toFixed(1)}%
                </div>
                <div className="text-gray-600 font-medium">
                  {prediction.match?.away_team?.name} Win
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-lg">
                <Shield className={`h-5 w-5 ${getConfidenceColor(prediction.confidence_score)}`} />
                <span className="font-medium text-gray-700">
                  Confidence: {getConfidenceLabel(prediction.confidence_score)}
                </span>
                <span className={`font-bold ${getConfidenceColor(prediction.confidence_score)}`}>
                  ({(prediction.confidence_score * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Predicted Score */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Predicted Score</span>
            </h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {prediction.predicted_home_score} - {prediction.predicted_away_score}
              </div>
            </div>
          </div>

          {/* Probability Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Probability Distribution</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={probabilities}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {probabilities.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Importance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Factors</h3>
            <div className="space-y-3">
              {prediction.feature_importance.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 capitalize">
                      {feature.feature.replace('_', ' ')}
                    </span>
                    <span className={`font-bold ${feature.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {feature.impact >= 0 ? '+' : ''}{(feature.impact * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{feature.description}</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${feature.impact >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(feature.impact) * 500}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Snippets */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Evidence</h3>
            <div className="space-y-4">
              {prediction.evidence_snippets.map((snippet, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-600">{snippet.source}</span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(snippet.timestamp), 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{snippet.text}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Confidence:</span>
                    <div className="bg-gray-200 rounded-full h-1.5 w-16">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${snippet.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {(snippet.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h3>
            <p className="text-gray-700 leading-relaxed">{prediction.reasoning}</p>
            <div className="mt-4 text-sm text-gray-500">
              Model Version: {prediction.model_version} • Generated: {format(new Date(prediction.created_at), 'MMM dd, yyyy HH:mm')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}