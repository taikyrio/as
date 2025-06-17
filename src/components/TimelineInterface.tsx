
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
  Award,
  BookOpen,
  TrendingUp,
  Home,
  Briefcase
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

  // Group events by age for comprehensive logging
  const eventsByAge = character.lifeEvents.reduce((acc, event) => {
    const age = event.year;
    if (!acc[age]) acc[age] = [];
    acc[age].push(event);
    return acc;
  }, {} as Record<number, LifeEvent[]>);

  // Create comprehensive life log with automatic milestones
  const createLifeLog = (age: number): LifeEvent[] => {
    const events = eventsByAge[age] || [];
    const baseMilestones: LifeEvent[] = [];

    // Add automatic life milestones
    if (age === 0) {
      baseMilestones.push({
        id: `birth-milestone-${age}`,
        title: 'Born into the World',
        description: `${character.name} was born! A new life begins with endless possibilities ahead.`,
        year: age,
        impact: {}
      });
    }

    if (age === 1 && !events.some(e => e.title.includes('First Steps'))) {
      baseMilestones.push({
        id: `walking-milestone-${age}`,
        title: 'First Steps Taken',
        description: 'You took your first wobbly steps, marking an important developmental milestone.',
        year: age,
        impact: { health: 2, happiness: 5 }
      });
    }

    if (age === 2 && !events.some(e => e.title.includes('Talk'))) {
      baseMilestones.push({
        id: `talking-milestone-${age}`,
        title: 'Learning to Communicate',
        description: 'You began forming words and sentences, opening up a whole new world of communication.',
        year: age,
        impact: { intelligence: 3, happiness: 5 }
      });
    }

    if (age === 5 && !events.some(e => e.title.includes('School'))) {
      baseMilestones.push({
        id: `school-milestone-${age}`,
        title: 'Started Elementary School',
        description: 'Your formal education journey began as you entered elementary school, meeting new friends and teachers.',
        year: age,
        impact: { intelligence: 8, happiness: 10 }
      });
    }

    if (age === 13) {
      baseMilestones.push({
        id: `teen-milestone-${age}`,
        title: 'Teenage Years Begin',
        description: 'You officially became a teenager! Your body and mind are undergoing significant changes as you navigate adolescence.',
        year: age,
        impact: { looks: 5, happiness: -5 }
      });
    }

    if (age === 16) {
      baseMilestones.push({
        id: `driving-age-${age}`,
        title: 'Driving Age Reached',
        description: 'You reached the legal driving age, opening up new possibilities for independence and freedom.',
        year: age,
        impact: { happiness: 15 }
      });
    }

    if (age === 18) {
      baseMilestones.push({
        id: `adult-milestone-${age}`,
        title: 'Legal Adulthood',
        description: 'You officially became an adult with full legal rights and responsibilities. The world is your oyster!',
        year: age,
        impact: { happiness: 20, intelligence: 5 }
      });
    }

    if (age === 21) {
      baseMilestones.push({
        id: `adult21-milestone-${age}`,
        title: 'Coming of Age',
        description: 'At 21, you reached full adulthood with all privileges and responsibilities that come with it.',
        year: age,
        impact: { happiness: 10 }
      });
    }

    if (age % 10 === 0 && age > 20) {
      baseMilestones.push({
        id: `decade-milestone-${age}`,
        title: `Reached Age ${age}`,
        description: `You celebrated your ${age}th birthday, marking another decade of life experiences and growth.`,
        year: age,
        impact: { happiness: 5 }
      });
    }

    // Combine and sort all events
    return [...baseMilestones, ...events].sort((a, b) => {
      const priority = (event: LifeEvent) => {
        if (event.title.includes('Born')) return 0;
        if (event.title.includes('First Steps') || event.title.includes('Learning')) return 1;
        if (event.title.includes('School') || event.title.includes('Education')) return 2;
        if (event.title.includes('Achievement') || event.title.includes('Award')) return 3;
        if (event.title.includes('Career') || event.title.includes('Job')) return 4;
        if (event.title.includes('Relationship') || event.title.includes('Marriage')) return 5;
        return 6;
      };
      return priority(a) - priority(b);
    });
  };

  const getAgeStage = (age: number) => {
    if (age <= 5) return { stage: 'Early Childhood', color: 'from-pink-500 to-pink-400', icon: '👶' };
    if (age <= 12) return { stage: 'Childhood', color: 'from-blue-500 to-blue-400', icon: '🧒' };
    if (age <= 17) return { stage: 'Adolescence', color: 'from-purple-500 to-purple-400', icon: '👦' };
    if (age <= 25) return { stage: 'Young Adult', color: 'from-green-500 to-green-400', icon: '👨' };
    if (age <= 40) return { stage: 'Adult', color: 'from-orange-500 to-orange-400', icon: '👨‍💼' };
    if (age <= 65) return { stage: 'Middle Age', color: 'from-yellow-500 to-yellow-400', icon: '👨‍🦳' };
    return { stage: 'Elder', color: 'from-gray-500 to-gray-400', icon: '👴' };
  };

  const currentStage = getAgeStage(character.age);
  const selectedAgeLog = createLifeLog(selectedYear);

  const EventLogItem = ({ event, isHighlighted = false }: { event: LifeEvent; isHighlighted?: boolean }) => (
    <div 
      className={`event-log ${isHighlighted ? 'border-yellow-500/50 bg-yellow-500/5' : ''} animate-fade-in`}
      onClick={() => onViewEvent(event)}
    >
      <div className="event-log-header">
        <h4 className="event-log-title">{event.title}</h4>
        <span className="event-log-age">Age {event.year}</span>
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

  return (
    <div className="lifesim-container">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-md border-b border-gray-700 sticky top-0 z-10">
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
                  <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${currentStage.color} text-white`}>
                    {currentStage.stage}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onAgeUp}
              className="lifesim-btn btn-primary"
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
            <BookOpen className="w-4 h-4 inline mr-2" />
            Life Timeline
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              viewMode === 'stats' 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Life Stats
          </button>
        </div>

        {viewMode === 'timeline' ? (
          <div className="space-y-6">
            {/* Age Navigator */}
            <div className="lifesim-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Detailed Life Log
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedYear(Math.max(0, selectedYear - 1))}
                    disabled={selectedYear <= 0}
                    className="lifesim-btn btn-secondary"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-white font-semibold px-4 py-2 bg-white/10 rounded-lg">
                    Age {selectedYear}
                  </span>
                  <button
                    onClick={() => setSelectedYear(Math.min(character.age, selectedYear + 1))}
                    disabled={selectedYear >= character.age}
                    className="lifesim-btn btn-secondary"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Age Slider */}
              <div className="relative mb-6">
                <input
                  type="range"
                  min="0"
                  max={character.age}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="age-slider w-full"
                />
                <div className="flex justify-between text-xs text-white/60 mt-2">
                  <span>Birth</span>
                  <span>Age {character.age}</span>
                </div>
              </div>

              {/* Life Stage Information */}
              <div className="life-stage mb-6">
                <div className="life-stage-emoji">{getAgeStage(selectedYear).icon}</div>
                <div className="life-stage-title">{getAgeStage(selectedYear).stage}</div>
              </div>

              {/* Events for Selected Age */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Everything that happened at Age {selectedYear}
                </h3>
                {selectedAgeLog.length > 0 ? (
                  selectedAgeLog.map((event, index) => (
                    <EventLogItem 
                      key={`detail-${event.id}-${selectedYear}-${index}`} 
                      event={event}
                      isHighlighted={event.title.includes('Achievement') || event.title.includes('Major')}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">No events recorded for Age {selectedYear}</p>
                    <p className="text-white/40 text-sm mt-2">Life was peaceful and routine during this time</p>
                  </div>
                )}
              </div>
            </div>

            {/* Life Milestones Overview */}
            <div className="lifesim-section">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Major Life Milestones
              </h3>
              <div className="timeline-container">
                <div className="timeline-line"></div>
                {Array.from({ length: character.age + 1 }, (_, i) => i)
                  .filter(age => {
                    const events = createLifeLog(age);
                    return events.some(e => 
                      e.title.includes('Born') || 
                      e.title.includes('School') || 
                      e.title.includes('Adult') || 
                      e.title.includes('Career') ||
                      e.title.includes('Marriage') ||
                      e.title.includes('Achievement')
                    );
                  })
                  .slice(0, 10) // Show only first 10 major milestones
                  .map(age => {
                    const events = createLifeLog(age);
                    const majorEvent = events.find(e => 
                      e.title.includes('Born') || 
                      e.title.includes('School') || 
                      e.title.includes('Adult') || 
                      e.title.includes('Career') ||
                      e.title.includes('Marriage') ||
                      e.title.includes('Achievement')
                    );
                    
                    if (!majorEvent) return null;
                    
                    return (
                      <div 
                        key={`milestone-${age}`}
                        className="timeline-item cursor-pointer"
                        onClick={() => setSelectedYear(age)}
                      >
                        <div className={`timeline-marker ${majorEvent.title.includes('Achievement') ? 'major-event' : ''}`}></div>
                        <div className="event-log">
                          <div className="event-log-header">
                            <h4 className="event-log-title">{majorEvent.title}</h4>
                            <span className="event-log-age">Age {age}</span>
                          </div>
                          <p className="event-log-description">{majorEvent.description}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Comprehensive Life Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="lifesim-section">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Health & Wellness
                </h3>
                <div className="space-y-4">
                  <div className="stat-bar-container">
                    <span className="stat-bar-label">Physical Health:</span>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill stat-health" style={{ width: `${character.stats.health}%` }}></div>
                    </div>
                    <span className="stat-bar-value">{character.stats.health}/100</span>
                  </div>
                  <div className="stat-bar-container">
                    <span className="stat-bar-label">Happiness:</span>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill stat-happiness" style={{ width: `${character.stats.happiness}%` }}></div>
                    </div>
                    <span className="stat-bar-value">{character.stats.happiness}/100</span>
                  </div>
                </div>
              </div>

              <div className="lifesim-section">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Intelligence & Appearance
                </h3>
                <div className="space-y-4">
                  <div className="stat-bar-container">
                    <span className="stat-bar-label">Intelligence:</span>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill stat-intelligence" style={{ width: `${character.stats.intelligence}%` }}></div>
                    </div>
                    <span className="stat-bar-value">{character.stats.intelligence}/100</span>
                  </div>
                  <div className="stat-bar-container">
                    <span className="stat-bar-label">Looks:</span>
                    <div className="stat-bar-track">
                      <div className="stat-bar-fill stat-looks" style={{ width: `${character.stats.looks}%` }}></div>
                    </div>
                    <span className="stat-bar-value">{character.stats.looks}/100</span>
                  </div>
                </div>
              </div>

              <div className="lifesim-section">
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
                    <span className="text-white/70">Annual Income</span>
                    <span className="text-white">
                      ${character.bankAccount.income.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Annual Expenses</span>
                    <span className="text-red-400">
                      ${character.bankAccount.expenses.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lifesim-section">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Relationships & Social
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

            {/* Life Summary Dashboard */}
            <div className="lifesim-section">
              <h3 className="text-lg font-bold text-white mb-4">Complete Life Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-400">{character.lifeEvents.length}</div>
                  <div className="text-white/60 text-sm mt-1">Life Events</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-3xl font-bold text-yellow-400">{character.achievements.length}</div>
                  <div className="text-white/60 text-sm mt-1">Achievements</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400">{character.age}</div>
                  <div className="text-white/60 text-sm mt-1">Years Lived</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-400">
                    {Math.floor((character.stats.health + character.stats.happiness + character.stats.intelligence + character.stats.looks) / 4)}
                  </div>
                  <div className="text-white/60 text-sm mt-1">Life Score</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
