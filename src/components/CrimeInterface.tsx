import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Target, Shield, DollarSign, Clock, Skull } from 'lucide-react';
import { Character } from '../types/GameTypes';
import { crimeTypes, CrimeType } from '../data/crimeData';
import { CrimeResult } from '../engine/CrimeSystem';

interface CrimeInterfaceProps {
  character: Character;
  onCommitCrime: (crimeId: string) => CrimeResult;
  onBack: () => void;
}

export const CrimeInterface: React.FC<CrimeInterfaceProps> = ({
  character,
  onCommitCrime,
  onBack
}) => {
  const [selectedCrime, setSelectedCrime] = useState<CrimeType | null>(null);
  const [result, setResult] = useState<CrimeResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCrimeSelect = (crime: CrimeType) => {
    setSelectedCrime(crime);
    setResult(null);
    setShowConfirm(false);
  };

  const handleCommitCrime = () => {
    if (!selectedCrime) return;
    
    const crimeResult = onCommitCrime(selectedCrime.id);
    setResult(crimeResult);
    setShowConfirm(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Theft': 'blue',
      'Burglary': 'purple',
      'Violence': 'red',
      'Murder': 'red',
      'Cybercrime': 'green',
      'Drugs': 'yellow',
      'Robbery': 'orange'
    };
    return colors[category] || 'gray';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 3) return 'Easy';
    if (difficulty <= 6) return 'Medium';
    if (difficulty <= 8) return 'Hard';
    return 'Extreme';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-green-400';
    if (difficulty <= 6) return 'text-yellow-400';
    if (difficulty <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Criminal Activities</h1>
                <p className="text-red-300">Engage in illegal activities at your own risk</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-white/60">Criminal Record</p>
            <p className="text-red-400 font-bold">
              {character.criminalRecord.crimes.length} crimes committed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crime Selection */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-red-500/20">
              <h2 className="text-xl font-bold text-white mb-6">Available Crimes</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crimeTypes.map((crime) => (
                  <div
                    key={crime.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedCrime?.id === crime.id
                        ? 'bg-red-500/20 border-red-400'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => handleCrimeSelect(crime)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white">{crime.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(crime.category)} bg-${getCategoryColor(crime.category)}-500/20 text-${getCategoryColor(crime.category)}-300`}>
                        {crime.category}
                      </span>
                    </div>
                    
                    <p className="text-white/70 text-sm mb-3">{crime.description}</p>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/60">Difficulty:</span>
                        <span className={getDifficultyColor(crime.difficulty)}>
                          {getDifficultyText(crime.difficulty)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Success Rate:</span>
                        <span className="text-white">{crime.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Potential Earnings:</span>
                        <span className="text-green-400">
                          ${crime.moneyRange[0].toLocaleString()} - ${crime.moneyRange[1].toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Sentence:</span>
                        <span className="text-red-400">
                          {crime.minSentence}-{crime.maxSentence} years
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Crime Details & Actions */}
          <div className="space-y-6">
            {selectedCrime && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-red-500/20">
                <h3 className="text-xl font-bold text-white mb-4">{selectedCrime.name}</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-white/80">Difficulty:</span>
                    <span className={getDifficultyColor(selectedCrime.difficulty)}>
                      {getDifficultyText(selectedCrime.difficulty)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Success Rate:</span>
                    <span className="text-white">{selectedCrime.successRate}%</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Earnings:</span>
                    <span className="text-green-400">
                      ${selectedCrime.moneyRange[0].toLocaleString()} - ${selectedCrime.moneyRange[1].toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span className="text-white/80">Prison Time:</span>
                    <span className="text-red-400">
                      {selectedCrime.minSentence}-{selectedCrime.maxSentence} years
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-2">Risk Factors:</h4>
                  <div className="space-y-1">
                    {selectedCrime.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                        <span className="text-white/70 text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Skull className="w-5 h-5" />
                    Commit Crime
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4">
                      <p className="text-red-300 text-sm font-medium">
                        ⚠️ Are you sure you want to commit this crime? This action cannot be undone and may result in imprisonment.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCommitCrime}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {result && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Crime Result</h3>
                
                <div className={`p-4 rounded-lg mb-4 ${
                  result.success && !result.caught ? 'bg-green-500/20 border border-green-500/40' :
                  result.caught ? 'bg-red-500/20 border border-red-500/40' :
                  'bg-yellow-500/20 border border-yellow-500/40'
                }`}>
                  <p className="text-white font-medium">{result.message}</p>
                </div>

                {result.moneyGained && result.moneyGained > 0 && (
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Earned: ${result.moneyGained.toLocaleString()}</span>
                  </div>
                )}

                {result.sentence && result.sentence > 0 && (
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Sentence: {Math.floor(result.sentence / 12)} years, {result.sentence % 12} months</span>
                  </div>
                )}

                <button
                  onClick={() => setResult(null)}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors mt-4"
                >
                  Close
                </button>
              </div>
            )}

            {/* Criminal Record Summary */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Criminal Record</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Total Crimes:</span>
                  <span className="text-white">{character.criminalRecord.crimes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Times Caught:</span>
                  <span className="text-red-400">
                    {character.criminalRecord.crimes.filter(c => c.caught).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Prison Time:</span>
                  <span className="text-red-400">
                    {Math.floor(character.criminalRecord.totalSentence / 12)} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Imprisonments:</span>
                  <span className="text-red-400">{character.criminalRecord.imprisonments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};