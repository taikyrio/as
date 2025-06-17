import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Brain, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Home,
  Car,
  Plane,
  Gamepad2,
  Dumbbell,
  Book,
  Music,
  Camera,
  Palette,
  Coffee,
  ShoppingBag,
  Utensils,
  Film,
  MapPin,
  Smartphone,
  Headphones,
  Shirt,
  Gift,
  Calendar,
  Clock,
  X,
  AlertTriangle,
  Skull,
  PenTool,
  Scale
} from 'lucide-react';
import { Character } from '../types/GameTypes';

interface LifeActionsInterfaceProps {
  character: Character;
  gameEngine: any;
  onClose: () => void;
}

interface PrisonStatus {
  inPrison: boolean;
  prison?: string;
  yearsLeft?: number;
}

export const LifeActionsInterface: React.FC<LifeActionsInterfaceProps> = ({
  character,
  gameEngine,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  // Get prison status
  const prisonStatus: PrisonStatus = gameEngine.getPrisonStatus();

  const handleAction = (message: string) => {
    setModalContent({ title: 'Action Result', message });
    setShowModal(true);
  };

  const handleSuicide = () => {
    setModalContent({ title: 'Game Over', message: 'You have ended your life.' });
    setShowModal(true);
  };

  const allActions = [
    // Social Actions
    {
      id: 'make-friends',
      title: 'Make Friends',
      description: 'Meet new people and build relationships',
      category: 'social',
      icon: <Users className="w-6 h-6" />,
      onClick: () => handleAction('Made some new friends! Your social life is improving.')
    },
    {
      id: 'go-on-date',
      title: 'Go on a Date',
      description: 'Find love and romance',
      category: 'social',
      icon: <Heart className="w-6 h-6" />,
      minAge: 16,
      onClick: () => handleAction('Went on a date! Maybe this is the start of something special.')
    },
    {
      id: 'spend-time-family',
      title: 'Family Time',
      description: 'Strengthen your bond with your family',
      category: 'social',
      icon: <Home className="w-6 h-6" />,
      onClick: () => handleAction('Spent quality time with family. Your relationship is stronger.')
    },

    // Education Actions
    {
      id: 'study',
      title: 'Study',
      description: 'Improve your knowledge and skills',
      category: 'education',
      icon: <Book className="w-6 h-6" />,
      onClick: () => handleAction('Studied hard! Your intelligence has increased.')
    },
    {
      id: 'attend-university',
      title: 'Attend University',
      description: 'Get a higher education degree',
      category: 'education',
      icon: <GraduationCap className="w-6 h-6" />,
      minAge: 18,
      onClick: () => handleAction('Enrolled in university! Your future looks bright.')
    },
    {
      id: 'learn-skill',
      title: 'Learn a Skill',
      description: 'Acquire a new skill or hobby',
      category: 'education',
      icon: <Brain className="w-6 h-6" />,
      onClick: () => handleAction('Learned a new skill! Your versatility is improving.')
    },

    // Career Actions
    {
      id: 'find-job',
      title: 'Find a Job',
      description: 'Search for employment opportunities',
      category: 'career',
      icon: <Briefcase className="w-6 h-6" />,
      minAge: 16,
      onClick: () => handleAction('Found a new job! Time to start earning.')
    },
    {
      id: 'work-hard',
      title: 'Work Hard',
      description: 'Put in extra effort at your job',
      category: 'career',
      icon: <Dumbbell className="w-6 h-6" />,
      minAge: 16,
      onClick: () => handleAction('Worked extra hard! A promotion might be coming.')
    },
    {
      id: 'start-business',
      title: 'Start a Business',
      description: 'Become an entrepreneur and run your own company',
      category: 'career',
      icon: <Briefcase className="w-6 h-6" />,
      minAge: 22,
      onClick: () => handleAction('Started a new business! The road to success begins.')
    },

    // Health Actions
    {
      id: 'exercise',
      title: 'Exercise',
      description: 'Improve your physical fitness',
      category: 'health',
      icon: <Dumbbell className="w-6 h-6" />,
      onClick: () => handleAction('Exercised regularly! Your health is improving.')
    },
    {
      id: 'meditate',
      title: 'Meditate',
      description: 'Relax your mind and reduce stress',
      category: 'health',
      icon: <Brain className="w-6 h-6" />,
      onClick: () => handleAction('Meditated and relaxed. Your mental health is improving.')
    },
    {
      id: 'doctor-visit',
      title: 'Visit Doctor',
      description: 'Get a medical checkup',
      category: 'health',
      icon: <Heart className="w-6 h-6" />,
      onClick: () => handleAction('Visited the doctor. You are in good health!')
    },

    // Entertainment Actions
    {
      id: 'watch-movie',
      title: 'Watch a Movie',
      description: 'Enjoy a film at the cinema or at home',
      category: 'entertainment',
      icon: <Film className="w-6 h-6" />,
      onClick: () => handleAction('Watched a great movie! Entertainment levels increased.')
    },
    {
      id: 'play-games',
      title: 'Play Games',
      description: 'Have fun with video games or board games',
      category: 'entertainment',
      icon: <Gamepad2 className="w-6 h-6" />,
      onClick: () => handleAction('Played some fun games! Happiness increased.')
    },
    {
      id: 'listen-music',
      title: 'Listen to Music',
      description: 'Enjoy your favorite tunes',
      category: 'entertainment',
      icon: <Music className="w-6 h-6" />,
      onClick: () => handleAction('Listened to music. Feeling relaxed and happy.')
    },

    // Shopping Actions
    {
      id: 'buy-clothes',
      title: 'Buy Clothes',
      description: 'Update your wardrobe with new outfits',
      category: 'shopping',
      icon: <Shirt className="w-6 h-6" />,
      onClick: () => handleAction('Bought some new clothes! Looking stylish.')
    },
    {
      id: 'buy-gadget',
      title: 'Buy Gadget',
      description: 'Purchase the latest technology',
      category: 'shopping',
      icon: <Smartphone className="w-6 h-6" />,
      onClick: () => handleAction('Bought a new gadget! Tech levels increased.')
    },
    {
      id: 'buy-gift',
      title: 'Buy Gift',
      description: 'Purchase a gift for someone special',
      category: 'shopping',
      icon: <Gift className="w-6 h-6" />,
      onClick: () => handleAction('Bought a gift for someone. Relationship improved.')
    },

    // Travel Actions
    {
      id: 'go-vacation',
      title: 'Go on Vacation',
      description: 'Travel to a new destination',
      category: 'travel',
      icon: <Plane className="w-6 h-6" />,
      minAge: 18,
      onClick: () => handleAction('Went on vacation! Feeling refreshed.')
    },
    {
      id: 'road-trip',
      title: 'Road Trip',
      description: 'Take a journey by car',
      category: 'travel',
      icon: <Car className="w-6 h-6" />,
      minAge: 18,
      onClick: () => handleAction('Took a road trip! New adventures await.')
    },
    {
      id: 'explore-city',
      title: 'Explore City',
      description: 'Discover your city',
      category: 'travel',
      icon: <MapPin className="w-6 h-6" />,
      onClick: () => handleAction('Explored the city. Discovered new places.')
    },

    // Dangerous Actions
    {
      id: 'suicide',
      title: 'End It All',
      description: 'Take your own life (irreversible)',
      category: 'dangerous',
      icon: <Skull className="w-6 h-6" />,
      danger: true,
      onClick: handleSuicide
    },

    // Prison-specific actions
    {
      id: 'prison-job',
      title: 'Prison Work',
      description: 'Take on a job within the prison system',
      category: 'career',
      icon: <Briefcase className="w-6 h-6" />,
      onClick: () => handleAction('Prison work - limited options available while incarcerated')
    },
    {
      id: 'prison-education',
      title: 'Prison Education',
      description: 'Attend educational programs in prison',
      category: 'education',
      icon: <GraduationCap className="w-6 h-6" />,
      onClick: () => handleAction('Prison education programs - basic education available')
    },
    {
      id: 'write-letters',
      title: 'Write Letters',
      description: 'Maintain contact with family and friends',
      category: 'social',
      icon: <PenTool className="w-6 h-6" />,
      onClick: () => handleAction('Writing letters to maintain relationships outside')
    },
    {
      id: 'appeals',
      title: 'Legal Appeals',
      description: 'Work on appealing your sentence',
      category: 'legal',
      icon: <Scale className="w-6 h-6" />,
      onClick: () => handleAction('Working on legal appeals - to be implemented')
    },
    {
      id: 'therapy',
      title: 'Prison Therapy',
      description: 'Attend rehabilitation programs',
      category: 'health',
      icon: <Heart className="w-6 h-6" />,
      onClick: () => handleAction('Attending prison therapy and rehabilitation programs')
    }
  ];

  const categories = [
    { id: 'all', name: 'All Actions', icon: <Calendar className="w-4 h-4" /> },
    { id: 'social', name: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'career', name: 'Career', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'health', name: 'Health', icon: <Heart className="w-4 h-4" /> },
    { id: 'entertainment', name: 'Fun', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'shopping', name: 'Shopping', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'travel', name: 'Travel', icon: <Plane className="w-4 h-4" /> },
    { id: 'legal', name: 'Legal', icon: <Scale className="w-4 h-4" /> },
    { id: 'dangerous', name: 'Risky', icon: <AlertTriangle className="w-4 h-4" /> }
  ];

  const availableActions = useMemo(() => {
    return allActions.filter(action => {
      // Age restrictions
      if (action.minAge && character.age < action.minAge) return false;
      if (action.maxAge && character.age > action.maxAge) return false;

      // Category filter
      if (selectedCategory !== 'all' && action.category !== selectedCategory) return false;

      // Prison restrictions
      if (prisonStatus.inPrison) {
        const allowedInPrison = [
          'exercise', 'read', 'meditate', 'prison-job', 'prison-education',
          'write-letters', 'appeals', 'therapy', 'suicide'
        ];
        if (!allowedInPrison.includes(action.id)) return false;
      }

      return true;
    });
  }, [character.age, selectedCategory, prisonStatus.inPrison]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Life Actions</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Prison Status */}
          {prisonStatus.inPrison && (
            <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-red-300 font-bold">Currently Incarcerated</h3>
                  <p className="text-red-200 text-sm">
                    Imprisoned at {prisonStatus.prison} - {prisonStatus.yearsLeft} years remaining
                  </p>
                  <p className="text-red-200/80 text-xs mt-1">
                    Your actions are limited while in prison. Focus on rehabilitation and personal growth.
                  </p>
                </div>
              </div>
            </div>
          )}
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
              {category.name}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">{modalContent.title}</h2>
            <p className="text-white/70 mb-6">{modalContent.message}</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};