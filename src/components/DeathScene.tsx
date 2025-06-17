import React, { useState, useEffect } from 'react';
import { Character } from '../types/GameTypes';
import { Skull, Heart, Clock, Trophy, DollarSign, Users, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

interface DeathSceneProps {
  character: Character;
  causeOfDeath: string;
  onNewGame: () => void;
  onMainMenu: () => void;
}

export const DeathScene: React.FC<DeathSceneProps> = ({
  character,
  causeOfDeath,
  onNewGame,
  onMainMenu
}) => {
  const [currentPhase, setCurrentPhase] = useState<'death' | 'summary' | 'legacy'>('death');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentPhase('summary'), 3000);
    const timer2 = setTimeout(() => setShowStats(true), 4000);
    const timer3 = setTimeout(() => setCurrentPhase('legacy'), 8000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const calculateLifeScore = () => {
    const avgStats = (character.stats.health + character.stats.intelligence + 
                     character.stats.looks + character.stats.happiness) / 4;
    const longevityBonus = Math.min(character.age * 0.5, 40);
    const careerBonus = character.career ? 20 : 0;
    const relationshipBonus = character.relationships.length * 2;
    const achievementBonus = character.achievements.length * 5;
    const wealthBonus = Math.min(character.bankAccount.balance / 10000, 20);
    
    return Math.round(avgStats + longevityBonus + careerBonus + relationshipBonus + achievementBonus + wealthBonus);
  };

  const getLifeRating = (score: number) => {
    if (score >= 90) return { rating: 'Legendary', color: 'text-purple-400', description: 'A life truly worth remembering' };
    if (score >= 80) return { rating: 'Excellent', color: 'text-blue-400', description: 'A life well lived' };
    if (score >= 70) return { rating: 'Good', color: 'text-green-400', description: 'A fulfilling journey' };
    if (score >= 60) return { rating: 'Average', color: 'text-yellow-400', description: 'A typical human experience' };
    if (score >= 40) return { rating: 'Challenging', color: 'text-orange-400', description: 'A difficult but meaningful life' };
    return { rating: 'Tragic', color: 'text-red-400', description: 'A life of struggle and hardship' };
  };

  const lifeScore = calculateLifeScore();
  const lifeRating = getLifeRating(lifeScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_50%)] opacity-20"></div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {currentPhase === 'death' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <Skull className="w-24 h-24 text-gray-400 mx-auto mb-6 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
                Rest in Peace
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-300 mb-6 animate-fade-in-up delay-300">
                {character.name}
              </h2>
              <div className="text-xl text-gray-400 animate-fade-in-up delay-500">
                <p>{character.birthYear} - {character.birthYear + character.age}</p>
                <p className="mt-2">Aged {character.age} years</p>
              </div>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 animate-fade-in-up delay-700">
              <h3 className="text-xl font-semibold text-white mb-4">Final Moments</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {getCauseOfDeathDescription(causeOfDeath, character)}
              </p>
            </div>
          </div>
        )}

        {currentPhase === 'summary' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <Clock className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-white mb-6">Life Summary</h1>
            </div>

            {showStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={<Heart className="w-8 h-8 text-red-400" />}
                  label="Final Health"
                  value={character.stats.health}
                  maxValue={100}
                />
                <StatCard
                  icon={<Users className="w-8 h-8 text-purple-400" />}
                  label="Relationships"
                  value={character.relationships.length}
                  description="people"
                />
                <StatCard
                  icon={<DollarSign className="w-8 h-8 text-green-400" />}
                  label="Net Worth"
                  value={character.bankAccount.balance}
                  isCurrency={true}
                />
                <StatCard
                  icon={<Trophy className="w-8 h-8 text-yellow-400" />}
                  label="Achievements"
                  value={character.achievements.length}
                  description="unlocked"
                />
              </div>
            )}

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Life Events</h3>
              <p className="text-gray-300 mb-4">
                {character.name} experienced {character.lifeEvents.length} major life events over {character.age} years.
              </p>
              
              {character.career && (
                <div className="flex items-center justify-center gap-2 text-blue-300 mb-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Career: {character.career.title} at {character.career.company}</span>
                </div>
              )}
              
              {character.education.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-purple-300">
                  <GraduationCap className="w-5 h-5" />
                  <span>Education: {character.education.length} qualifications</span>
                </div>
              )}
            </div>
          </div>
        )}

        {currentPhase === 'legacy' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{lifeScore}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full animate-ping"></div>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">Life Score</h1>
              <h2 className={`text-3xl font-bold mb-2 ${lifeRating.color}`}>
                {lifeRating.rating}
              </h2>
              <p className="text-xl text-gray-300 mb-8">{lifeRating.description}</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Legacy</h3>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg">
                  {character.name}'s journey touched the lives of {character.relationships.length} people
                  {character.career && ` while building a career as a ${character.career.title}`}.
                </p>
                
                {character.criminalRecord.crimes.length > 0 ? (
                  <p className="text-red-300">
                    Despite {character.criminalRecord.crimes.length} brushes with the law, their story remains a testament to the complexity of human nature.
                  </p>
                ) : (
                  <p className="text-green-300">
                    They lived an honest life, staying true to their values until the end.
                  </p>
                )}
                
                <p className="text-lg">
                  Their memory lives on, a unique story in the tapestry of human experience.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={onNewGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
              >
                <ArrowRight className="w-6 h-6" />
                Start New Life
              </button>
              
              <button
                onClick={onMainMenu}
                className="px-8 py-4 bg-gray-700 text-white font-bold text-lg rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Main Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for stats display
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  maxValue?: number;
  description?: string;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  label, 
  value, 
  maxValue, 
  description, 
  isCurrency = false 
}) => {
  const displayValue = isCurrency 
    ? `$${value.toLocaleString()}` 
    : maxValue 
      ? `${value}/${maxValue}` 
      : value.toString();

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-scale-in">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <div className="text-2xl font-bold text-white mb-1">{displayValue}</div>
        <div className="text-sm text-gray-400">{label}</div>
        {description && (
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate death descriptions
function getCauseOfDeathDescription(cause: string, character: Character): string {
  const descriptions = {
    'natural causes': [
      `${character.name} peacefully passed away in their sleep, surrounded by memories of a life well-lived.`,
      `After ${character.age} years of life's journey, ${character.name} found peace in their final moments.`,
      `Time finally caught up with ${character.name}, who departed this world with dignity and grace.`
    ],
    'illness': [
      `Despite fighting bravely against illness, ${character.name}'s body could no longer continue the battle.`,
      `${character.name} faced their final challenge with courage, but their health had been declining for some time.`,
      `After a period of poor health, ${character.name} found release from their suffering.`
    ],
    'accident': [
      `Life can change in an instant. ${character.name}'s journey ended unexpectedly in a tragic accident.`,
      `In a cruel twist of fate, ${character.name}'s life was cut short by an unforeseen accident.`,
      `${character.name}'s story ended too soon, a reminder of life's fragility.`
    ],
    'violence': [
      `${character.name}'s past choices led them down a dangerous path that ultimately cost them their life.`,
      `The criminal underworld claimed another victim in ${character.name}.`,
      `Violence begets violence, and ${character.name} became caught in its deadly cycle.`
    ]
  };

  const causeDescriptions = descriptions[cause as keyof typeof descriptions] || descriptions['natural causes'];
  return causeDescriptions[Math.floor(Math.random() * causeDescriptions.length)];
}