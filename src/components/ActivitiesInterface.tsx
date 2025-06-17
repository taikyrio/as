
import React, { useState } from 'react';
import { Character } from '../types/GameTypes';
import { 
  GraduationCap, 
  Heart, 
  Home, 
  Car, 
  Plane,
  Dumbbell,
  Book,
  Users,
  ArrowLeft,
  DollarSign,
  MapPin
} from 'lucide-react';

interface ActivitiesInterfaceProps {
  character: Character;
  onBack: () => void;
  gameEngine: any;
  onGameStateChange: () => void;
}

export const ActivitiesInterface: React.FC<ActivitiesInterfaceProps> = ({
  character,
  onBack,
  gameEngine,
  onGameStateChange
}) => {
  const [activeCategory, setActiveCategory] = useState<'education' | 'relationships' | 'property' | 'lifestyle'>('education');
  const [message, setMessage] = useState('');

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEducation = (type: string, field: string) => {
    const result = gameEngine.enrollInEducation(type, field);
    showMessage(result.message);
    if (result.success) onGameStateChange();
  };

  const handleRelationship = (type: 'friend' | 'romantic' | 'family') => {
    const result = gameEngine.startRelationship(type);
    showMessage(result.message);
    if (result.success) onGameStateChange();
  };

  const handleProperty = (type: string) => {
    const result = gameEngine.buyProperty(type);
    showMessage(result.message);
    if (result.success) onGameStateChange();
  };

  const ActivityCard = ({ icon, title, description, cost, onClick, disabled = false }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
        disabled 
          ? 'bg-gray-600 opacity-50 cursor-not-allowed'
          : 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-105'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-white text-2xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
          <p className="text-gray-200 text-sm mb-2">{description}</p>
          {cost > 0 && (
            <div className="flex items-center gap-1 text-green-300">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">{cost.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Life Activities</h1>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-400 rounded-lg">
            <p className="text-blue-200 text-sm">{message}</p>
          </div>
        )}

        {/* Categories */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { id: 'education', icon: <GraduationCap className="w-5 h-5" />, label: 'Education' },
            { id: 'relationships', icon: <Heart className="w-5 h-5" />, label: 'Relations' },
            { id: 'property', icon: <Home className="w-5 h-5" />, label: 'Property' },
            { id: 'lifestyle', icon: <Dumbbell className="w-5 h-5" />, label: 'Lifestyle' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {cat.icon}
              <span className="text-xs">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeCategory === 'education' && (
            <>
              <h2 className="text-xl font-bold text-white mb-4">Education & Learning</h2>
              
              {character.age >= 5 && (
                <ActivityCard
                  icon={<GraduationCap className="w-6 h-6" />}
                  title="Primary School"
                  description="Basic education and literacy"
                  cost={0}
                  onClick={() => handleEducation('Primary School', 'General Studies')}
                  disabled={character.education.some(e => e.degree === 'Primary School')}
                />
              )}

              {character.age >= 14 && (
                <ActivityCard
                  icon={<Book className="w-6 h-6" />}
                  title="High School"
                  description="Secondary education and college prep"
                  cost={0}
                  onClick={() => handleEducation('High School', 'General Studies')}
                  disabled={character.education.some(e => e.degree === 'High School')}
                />
              )}

              {character.age >= 16 && (
                <ActivityCard
                  icon={<Car className="w-6 h-6" />}
                  title="Trade School"
                  description="Learn practical skills for immediate employment"
                  cost={15000}
                  onClick={() => handleEducation('Trade School', 'Technical Skills')}
                />
              )}

              {character.age >= 17 && (
                <ActivityCard
                  icon={<GraduationCap className="w-6 h-6" />}
                  title="University"
                  description="4-year degree program"
                  cost={60000}
                  onClick={() => handleEducation('University', 'Liberal Arts')}
                />
              )}

              {character.age >= 22 && character.education.some(e => e.degree === 'University' && e.completed) && (
                <ActivityCard
                  icon={<Book className="w-6 h-6" />}
                  title="Graduate School"
                  description="Advanced degree and specialization"
                  cost={80000}
                  onClick={() => handleEducation('Graduate School', 'Advanced Studies')}
                />
              )}
            </>
          )}

          {activeCategory === 'relationships' && (
            <>
              <h2 className="text-xl font-bold text-white mb-4">Relationships</h2>
              
              <ActivityCard
                icon={<Users className="w-6 h-6" />}
                title="Make Friends"
                description="Meet new people and build friendships"
                cost={0}
                onClick={() => handleRelationship('friend')}
              />

              {character.age >= 13 && (
                <ActivityCard
                  icon={<Heart className="w-6 h-6" />}
                  title="Start Dating"
                  description="Look for romantic relationships"
                  cost={0}
                  onClick={() => handleRelationship('romantic')}
                />
              )}

              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Current Relationships</h3>
                {character.relationships.length === 0 ? (
                  <p className="text-gray-400 text-sm">No relationships yet</p>
                ) : (
                  <div className="space-y-2">
                    {character.relationships.slice(0, 5).map((rel) => (
                      <div key={rel.id} className="flex justify-between items-center text-sm">
                        <span className="text-white">{rel.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rel.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {rel.type} - {rel.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeCategory === 'property' && (
            <>
              <h2 className="text-xl font-bold text-white mb-4">Real Estate</h2>
              
              <ActivityCard
                icon={<Home className="w-6 h-6" />}
                title="Small Apartment"
                description="Affordable first home"
                cost={150000}
                onClick={() => handleProperty('Small Apartment')}
              />

              <ActivityCard
                icon={<Home className="w-6 h-6" />}
                title="Large Apartment"
                description="Spacious city living"
                cost={300000}
                onClick={() => handleProperty('Large Apartment')}
              />

              <ActivityCard
                icon={<Home className="w-6 h-6" />}
                title="Small House"
                description="Your own house with a yard"
                cost={400000}
                onClick={() => handleProperty('Small House')}
              />

              <ActivityCard
                icon={<Home className="w-6 h-6" />}
                title="Large House"
                description="Spacious family home"
                cost={800000}
                onClick={() => handleProperty('Large House')}
              />

              <ActivityCard
                icon={<Home className="w-6 h-6" />}
                title="Mansion"
                description="Luxury living at its finest"
                cost={2000000}
                onClick={() => handleProperty('Mansion')}
              />

              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Your Properties</h3>
                {character.properties.length === 0 ? (
                  <p className="text-gray-400 text-sm">No properties owned</p>
                ) : (
                  <div className="space-y-2">
                    {character.properties.map((prop) => (
                      <div key={prop.id} className="flex justify-between items-center text-sm">
                        <span className="text-white">{prop.name}</span>
                        <span className="text-green-300">${prop.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeCategory === 'lifestyle' && (
            <>
              <h2 className="text-xl font-bold text-white mb-4">Lifestyle & Health</h2>
              
              <ActivityCard
                icon={<Dumbbell className="w-6 h-6" />}
                title="Join Gym"
                description="Improve your fitness and health"
                cost={1200}
                onClick={() => {
                  if (character.bankAccount.balance >= 1200) {
                    character.bankAccount.balance -= 1200;
                    character.stats.health = Math.min(100, character.stats.health + 15);
                    character.stats.looks = Math.min(100, character.stats.looks + 10);
                    gameEngine.addLifeEvent({
                      id: Date.now().toString(),
                      title: 'Joined Gym',
                      description: 'You started a fitness routine!',
                      year: character.age,
                      impact: { health: 15, looks: 10 }
                    });
                    showMessage('You joined a gym and feel healthier!');
                    onGameStateChange();
                  } else {
                    showMessage('Not enough money for gym membership');
                  }
                }}
              />

              <ActivityCard
                icon={<Plane className="w-6 h-6" />}
                title="Take Vacation"
                description="Travel and relax to boost happiness"
                cost={5000}
                onClick={() => {
                  if (character.bankAccount.balance >= 5000) {
                    character.bankAccount.balance -= 5000;
                    character.stats.happiness = Math.min(100, character.stats.happiness + 20);
                    gameEngine.addLifeEvent({
                      id: Date.now().toString(),
                      title: 'Vacation',
                      description: 'You took a wonderful vacation!',
                      year: character.age,
                      impact: { happiness: 20 }
                    });
                    showMessage('You had an amazing vacation!');
                    onGameStateChange();
                  } else {
                    showMessage('Not enough money for vacation');
                  }
                }}
              />

              <ActivityCard
                icon={<Book className="w-6 h-6" />}
                title="Read Books"
                description="Expand your knowledge and intelligence"
                cost={100}
                onClick={() => {
                  if (character.bankAccount.balance >= 100) {
                    character.bankAccount.balance -= 100;
                    character.stats.intelligence = Math.min(100, character.stats.intelligence + 5);
                    gameEngine.addLifeEvent({
                      id: Date.now().toString(),
                      title: 'Self-Study',
                      description: 'You spent time reading and learning!',
                      year: character.age,
                      impact: { intelligence: 5 }
                    });
                    showMessage('You feel smarter after reading!');
                    onGameStateChange();
                  } else {
                    showMessage('Not enough money for books');
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
