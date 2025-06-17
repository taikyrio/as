import React, { useState } from 'react';
import { ArrowLeft, Globe, User } from 'lucide-react';
import { Country } from '../types/GameTypes';

interface CharacterCreationProps {
  countries: Country[];
  onCreateCharacter: (name: string, country: string) => void;
  onBack: () => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({
  countries,
  onCreateCharacter,
  onBack
}) => {
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('usa');
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep === 1 && name.trim()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      onCreateCharacter(name, selectedCountry);
    }
  };

  const selectedCountryData = countries.find(c => c.id === selectedCountry);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex gap-2">
              <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-purple-400' : 'bg-white/30'}`}></div>
              <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-purple-400' : 'bg-white/30'}`}></div>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="text-center">
              <div className="mb-8">
                <User className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Choose Your Name</h2>
                <p className="text-purple-200">What would you like to be called in this life?</p>
              </div>

              <div className="mb-8">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-6 py-4 text-xl bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  maxLength={30}
                />
                <p className="text-sm text-purple-300 mt-2">{name.length}/30 characters</p>
              </div>

              <button
                onClick={handleNext}
                disabled={!name.trim()}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                Next Step
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="text-center mb-8">
                <Globe className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Choose Your Birthplace</h2>
                <p className="text-purple-200">Where do you want to start your life?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-96 overflow-y-auto">
                {countries.map((country) => (
                  <div
                    key={country.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                      selectedCountry === country.id
                        ? 'bg-purple-500/30 border-purple-400 text-white'
                        : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedCountry(country.id)}
                  >
                    <h3 className="font-bold text-lg mb-2">{country.name}</h3>
                    <div className="text-sm space-y-1">
                      <p>Currency: {country.currency}</p>
                      <p>Avg. Salary: {country.currency} {country.jobMarket.averageSalary.toLocaleString()}</p>
                      <p>Healthcare: {country.healthcare.publicSystem ? 'Public' : 'Private'}</p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedCountryData && (
                <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">{selectedCountryData.name} Overview</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-purple-300">Education Quality:</p>
                      <p className="text-white">{selectedCountryData.educationSystem.quality}/100</p>
                    </div>
                    <div>
                      <p className="text-purple-300">Healthcare Quality:</p>
                      <p className="text-white">{selectedCountryData.healthcare.quality}/100</p>
                    </div>
                    <div>
                      <p className="text-purple-300">Unemployment Rate:</p>
                      <p className="text-white">{selectedCountryData.jobMarket.unemploymentRate}%</p>
                    </div>
                    <div>
                      <p className="text-purple-300">Crime Rate:</p>
                      <p className="text-white">{selectedCountryData.crimeRate.toFixed(1)}/100</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  Start Life
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};