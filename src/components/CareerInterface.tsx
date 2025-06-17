import React, { useState } from 'react';
import { Character, CareerPath } from '../types/GameTypes';
import { Briefcase, DollarSign, TrendingUp, Shield, Zap, Star, ArrowLeft } from 'lucide-react';

interface CareerInterfaceProps {
  character: Character;
  careers: CareerPath[];
  onApplyForJob: (careerId: string) => any;
  onBack: () => void;
}

export const CareerInterface: React.FC<CareerInterfaceProps> = ({
  character,
  careers,
  onApplyForJob,
  onBack
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [applicationResult, setApplicationResult] = useState<any>(null);

  const categories = ['all', ...Array.from(new Set(careers.map(career => career.category)))];

  const filteredCareers = selectedCategory === 'all' 
    ? careers 
    : careers.filter(career => career.category === selectedCategory);

  const handleApply = (careerId: string) => {
    const result = onApplyForJob(careerId);
    setApplicationResult(result);
    setTimeout(() => setApplicationResult(null), 5000);
  };

  const getJobRequirements = (career: CareerPath) => {
    const requirements = [];
    if (career.educationRequired.length > 0) {
      requirements.push(`Education: ${career.educationRequired.join(', ')}`);
    }
    return requirements;
  };

  const canApplyForJob = (career: CareerPath) => {
    if (character.age < 16) return false;
    if (character.career && character.career.id === career.id) return false;
    
    // Check education requirements
    if (career.educationRequired.length > 0) {
      const hasRequiredEducation = career.educationRequired.some(req => 
        character.education.some(edu => 
          edu.degree.toLowerCase().includes(req.toLowerCase()) || 
          edu.field.toLowerCase().includes(req.toLowerCase())
        )
      );
      if (!hasRequiredEducation && career.educationRequired[0] !== 'None') return false;
    }
    
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
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
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-blue-400" />
                  Career Center
                </h1>
                <p className="text-white/70 mt-1">Find your dream job and build your career</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">Age {character.age}</div>
              <div className="text-white/70 text-sm">
                {character.career ? `${character.career.title} at ${character.career.company}` : 'Unemployed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Job Status */}
      {character.career && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              Current Position
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-white/70 text-sm">Position</div>
                <div className="text-white font-semibold">{character.career.title}</div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Company</div>
                <div className="text-white font-semibold">{character.career.company}</div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Annual Salary</div>
                <div className="text-green-400 font-bold">${character.career.salary.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Experience</div>
                <div className="text-white font-semibold">{character.career.experience} years</div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Level</div>
                <div className="text-white font-semibold">Level {character.career.level}</div>
              </div>
              <div>
                <div className="text-white/70 text-sm">Started</div>
                <div className="text-white font-semibold">{character.career.startYear}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Result */}
      {applicationResult && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className={`p-4 rounded-xl border ${
            applicationResult.success 
              ? 'bg-green-500/20 border-green-500/30 text-green-100' 
              : 'bg-red-500/20 border-red-500/30 text-red-100'
          }`}>
            <div className="font-semibold">{applicationResult.message}</div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category === 'all' ? 'All Jobs' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Career Listings */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="grid gap-4">
          {filteredCareers.map((career) => {
            const canApply = canApplyForJob(career);
            const requirements = getJobRequirements(career);

            return (
              <div
                key={career.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{career.name}</h3>
                    <p className="text-white/70 capitalize">{career.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-lg">
                      ${career.baseSalary.toLocaleString()}/year
                    </div>
                    <div className="text-white/70 text-sm">Starting salary</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-white/70 text-sm">Growth: {career.salaryGrowth}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white/70 text-sm">Security: {career.jobSecurity}/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/70 text-sm">Stress: {career.stress}/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-400" />
                    <span className="text-white/70 text-sm">Prestige: {career.prestige}/10</span>
                  </div>
                </div>

                {requirements.length > 0 && (
                  <div className="mb-4">
                    <div className="text-white/70 text-sm mb-2">Requirements:</div>
                    <div className="text-white/80 text-sm">
                      {requirements.join(' • ')}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleApply(career.id)}
                  disabled={!canApply}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    canApply
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {character.career && character.career.id === career.id 
                    ? 'Current Job' 
                    : canApply 
                      ? 'Apply Now' 
                      : character.age < 16 
                        ? 'Too Young' 
                        : 'Requirements Not Met'
                  }
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};