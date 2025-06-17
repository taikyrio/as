import React, { useState } from 'react';
import { X, Clock, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface Decision {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  timeLimit?: number;
  category: 'life' | 'career' | 'relationship' | 'health' | 'education';
}

interface DecisionOption {
  id: string;
  text: string;
  description: string;
  consequences: {
    immediate: string;
    longTerm: string;
  };
  statChanges: {
    health?: number;
    intelligence?: number;
    looks?: number;
    happiness?: number;
  };
  moneyChange?: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface DecisionModalProps {
  decision: Decision;
  onChoose: (optionId: string) => void;
  onClose: () => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  decision,
  onChoose,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showConsequences, setShowConsequences] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      life: 'from-purple-500 to-pink-500',
      career: 'from-blue-500 to-cyan-500',
      relationship: 'from-red-500 to-pink-500',
      health: 'from-green-500 to-emerald-500',
      education: 'from-yellow-500 to-orange-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'text-green-400 bg-green-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      high: 'text-red-400 bg-red-500/20'
    };
    return colors[risk as keyof typeof colors] || 'text-gray-400 bg-gray-500/20';
  };

  const selectedOptionData = decision.options.find(opt => opt.id === selectedOption);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getCategoryColor(decision.category)} p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{decision.title}</h2>
              <p className="text-white/90 mt-1 capitalize">{decision.category} Decision</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          {decision.timeLimit && (
            <div className="flex items-center gap-2 mt-4 text-white/90">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Time to decide: {decision.timeLimit} seconds</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-white/80 text-lg mb-6">{decision.description}</p>

          {/* Options */}
          <div className="space-y-4 mb-6">
            {decision.options.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedOption === option.id
                    ? 'bg-white/20 border-white/40 shadow-lg'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white text-lg">{option.text}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(option.riskLevel)}`}>
                    {option.riskLevel} risk
                  </span>
                </div>
                <p className="text-white/70 mb-3">{option.description}</p>
                
                {/* Stat Changes Preview */}
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(option.statChanges).map(([stat, value]) => (
                    <span
                      key={stat}
                      className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                        (value || 0) > 0 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {(value || 0) > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat} {(value || 0) > 0 ? '+' : ''}{value}
                    </span>
                  ))}
                  {option.moneyChange && (
                    <span
                      className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                        option.moneyChange > 0 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {option.moneyChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      ${Math.abs(option.moneyChange).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Consequences Preview */}
          {selectedOptionData && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <h4 className="font-semibold text-white">Potential Consequences</h4>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-white/60 text-sm">Immediate: </span>
                  <span className="text-white">{selectedOptionData.consequences.immediate}</span>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Long-term: </span>
                  <span className="text-white">{selectedOptionData.consequences.longTerm}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              Think More
            </button>
            <button
              onClick={() => selectedOption && onChoose(selectedOption)}
              disabled={!selectedOption}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              Make Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};