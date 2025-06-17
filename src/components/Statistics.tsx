
import React from 'react';
import { X, TrendingUp, Clock, Heart, Brain, Eye, Smile, DollarSign, Award } from 'lucide-react';
import { Character } from '../types/GameTypes';

interface StatisticsProps {
  character: Character;
  onClose: () => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ character, onClose }) => {
  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-400 bg-green-500/20';
    if (value >= 60) return 'text-yellow-400 bg-yellow-500/20';
    if (value >= 40) return 'text-orange-400 bg-orange-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const StatBar = ({ value, max = 100 }: { value: number; max?: number }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Life Statistics</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Character Overview */}
        <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-3">{character.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-white/70">Age:</span>
              <span className="text-white ml-2 font-semibold">{character.age}</span>
            </div>
            <div>
              <span className="text-white/70">Country:</span>
              <span className="text-white ml-2 font-semibold">{character.country}</span>
            </div>
            <div>
              <span className="text-white/70">Money:</span>
              <span className="text-green-400 ml-2 font-semibold">${character.money.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-white/70">Career:</span>
              <span className="text-white ml-2 font-semibold">{character.career || 'Unemployed'}</span>
            </div>
          </div>
        </div>

        {/* Core Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Health', value: character.stats.health, icon: Heart, color: 'text-red-400' },
            { label: 'Intelligence', value: character.stats.intelligence, icon: Brain, color: 'text-blue-400' },
            { label: 'Looks', value: character.stats.looks, icon: Eye, color: 'text-purple-400' },
            { label: 'Happiness', value: character.stats.happiness, icon: Smile, color: 'text-yellow-400' }
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-white font-medium">{label}</span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-sm font-semibold ${getStatColor(value)}`}>
                  {value}%
                </span>
              </div>
              <StatBar value={value} />
            </div>
          ))}
        </div>

        {/* Life Events Summary */}
        <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Life Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{character.timeline?.length || 0}</div>
              <div className="text-sm text-white/70">Life Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{character.achievements?.length || 0}</div>
              <div className="text-sm text-white/70">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{character.education?.length || 0}</div>
              <div className="text-sm text-white/70">Education</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{character.relationships?.length || 0}</div>
              <div className="text-sm text-white/70">Relationships</div>
            </div>
          </div>
        </div>

        {/* Criminal Record */}
        {character.criminalRecord && character.criminalRecord.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-400 mb-3">Criminal Record</h3>
            <div className="space-y-2">
              {character.criminalRecord.slice(0, 5).map((crime, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-white/80">{crime.crime}</span>
                  <span className="text-red-400 text-sm">Age {crime.age}</span>
                </div>
              ))}
              {character.criminalRecord.length > 5 && (
                <div className="text-center text-white/60 text-sm">
                  ...and {character.criminalRecord.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Achievements */}
        {character.achievements && character.achievements.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recent Achievements
            </h3>
            <div className="space-y-2">
              {character.achievements.slice(-5).map((achievement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/80">{achievement.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
