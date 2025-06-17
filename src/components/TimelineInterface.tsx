import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Heart,
  Brain,
  DollarSign,
  Users,
  Award
} from 'lucide-react';
import { Character, LifeEvent } from '../types/GameTypes';

interface TimelineInterfaceProps {
  character: Character;
  currentYear: number;
  onAgeUp: () => void;
  onViewEvent: (event: LifeEvent) => void;
}

export const TimelineInterface: React.FC<TimelineInterfaceProps> = ({
  character,
  currentYear,
  onAgeUp,
  onViewEvent
}) => {
  const [selectedYear, setSelectedYear] = useState(character.age);
  const [viewMode, setViewMode] = useState<'timeline' | 'stats'>('timeline');

  const getEventsForYear = (year: number) => {
    return character.lifeEvents.filter(event => event.year === year);
  };

  const getAgeStage = (age: number) => {
    if (age <= 5) return { stage: 'Early Childhood', color: 'bg-pink-500', icon: '👶' };
    if (age <= 12) return { stage: 'Childhood', color: 'bg-blue-500', icon: '🧒' };
    if (age <= 17) return { stage: 'Adolescence', color: 'bg-purple-500', icon: '👦' };
    if (age <= 25) return { stage: 'Young Adult', color: 'bg-green-500', icon: '👨' };
    if (age <= 40) return { stage: 'Adult', color: 'bg-orange-500', icon: '👨‍💼' };
    if (age <= 65) return { stage: 'Middle Age', color: 'bg-yellow-500', icon: '👨‍🦳' };
    return { stage: 'Elder', color: 'bg-gray-500', icon: '👴' };
  };

  const currentStage = getAgeStage(character.age);
  const yearEvents = getEventsForYear(selectedYear);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{currentStage.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-white">{character.name}</h1>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Age {character.age}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentYear}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${currentStage.color} text-white`}>
                    {currentStage.stage}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onAgeUp}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <Clock className="w-5 h-5" />
              Age Up
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* View Toggle */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-6 backdrop-blur-md">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              viewMode === 'timeline' 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              viewMode === 'stats' 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Life Stats
          </button>
        </div>

        {viewMode === 'timeline' ? (
          <div className="space-y-6">
            {/* Year Navigator */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Life Timeline</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedYear(Math.max(0, selectedYear - 1))}
                    disabled={selectedYear <= 0}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <span className="text-white font-semibold px-4">
                    Age {selectedYear}
                  </span>
                  <button
                    onClick={() => setSelectedYear(Math.min(character.age, selectedYear + 1))}
                    disabled={selectedYear >= character.age}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Timeline Slider */}
              <div className="relative mb-6">
                <input
                  type="range"
                  min="0"
                  max={character.age}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-white/60 mt-2">
                  <span>Birth</span>
                  <span>Age {character.age}</span>
                </div>
              </div>

              {/* Events for Selected Year */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Events at Age {selectedYear}
                </h3>
                {yearEvents.length > 0 ? (
                  yearEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onViewEvent(event)}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                          <p className="text-white/80 text-sm">{event.description}</p>
                          {event.impact && Object.keys(event.impact).length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {Object.entries(event.impact).map(([stat, value]) => (
                                <span
                                  key={stat}
                                  className={`text-xs px-2 py-1 rounded ${
                                    (value || 0) > 0 
                                      ? 'bg-green-500/20 text-green-300' 
                                      : 'bg-red-500/20 text-red-300'
                                  }`}
                                >
                                  {stat} {(value || 0) > 0 ? '+' : ''}{value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <Star className="w-5 h-5 text-yellow-400 ml-3" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/60">No major events this year</p>
                    <p className="text-white/40 text-sm mt-1">Life was peaceful and routine</p>
                  </div>
                )}
              </div>
            </div>

            {/* Life Milestones */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Life Milestones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character.achievements.slice(0, 6).map((achievement) => (
                  <div key={achievement.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <h4 className="font-semibold text-white text-sm">{achievement.name}</h4>
                    <p className="text-white/70 text-xs">{achievement.description}</p>
                    <p className="text-white/50 text-xs mt-1">Age {achievement.unlockedYear}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Life Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Health & Wellness
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Physical Health</span>
                    <span className="text-white font-semibold">{character.stats.health}/100</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-red-500 to-red-400"
                      style={{ width: `${character.stats.health}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Happiness</span>
                    <span className="text-white font-semibold">{character.stats.happiness}/100</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                      style={{ width: `${character.stats.happiness}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Intelligence & Skills
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Intelligence</span>
                    <span className="text-white font-semibold">{character.stats.intelligence}/100</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                      style={{ width: `${character.stats.intelligence}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Looks</span>
                    <span className="text-white font-semibold">{character.stats.looks}/100</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-400"
                      style={{ width: `${character.stats.looks}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Financial Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Net Worth</span>
                    <span className="text-green-400 font-bold">
                      ${character.bankAccount.balance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Monthly Income</span>
                    <span className="text-white">
                      ${Math.floor(character.bankAccount.income / 12).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Monthly Expenses</span>
                    <span className="text-red-400">
                      ${Math.floor(character.bankAccount.expenses / 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Relationships
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Family Members</span>
                    <span className="text-white">
                      {character.relationships.filter(r => r.type === 'family').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Friends</span>
                    <span className="text-white">
                      {character.relationships.filter(r => r.type === 'friend').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Romantic Partners</span>
                    <span className="text-white">
                      {character.relationships.filter(r => r.type === 'romantic' || r.type === 'spouse').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Life Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Life Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{character.lifeEvents.length}</div>
                  <div className="text-white/60 text-sm">Life Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{character.achievements.length}</div>
                  <div className="text-white/60 text-sm">Achievements</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{character.age}</div>
                  <div className="text-white/60 text-sm">Years Lived</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor((character.stats.health + character.stats.happiness + character.stats.intelligence + character.stats.looks) / 4)}
                  </div>
                  <div className="text-white/60 text-sm">Life Score</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};