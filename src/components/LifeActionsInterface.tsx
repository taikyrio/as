import React, { useState } from 'react';
import { Character } from '../types/GameTypes';
import { Briefcase, Zap, Skull, Heart, GraduationCap, Users, Home, ArrowLeft, AlertTriangle } from 'lucide-react';

interface LifeActionsInterfaceProps {
  character: Character;
  onViewCareer: () => void;
  onViewCrime: () => void;
  onSuicide: () => void;
  onBack: () => void;
}

interface ActionOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: 'career' | 'crime' | 'health' | 'education' | 'relationships' | 'lifestyle' | 'danger';
  minAge?: number;
  onClick: () => void;
  danger?: boolean;
}

export const LifeActionsInterface: React.FC<LifeActionsInterfaceProps> = ({
  character,
  onViewCareer,
  onViewCrime,
  onSuicide,
  onBack
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSuicideConfirm, setShowSuicideConfirm] = useState(false);

  const actions: ActionOption[] = [
    // Career Actions
    {
      id: 'career',
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Career Center',
      description: 'Find a job, change careers, or advance your current position',
      category: 'career',
      minAge: 16,
      onClick: onViewCareer
    },
    
    // Crime Actions
    {
      id: 'crime',
      icon: <Zap className="w-6 h-6" />,
      title: 'Criminal Activities',
      description: 'Commit crimes for quick money (high risk, high reward)',
      category: 'crime',
      minAge: 12,
      onClick: onViewCrime,
      danger: true
    },

    // Health Actions
    {
      id: 'gym',
      icon: <Heart className="w-6 h-6" />,
      title: 'Go to Gym',
      description: 'Work out to improve your health and looks',
      category: 'health',
      minAge: 12,
      onClick: () => console.log('Gym action - to be implemented')
    },

    // Education Actions
    {
      id: 'education',
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Education',
      description: 'Attend school, college, or pursue higher education',
      category: 'education',
      minAge: 6,
      onClick: () => console.log('Education action - to be implemented')
    },

    // Relationship Actions
    {
      id: 'relationships',
      icon: <Users className="w-6 h-6" />,
      title: 'Relationships',
      description: 'Meet new people, date, or strengthen existing relationships',
      category: 'relationships',
      minAge: 13,
      onClick: () => console.log('Relationships action - to be implemented')
    },

    // Lifestyle Actions
    {
      id: 'real-estate',
      icon: <Home className="w-6 h-6" />,
      title: 'Real Estate',
      description: 'Buy or sell property, manage your assets',
      category: 'lifestyle',
      minAge: 18,
      onClick: () => console.log('Real Estate action - to be implemented')
    },

    // Danger Actions
    {
      id: 'suicide',
      icon: <Skull className="w-6 h-6" />,
      title: 'End Life',
      description: 'Give up on life and end the game permanently',
      category: 'danger',
      minAge: 10,
      onClick: () => setShowSuicideConfirm(true),
      danger: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Actions', icon: null },
    { id: 'career', label: 'Career', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'relationships', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <Home className="w-4 h-4" /> },
    { id: 'crime', label: 'Crime', icon: <Zap className="w-4 h-4" /> },
    { id: 'danger', label: 'Extreme', icon: <Skull className="w-4 h-4" /> }
  ];

  const filteredActions = selectedCategory === 'all' 
    ? actions 
    : actions.filter(action => action.category === selectedCategory);

  const availableActions = filteredActions.filter(action => 
    !action.minAge || character.age >= action.minAge
  );

  const handleSuicideConfirm = () => {
    setShowSuicideConfirm(false);
    onSuicide();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Life Actions</h1>
                <p className="text-white/70 mt-1">Choose what to do with your life</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">Age {character.age}</div>
              <div className="text-white/70 text-sm">{character.name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableActions.map((action) => (
            <div
              key={action.id}
              className={`relative bg-white/10 backdrop-blur-md rounded-xl p-6 border transition-all duration-300 hover:transform hover:scale-105 cursor-pointer ${
                action.danger 
                  ? 'border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10' 
                  : 'border-white/20 hover:border-white/30'
              }`}
              onClick={action.onClick}
            >
              {action.danger && (
                <div className="absolute top-2 right-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                action.danger 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {action.icon}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
              <p className="text-white/70 text-sm">{action.description}</p>
              
              {action.minAge && character.age < action.minAge && (
                <div className="mt-3 text-yellow-400 text-xs">
                  Available at age {action.minAge}
                </div>
              )}
            </div>
          ))}
        </div>

        {availableActions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg">No actions available for this category</div>
            <div className="text-white/40 text-sm mt-2">Try selecting a different category</div>
          </div>
        )}
      </div>

      {/* Suicide Confirmation Modal */}
      {showSuicideConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-red-500/30">
            <div className="text-center">
              <Skull className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">End Your Life?</h2>
              <p className="text-white/70 mb-6">
                This action is permanent and will end your game. Are you absolutely sure you want to do this?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuicideConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuicideConfirm}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  End Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};