import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import type { Country, Match } from '../../types';
import { apiService } from '../../services/api';
import { CountrySelector } from '../Predictions/CountrySelector';
import { MatchCard } from '../Predictions/MatchCard';

export function HomePage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    loadMatches();
  }, [selectedCountry]);

  const loadCountries = async () => {
    try {
      const data = await apiService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUpcomingMatches(selectedCountry?.id);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((match) =>
    !searchTerm ||
    match.home_team?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.away_team?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI-Powered Football Predictions
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Get expert insights for Nordic & Dutch leagues backed by local sports coverage
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-sm opacity-80">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">5+</div>
              <div className="text-sm opacity-80">Countries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-80">Trusted Sources</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Country Selector */}
        <CountrySelector
          countries={countries}
          selectedCountry={selectedCountry}
          onCountrySelect={setSelectedCountry}
        />

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search teams or leagues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading matches...</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Upcoming Matches
                {selectedCountry && (
                  <span className="ml-2 text-lg font-medium text-gray-600">
                    in {selectedCountry.flag_emoji} {selectedCountry.name}
                  </span>
                )}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>{filteredMatches.length} matches found</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚽</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No matches found
            </h2>
            <p className="text-gray-600">
              {selectedCountry
                ? `No upcoming matches in ${selectedCountry.name} match your search.`
                : 'No matches found. Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}