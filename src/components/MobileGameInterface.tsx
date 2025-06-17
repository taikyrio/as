
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
  Lock,
  Activity,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Shield
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
  prisonStatus: { inPrison: boolean, prison?: string, yearsLeft?: number };
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
  onViewLifeActions,
  prisonStatus
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'timeline' | 'actions' | 'activities'>('overview');
  const [selectedAge, setSelectedAge] = useState(character.age);
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
    if (age <= 5) return { stage: 'Early Childhood', emoji: '👶', color: 'bg-pink-500' };
    if (age <= 12) return { stage: 'Childhood', emoji: '🧒', color: 'bg-blue-500' };
    if (age <= 17) return { stage: 'Adolescence', emoji: '👦', color: 'bg-purple-500' };
    if (age <= 25) return { stage: 'Young Adult', emoji: '👨', color: 'bg-green-500' };
    if (age <= 40) return { stage: 'Adult', emoji: '👨‍💼', color: 'bg-orange-500' };
    if (age <= 65) return { stage: 'Middle Age', emoji: '👨‍🦳', color: 'bg-yellow-500' };
    return { stage: 'Elder', emoji: '👴', color: 'bg-gray-500' };
  };

  const lifeStage = getLifeStage(character.age);

  // Group events by age for detailed logging
  const eventsByAge = character.lifeEvents.reduce((acc, event) => {
    const age = event.year;
    if (!acc[age]) acc[age] = [];
    acc[age].push(event);
    return acc;
  }, {} as Record<number, LifeEvent[]>);

  // Get events for selected age
  const selectedAgeEvents = eventsByAge[selectedAge] || [];

  // Create comprehensive life log including basic milestones
  const createLifeLog = (age: number): LifeEvent[] => {
    const events = eventsByAge[age] || [];
    const baseMilestones: LifeEvent[] = [];

    // Add automatic milestones
    if (age === 0) {
      baseMilestones.push({
        id: `birth-${age}`,
        title: 'Born',
        description: `You were born as ${character.name} in ${character.location}. Welcome to the world!`,
        year: age,
        impact: {}
      });
    }

    if (age === 1 && !events.some(e => e.title.includes('First Steps'))) {
      baseMilestones.push({
        id: `milestone-walk-${age}`,
        title: 'Learning to Walk',
        description: 'You are starting to take your first wobbly steps around the house.',
        year: age,
        impact: {}
      });
    }

    if (age === 2 && !events.some(e => e.title.includes('Talking'))) {
      baseMilestones.push({
        id: `milestone-talk-${age}`,
        title: 'Learning to Talk',
        description: 'You are beginning to form simple words and communicate with your family.',
        year: age,
        impact: {}
      });
    }

    if (age === 5 && !events.some(e => e.title.includes('School'))) {
      baseMilestones.push({
        id: `milestone-school-${age}`,
        title: 'Starting School',
        description: 'You began attending elementary school, making new friends and learning basic skills.',
        year: age,
        impact: { intelligence: 5, happiness: 10 }
      });
    }

    if (age === 13) {
      baseMilestones.push({
        id: `milestone-teen-${age}`,
        title: 'Becoming a Teenager',
        description: 'You officially became a teenager! Your body and mind are going through many changes.',
        year: age,
        impact: { looks: 5 }
      });
    }

    if (age === 18) {
      baseMilestones.push({
        id: `milestone-adult-${age}`,
        title: 'Reached Adulthood',
        description: 'You are now legally an adult with new freedoms and responsibilities.',
        year: age,
        impact: { happiness: 15 }
      });
    }

    // Combine and sort all events
    return [...baseMilestones, ...events].sort((a, b) => {
      // Sort by event type priority, then by id
      const priority = (event: LifeEvent) => {
        if (event.title === 'Born') return 0;
        if (event.title.includes('Learning')) return 1;
        if (event.title.includes('School')) return 2;
        if (event.title.includes('Achievement')) return 3;
        return 4;
      };
      return priority(a) - priority(b);
    });
  };

  const selectedAgeLog = createLifeLog(selectedAge);

  const StatBar = ({ label, value, statType, max = 100 }: { 
    label: string; 
    value: number; 
    statType: 'health' | 'happiness' | 'intelligence' | 'looks' | 'fitness';
    max?: number;
  }) => (
    <div className="stat-bar-container">
      <span className="stat-bar-label">{label}:</span>
      <div className="stat-bar-track">
        <div 
          className={`stat-bar-fill stat-${statType}`}
          style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }}
        ></div>
      </div>
      <span className="stat-bar-value">{value}</span>
    </div>
  );

  const BottomNavButton = ({ icon, label, active, onClick, isDisabled = false }: any) => (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`bottom-nav-btn ${active ? 'active' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="bottom-nav-icon">
        {icon}
      </div>
      <span className="bottom-nav-label">{label}</span>
    </button>
  );

  const EventLogItem = ({ event, showAge = false }: { event: LifeEvent; showAge?: boolean }) => (
    <div className="event-log animate-fade-in">
      <div className="event-log-header">
        <h4 className="event-log-title">{event.title}</h4>
        {showAge && <span className="event-log-age">Age {event.year}</span>}
      </div>
      <p className="event-log-description">{event.description}</p>
      {event.impact && Object.keys(event.impact).length > 0 && (
        <div className="event-impact-tags">
          {Object.entries(event.impact).map(([stat, value]) => (
            <span
              key={stat}
              className={`impact-tag ${(value || 0) > 0 ? 'impact-positive' : 'impact-negative'}`}
            >
              {stat.charAt(0).toUpperCase() + stat.slice(1)} {(value || 0) > 0 ? '+' : ''}{value}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (activeView === 'timeline') {
    return (
      <div className="lifesim-container">
        {/* Header */}
        <div className="bg-gray-800/90 backdrop-blur-md border-b border-gray-700 sticky top-0 z-10 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveView('overview')}
              className="lifesim-btn btn-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-lg font-bold text-white">Life Timeline</h1>
            <div className="w-16"></div>
          </div>
        </div>

        <div className="p-4 pb-24">
          {/* Age Navigator */}
          <div className="age-navigator">
            <button
              onClick={() => setSelectedAge(Math.max(0, selectedAge - 1))}
              disabled={selectedAge <= 0}
              className="lifesim-btn btn-secondary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-white">Age {selectedAge}</div>
              <div className="text-sm text-gray-400">{getLifeStage(selectedAge).stage}</div>
            </div>
            
            <button
              onClick={() => setSelectedAge(Math.min(character.age, selectedAge + 1))}
              disabled={selectedAge >= character.age}
              className="lifesim-btn btn-secondary"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Age Slider */}
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max={character.age}
              value={selectedAge}
              onChange={(e) => setSelectedAge(parseInt(e.target.value))}
              className="age-slider w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Birth</span>
              <span>Age {character.age}</span>
            </div>
          </div>

          {/* Events for Selected Age */}
          <div className="lifesim-section">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Life Log - Age {selectedAge}
            </h3>
            
            {selectedAgeLog.length > 0 ? (
              <div className="space-y-3">
                {selectedAgeLog.map((event, index) => (
                  <EventLogItem key={`${event.id}-${index}`} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No events recorded for this age</p>
                <p className="text-gray-500 text-sm">Life was quiet and peaceful</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <div className="bottom-nav-container">
            <BottomNavButton
              icon={<Briefcase className="w-4 h-4" />}
              label="Career"
              active={false}
              onClick={onViewCareer}
            />
            <BottomNavButton
              icon={<Heart className="w-4 h-4" />}
              label="Relationships"
              active={false}
              onClick={onViewLifeActions}
            />
            <BottomNavButton
              icon={<User className="w-4 h-4" />}
              label="Profile"
              active={false}
              onClick={() => setActiveView('overview')}
            />
            <BottomNavButton
              icon={<BookOpen className="w-4 h-4" />}
              label="Timeline"
              active={true}
              onClick={() => setActiveView('timeline')}
            />
            <BottomNavButton
              icon={<Activity className="w-4 h-4" />}
              label="Activities"
              active={false}
              onClick={() => setActiveView('activities')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lifesim-container">
      {/* Top Bar */}
      <div className="bg-gray-800/90 backdrop-blur-md px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-lg font-bold text-white">
              ${character.bankAccount.balance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 pb-24">
        {activeView === 'overview' && (
          <>
            {/* Character Info */}
            <div className="lifesim-section mb-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{lifeStage.emoji}</div>
                <h2 className="text-xl font-bold text-white">{character.name}</h2>
                <p className="text-gray-400">Age {character.age} • {lifeStage.stage}</p>
                {prisonStatus?.inPrison && (
                  <div className="mt-2 px-3 py-1 bg-red-900/50 border border-red-700 rounded-lg inline-block">
                    <div className="flex items-center gap-2 text-red-300 text-sm">
                      <Lock className="w-4 h-4" />
                      Incarcerated - {prisonStatus.yearsLeft} years left
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Section */}
            <div className="lifesim-section mb-4">
              <h3 className="text-lg font-semibold text-white mb-4">Character Stats</h3>
              <StatBar label="Health" value={character.stats.health} statType="health" />
              <StatBar label="Happiness" value={character.stats.happiness} statType="happiness" />
              <StatBar label="Intelligence" value={character.stats.intelligence} statType="intelligence" />
              <StatBar label="Looks" value={character.stats.looks} statType="looks" />
              <StatBar label="Fitness" value={character.stats.health} statType="fitness" />
            </div>

            {/* Recent Events */}
            <div className="lifesim-section mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Events
                </h3>
                <button
                  onClick={() => setActiveView('timeline')}
                  className="lifesim-btn btn-secondary text-sm"
                >
                  View All
                </button>
              </div>
              
              {character.lifeEvents.length > 0 ? (
                <div className="space-y-3">
                  {character.lifeEvents.slice(-5).reverse().map((event, index) => (
                    <EventLogItem key={`recent-${event.id}-${index}`} event={event} showAge={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-center py-4">
                    <h4 className="text-yellow-400 font-semibold text-lg mb-2">
                      Age {character.age} - Just Born!
                    </h4>
                    <p className="text-gray-300 text-sm mb-2">
                      My name is {character.name}
                    </p>
                    <p className="text-gray-300 text-sm mb-2">
                      I was born {character.gender || 'male'} in {character.location} in {currentYear}
                    </p>
                    {character.parents && (
                      <>
                        <p className="text-gray-300 text-sm mb-1">
                          My father is {character.parents.father}, he works as a {character.parents.fatherJob || 'unknown profession'}
                        </p>
                        <p className="text-gray-300 text-sm">
                          My mother is {character.parents.mother}, she works as a {character.parents.motherJob || 'unknown profession'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Age Up Button */}
            <button
              onClick={onAgeUp}
              className={`lifesim-btn btn-success w-full py-4 text-lg font-bold ${
                prisonStatus?.inPrison ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={prisonStatus?.inPrison}
            >
              <Calendar className="w-6 h-6" />
              {prisonStatus?.inPrison ? `Serve Time (${prisonStatus.yearsLeft} years left)` : 'Age Up'}
            </button>
          </>
        )}

        {activeView === 'actions' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Life Actions</h2>

            <button
              onClick={onViewLifeActions}
              className="lifesim-card w-full p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                <span className="text-white font-medium">Education & Learning</span>
              </div>
            </button>

            <button
              onClick={onViewCareer}
              className="lifesim-card w-full p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-green-400" />
                <span className="text-white font-medium">Career & Work</span>
              </div>
            </button>

            <button
              onClick={onViewLifeActions}
              className="lifesim-card w-full p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-pink-400" />
                <span className="text-white font-medium">Relationships</span>
              </div>
            </button>

            <button
              onClick={onViewLifeActions}
              className="lifesim-card w-full p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <Home className="w-6 h-6 text-orange-400" />
                <span className="text-white font-medium">Real Estate</span>
              </div>
            </button>

            <button
              onClick={onViewLifeActions}
              className="lifesim-card w-full p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-red-400" />
                <span className="text-white font-medium">Health & Fitness</span>
              </div>
            </button>

            {character.age >= 12 && (
              <button
                onClick={onViewCrime}
                className="lifesim-card w-full p-4 text-left border border-red-700/50"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-red-400" />
                  <span className="text-red-400 font-medium">Criminal Activities</span>
                </div>
              </button>
            )}
          </div>
        )}

        {activeView === 'activities' && (
          <ActivitiesInterface
            character={character}
            onBack={() => setActiveView('overview')}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="bottom-nav-container">
          <BottomNavButton
            icon={<Briefcase className="w-4 h-4" />}
            label="Career"
            active={false}
            onClick={onViewCareer}
          />
          <BottomNavButton
            icon={<Heart className="w-4 h-4" />}
            label="Relationships"
            active={false}
            onClick={onViewLifeActions}
          />
          <BottomNavButton
            icon={<User className="w-4 h-4" />}
            label="Profile"
            active={activeView === 'overview'}
            onClick={() => setActiveView('overview')}
          />
          <BottomNavButton
            icon={<BookOpen className="w-4 h-4" />}
            label="Timeline"
            active={activeView === 'timeline'}
            onClick={() => setActiveView('timeline')}
          />
          <BottomNavButton
            icon={<Activity className="w-4 h-4" />}
            label="Activities"
            active={activeView === 'activities'}
            onClick={() => setActiveView('activities')}
          />
        </div>
      </div>

      {/* Decision Modal */}
      {currentDecision && (
        <DecisionModal
          decision={currentDecision}
          onChoose={(optionId) => {
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
