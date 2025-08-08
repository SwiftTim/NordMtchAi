import React from 'react';
import type { Country } from '../../types';

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: Country | null;
  onCountrySelect: (country: Country | null) => void;
}

export function CountrySelector({ countries, selectedCountry, onCountrySelect }: CountrySelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Country</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onCountrySelect(null)}
          className={`p-3 rounded-lg text-center transition-all ${
            !selectedCountry
              ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="text-2xl mb-1">🌍</div>
          <div className="text-sm font-medium">All</div>
        </button>
        
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => onCountrySelect(country)}
            className={`p-3 rounded-lg text-center transition-all ${
              selectedCountry?.id === country.id
                ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="text-2xl mb-1">{country.flag_emoji}</div>
            <div className="text-sm font-medium">{country.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}