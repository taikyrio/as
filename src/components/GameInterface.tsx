import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  Heart, 
  Brain, 
  Eye, 
  Smile,
  DollarSign,
  Briefcase,
  GraduationCap,
  Home,
  Activity,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Character } from '../types/GameTypes';
import { countries } from '../data/countries';

interface GameInterfaceProps {
  character: Character;
  currentYear: number;
  onAgeUp: () => void;
  onViewProfile: () => void;
  onViewCrime: () => void;
  onViewCareer: () => void;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({
  character,
  currentYear,
  onAgeUp,
  onViewProfile,
  onViewCrime,
  onViewCareer
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const country = countries.find(c => c.id === character.location);
  const recentEvents = character.lifeEvents.slice(0, 5);

  const StatBar = ({ label, value, max = 100, color = 'blue', icon }: any) => (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-white/80 text-sm font-medium">{label}</span>
        </div>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r from-${color}-500 to-${color}-400`}
          style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">{character.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Age {character.age}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {country?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">
                  ${character.bankAccount.balance.toLocaleString()}
                </p>
                <p className="text-sm text-white/60">Net Worth</p>
              </div>
              <button
                onClick={onAgeUp}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Age Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prison Status Banner */}
      {character.criminalRecord.imprisonments.some(imp => 
        character.age >= imp.startYear && character.age < imp.endYear
      ) && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-300 font-semibold">INCARCERATED</span>
            {character.criminalRecord.imprisonments
              .filter(imp => character.age >= imp.startYear && character.age < imp.endYear)
              .map(imp => (
                <span key={imp.id} className="text-red-200 text-sm">
                  - {imp.prison} ({imp.endYear - character.age} years remaining)
                </span>
              ))
            }
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Character Stats
              </h2>
              <div className="space-y-4">
                <StatBar 
                  label="Health" 
                  value={character.stats.health} 
                  color="red" 
                  icon={<Heart className="w-4 h-4 text-red-400" />} 
                />
                <StatBar 
                  label="Intelligence" 
                  value={character.stats.intelligence} 
                  color="blue" 
                  icon={<Brain className="w-4 h-4 text-blue-400" />} 
                />
                <StatBar 
                  label="Looks" 
                  value={character.stats.looks} 
                  color="pink" 
                  icon={<Eye className="w-4 h-4 text-pink-400" />} 
                />
                <StatBar 
                  label="Happiness" 
                  value={character.stats.happiness} 
                  color="yellow" 
                  icon={<Smile className="w-4 h-4 text-yellow-400" />} 
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <ActionButton
                  icon={<User className="w-5 h-5" />}
                  text="View Profile"
                  onClick={onViewProfile}
                />
                <ActionButton
                  icon={<Briefcase className="w-5 h-5" />}
                  text="Career"
                  onClick={onViewCareer}
                />
                <ActionButton
                  icon={<GraduationCap className="w-5 h-5" />}
                  text="Education"
                  onClick={() => {}}
                />
                <ActionButton
                  icon={<Home className="w-5 h-5" />}
                  text="Real Estate"
                  onClick={() => {}}
                />
                <ActionButton
                  icon={<Activity className="w-5 h-5 text-red-400" />}
                  text="Crime"
                  onClick={onViewCrime}
                  danger
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Events */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Life Events
              </h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event, index) => (
                    <div 
                      key={event.id} 
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{event.title}</h3>
                        <span className="text-sm text-white/60">Age {event.year}</span>
                      </div>
                      <p className="text-white/80 text-sm">{event.description}</p>
                      {event.impact && Object.keys(event.impact).length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {Object.entries(event.impact).map(([stat, value]) => (
                            <span 
                              key={stat}
                              className={`text-xs px-2 py-1 rounded ${
                                (value || 0) > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {stat} {(value || 0) > 0 ? '+' : ''}{value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center py-8">No recent events</p>
                )}
              </div>
            </div>

            {/* Career & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Career
                </h3>
                {character.career ? (
                  <div>
                    <h4 className="font-semibold text-white">{character.career.title}</h4>
                    <p className="text-white/70 text-sm">{character.career.company}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60">Salary:</span>
                        <span className="text-green-400 font-semibold">
                          ${character.career.salary.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Experience:</span>
                        <span className="text-white">{character.career.experience} years</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/60">Unemployed</p>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {character.achievements.length > 0 ? (
                    character.achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="bg-white/5 rounded p-2">
                        <p className="text-white text-sm font-medium">{achievement.name}</p>
                        <p className="text-white/60 text-xs">{achievement.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60 text-sm">No achievements yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  danger?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, text, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
      danger 
        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30' 
        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
    }`}
  >
    {icon}
    <span>{text}</span>
  </button>
);