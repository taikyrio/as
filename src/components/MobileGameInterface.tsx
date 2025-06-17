import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Heart, 
  Brain, 
  Eye, 
  Smile,
  DollarSign,
  Menu,
  X,
  Settings,
  Save,
  BarChart3,
  Clock,
  Star,
  Award,
  Users,
  Home,
  Briefcase,
  GraduationCap,
  Zap,
} from 'lucide-react';
import { Character, LifeEvent } from '../types/GameTypes';
import { TimelineInterface } from './TimelineInterface';
import { ActivitiesInterface } from './ActivitiesInterface';
import { MiniGames } from './MiniGames';
import { DecisionModal } from './DecisionModal';

interface MobileGameInterfaceProps {
  character: Character;
  currentYear: number;
  onAgeUp: () => void;
  onSaveGame: () => void;
  onShowSettings: () => void;
  onShowStats: () => void;
  onViewCareer: () => void;
  onViewCrime: () => void;
  onViewLifeActions: () => void;
}

export const MobileGameInterface: React.FC<MobileGameInterfaceProps> = ({
  character,
  currentYear,
  onAgeUp,
  onSaveGame,
  onShowSettings,
  onShowStats,
  onViewCareer,
  onViewCrime,
  onViewLifeActions
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'timeline' | 'actions' | 'activities' | 'minigames'>('overview');
  const [showMenu, setShowMenu] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<any>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      onSaveGame();
    }, 30000);
    return () => clearInterval(interval);
  }, [onSaveGame]);

  const getLifeStage = (age: number) => {
    if (age <= 5) return { stage: 'Early Childhood', emoji: '👶', color: 'from-pink-400 to-pink-600' };
    if (age <= 12) return { stage: 'Childhood', emoji: '🧒', color: 'from-blue-400 to-blue-600' };
    if (age <= 17) return { stage: 'Adolescence', emoji: '👦', color: 'from-purple-400 to-purple-600' };
    if (age <= 25) return { stage: 'Young Adult', emoji: '👨', color: 'from-green-400 to-green-600' };
    if (age <= 40) return { stage: 'Adult', emoji: '👨‍💼', color: 'from-orange-400 to-orange-600' };
    if (age <= 65) return { stage: 'Middle Age', emoji: '👨‍🦳', color: 'from-yellow-400 to-yellow-600' };
    return { stage: 'Elder', emoji: '👴', color: 'from-gray-400 to-gray-600' };
  };

  const lifeStage = getLifeStage(character.age);
  const recentEvents = character.lifeEvents.slice(0, 3);

  const StatCard = ({ icon, label, value, max = 100, color }: any) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-white/80 text-sm font-medium">{label}</span>
        </div>
        <span className="text-white font-bold">{value}</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }}
        ></div>
      </div>
    </div>
  );

  const ActionButton = ({ icon, text, onClick, color = 'from-purple-500 to-blue-500' }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-4 bg-gradient-to-r ${color} text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  if (activeView === 'timeline') {
    return (
      <TimelineInterface
        character={character}
        currentYear={currentYear}
        onAgeUp={onAgeUp}
        onViewEvent={(event) => {
          // Handle event viewing
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Mobile Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{lifeStage.emoji}</div>
              <div>
                <h1 className="text-xl font-bold text-white">{character.name}</h1>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span>Age {character.age}</span>
                  <span>{currentYear}</span>
                  <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${lifeStage.color} text-white`}>
                    {lifeStage.stage}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onSaveGame}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Save className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                {showMenu ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="bg-black/40 backdrop-blur-md border-t border-white/10 px-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setActiveView('overview'); setShowMenu(false); }}
                className={`p-3 rounded-lg font-medium transition-all ${
                  activeView === 'overview' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => { setActiveView('timeline'); setShowMenu(false); }}
                className={`p-3 rounded-lg font-medium transition-all ${
                  activeView === 'timeline' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => { setActiveView('actions'); setShowMenu(false); }}
                className={`p-3 rounded-lg font-medium transition-all ${
                  activeView === 'actions' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                }`}
              >
                Actions
              </button>
              <button
                onClick={() => { onShowStats(); setShowMenu(false); }}
                className="p-3 rounded-lg font-medium bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
              >
                Statistics
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-6 space-y-6">
        {activeView === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                icon={<Heart className="w-4 h-4 text-red-400" />}
                label="Health"
                value={character.stats.health}
                color="from-red-500 to-red-400"
              />
              <StatCard 
                icon={<Brain className="w-4 h-4 text-blue-400" />}
                label="Intelligence"
                value={character.stats.intelligence}
                color="from-blue-500 to-blue-400"
              />
              <StatCard 
                icon={<Eye className="w-4 h-4 text-pink-400" />}
                label="Looks"
                value={character.stats.looks}
                color="from-pink-500 to-pink-400"
              />
              <StatCard 
                icon={<Smile className="w-4 h-4 text-yellow-400" />}
                label="Happiness"
                value={character.stats.happiness}
                color="from-yellow-500 to-yellow-400"
              />
            </div>

            {/* Financial Status */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Financial Status
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Net Worth</span>
                  <span className="text-green-400 font-bold">
                    ${character.bankAccount.balance.toLocaleString()}
                  </span>
                </div>
                {character.career && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Monthly Salary</span>
                    <span className="text-white">
                      ${Math.floor(character.career.salary / 12).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Events
              </h3>
              <div className="space-y-3">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event, index) => (
                    <div key={`${event.id}-${Date.now()}-${index}`} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{event.title}</h4>
                          <p className="text-white/70 text-xs mt-1">{event.description}</p>
                          <span className="text-white/50 text-xs">Age {event.year}</span>
                        </div>
                        <Star className="w-4 h-4 text-yellow-400 ml-2" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center py-4">No recent events</p>
                )}
              </div>
            </div>

            {/* Age Up Button */}
            <div className="sticky bottom-4">
              <button
                onClick={onAgeUp}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
              >
                <Clock className="w-6 h-6" />
                Age Up to {character.age + 1}
              </button>
            </div>
          </>
        )}

        {activeView === 'actions' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Life Actions</h2>

            <ActionButton
              icon={<GraduationCap className="w-6 h-6" />}
              text="Education & Learning"
              onClick={() => {}}
              color="from-blue-500 to-cyan-500"
            />

            <ActionButton
              icon={<Briefcase className="w-6 h-6" />}
              text="Career & Work"
              onClick={onViewCareer}
              color="from-green-500 to-emerald-500"
            />

            <ActionButton
              icon={<Users className="w-6 h-6" />}
              text="Relationships"
              onClick={() => {}}
              color="from-pink-500 to-rose-500"
            />

            <ActionButton
              icon={<Home className="w-6 h-6" />}
              text="Real Estate"
              onClick={() => {}}
              color="from-orange-500 to-amber-500"
            />

            <ActionButton
              icon={<Heart className="w-6 h-6" />}
              text="Health & Fitness"
              onClick={() => {}}
              color="from-red-500 to-pink-500"
            />

            <ActionButton
              icon={<Star className="w-6 h-6" />}
              text="All Life Actions"
              onClick={onViewLifeActions}
              color="from-purple-500 to-indigo-500"
            />

            {character.age >= 12 && (
              <ActionButton
                icon={<div className="w-6 h-6 flex items-center justify-center text-red-400 font-bold">⚡</div>}
                text="Criminal Activities"
                onClick={onViewCrime}
                color="from-red-500 to-red-600"
                danger={true}
              />
            )}
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {currentDecision && (
        <DecisionModal
          decision={currentDecision}
          onChoose={(optionId) => {
            // Handle decision
            setCurrentDecision(null);
          }}
          onClose={() => setCurrentDecision(null)}
        />
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 space-y-2 z-30">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 shadow-lg animate-slide-in"
            >
              {notification}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ActionButton Component
interface ActionButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  color: string;
  danger?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  text, 
  onClick, 
  color, 
  danger = false 
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-4 shadow-lg ${
        danger 
          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-400/30' 
          : `bg-gradient-to-r ${color} text-white`
      }`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        danger ? 'bg-red-400/20' : 'bg-white/20'
      }`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="font-bold">{text}</div>
      </div>
    </button>
  );
};