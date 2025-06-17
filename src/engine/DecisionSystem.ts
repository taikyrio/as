import { Character, LifeEvent } from '../types/GameTypes';

export interface Decision {
  id: string;
  title: string;
  description: string;
  options: DecisionOption[];
  timeLimit?: number;
  category: 'life' | 'career' | 'relationship' | 'health' | 'education';
  ageRange: [number, number];
  requirements?: {
    intelligence?: number;
    health?: number;
    looks?: number;
    happiness?: number;
    money?: number;
  };
}

export interface DecisionOption {
  id: string;
  text: string;
  description: string;
  consequences: {
    immediate: string;
    longTerm: string;
  };
  statChanges: {
    health?: number;
    intelligence?: number;
    looks?: number;
    happiness?: number;
  };
  moneyChange?: number;
  riskLevel: 'low' | 'medium' | 'high';
  probability: number; // 0-100, chance this option succeeds as expected
}

export class DecisionSystem {
  private decisions: Decision[] = [
    // Early Childhood (0-5)
    {
      id: 'first-pet',
      title: 'Your First Pet',
      description: 'Your parents are considering getting you a pet. What kind would you prefer?',
      category: 'life',
      ageRange: [3, 6],
      options: [
        {
          id: 'dog',
          text: 'A loyal dog',
          description: 'Dogs are great companions and teach responsibility',
          consequences: {
            immediate: 'You get a playful puppy that becomes your best friend',
            longTerm: 'You develop strong empathy and responsibility skills'
          },
          statChanges: { happiness: 15, health: 5 },
          riskLevel: 'low',
          probability: 90
        },
        {
          id: 'cat',
          text: 'An independent cat',
          description: 'Cats are low-maintenance and affectionate',
          consequences: {
            immediate: 'You get a cuddly kitten that loves to play',
            longTerm: 'You become more independent and observant'
          },
          statChanges: { happiness: 10, intelligence: 3 },
          riskLevel: 'low',
          probability: 95
        },
        {
          id: 'no-pet',
          text: 'No pet for now',
          description: 'Maybe when you\'re older and more responsible',
          consequences: {
            immediate: 'You focus on other activities and hobbies',
            longTerm: 'You have more time for personal development'
          },
          statChanges: { intelligence: 5 },
          riskLevel: 'low',
          probability: 100
        }
      ]
    },

    // School Years (6-18)
    {
      id: 'school-bully',
      title: 'Dealing with a Bully',
      description: 'A classmate has been picking on you at school. How do you handle this situation?',
      category: 'life',
      ageRange: [8, 16],
      options: [
        {
          id: 'tell-teacher',
          text: 'Tell a teacher',
          description: 'Report the bullying to school authorities',
          consequences: {
            immediate: 'The teacher talks to the bully and it stops',
            longTerm: 'You learn to seek help when needed'
          },
          statChanges: { happiness: 10, intelligence: 5 },
          riskLevel: 'low',
          probability: 80
        },
        {
          id: 'stand-up',
          text: 'Stand up to them',
          description: 'Confront the bully directly',
          consequences: {
            immediate: 'You get into a fight but earn respect',
            longTerm: 'You become more confident but potentially aggressive'
          },
          statChanges: { happiness: 5, health: -5, looks: -3 },
          riskLevel: 'high',
          probability: 60
        },
        {
          id: 'ignore',
          text: 'Ignore them',
          description: 'Try to avoid the bully and hope it stops',
          consequences: {
            immediate: 'The bullying continues but you avoid confrontation',
            longTerm: 'You may develop anxiety but also patience'
          },
          statChanges: { happiness: -5, intelligence: 3 },
          riskLevel: 'medium',
          probability: 70
        }
      ]
    },

    {
      id: 'study-choice',
      title: 'Study Habits',
      description: 'Exams are coming up. How do you prepare?',
      category: 'education',
      ageRange: [10, 18],
      options: [
        {
          id: 'study-hard',
          text: 'Study intensively',
          description: 'Spend most of your free time studying',
          consequences: {
            immediate: 'You get excellent grades but feel stressed',
            longTerm: 'Strong academic foundation but potential burnout'
          },
          statChanges: { intelligence: 10, happiness: -5, health: -3 },
          riskLevel: 'medium',
          probability: 85
        },
        {
          id: 'balanced',
          text: 'Balanced approach',
          description: 'Study regularly but maintain social life',
          consequences: {
            immediate: 'You get good grades and stay happy',
            longTerm: 'Well-rounded development and good time management'
          },
          statChanges: { intelligence: 7, happiness: 5 },
          riskLevel: 'low',
          probability: 90
        },
        {
          id: 'minimal',
          text: 'Minimal studying',
          description: 'Focus on social activities instead',
          consequences: {
            immediate: 'You have fun but get poor grades',
            longTerm: 'Strong social skills but academic struggles'
          },
          statChanges: { happiness: 10, intelligence: -5, looks: 3 },
          riskLevel: 'high',
          probability: 75
        }
      ]
    },

    // Young Adult (18-25)
    {
      id: 'college-choice',
      title: 'Higher Education Decision',
      description: 'You\'ve graduated high school. What\'s your next step?',
      category: 'education',
      ageRange: [17, 19],
      requirements: { intelligence: 60 },
      options: [
        {
          id: 'university',
          text: 'Go to university',
          description: 'Pursue a 4-year degree',
          consequences: {
            immediate: 'You start college and meet new people',
            longTerm: 'Better career prospects but student debt'
          },
          statChanges: { intelligence: 15, happiness: 10 },
          moneyChange: -50000,
          riskLevel: 'medium',
          probability: 80
        },
        {
          id: 'trade-school',
          text: 'Attend trade school',
          description: 'Learn a practical skill',
          consequences: {
            immediate: 'You quickly gain marketable skills',
            longTerm: 'Stable income but limited advancement'
          },
          statChanges: { intelligence: 8, health: 5 },
          moneyChange: -15000,
          riskLevel: 'low',
          probability: 90
        },
        {
          id: 'work',
          text: 'Start working',
          description: 'Enter the workforce immediately',
          consequences: {
            immediate: 'You start earning money right away',
            longTerm: 'Early financial independence but limited growth'
          },
          statChanges: { happiness: 5 },
          moneyChange: 20000,
          riskLevel: 'medium',
          probability: 85
        }
      ]
    },

    // Career Decisions
    {
      id: 'job-offer',
      title: 'Job Opportunity',
      description: 'You\'ve received two job offers. Which one do you choose?',
      category: 'career',
      ageRange: [22, 35],
      options: [
        {
          id: 'high-pay',
          text: 'High-paying corporate job',
          description: 'Great salary but long hours and high stress',
          consequences: {
            immediate: 'You earn a lot of money but work 60+ hours per week',
            longTerm: 'Financial success but potential health issues'
          },
          statChanges: { happiness: -10, health: -15, intelligence: 5 },
          moneyChange: 80000,
          riskLevel: 'high',
          probability: 75
        },
        {
          id: 'passion',
          text: 'Lower-paying dream job',
          description: 'Work you love but modest salary',
          consequences: {
            immediate: 'You love going to work every day',
            longTerm: 'High job satisfaction but financial constraints'
          },
          statChanges: { happiness: 20, intelligence: 8 },
          moneyChange: 35000,
          riskLevel: 'low',
          probability: 90
        },
        {
          id: 'balanced',
          text: 'Balanced position',
          description: 'Decent pay with good work-life balance',
          consequences: {
            immediate: 'You have a stable job with reasonable hours',
            longTerm: 'Steady career growth and personal time'
          },
          statChanges: { happiness: 10, health: 5, intelligence: 5 },
          moneyChange: 55000,
          riskLevel: 'low',
          probability: 85
        }
      ]
    },

    // Relationship Decisions
    {
      id: 'first-love',
      title: 'First Serious Relationship',
      description: 'You\'ve met someone special. How do you approach this relationship?',
      category: 'relationship',
      ageRange: [16, 25],
      requirements: { looks: 40 },
      options: [
        {
          id: 'all-in',
          text: 'Give it your all',
          description: 'Invest deeply in the relationship',
          consequences: {
            immediate: 'You experience intense love and happiness',
            longTerm: 'Either a lasting relationship or devastating heartbreak'
          },
          statChanges: { happiness: 25, health: 5 },
          riskLevel: 'high',
          probability: 60
        },
        {
          id: 'cautious',
          text: 'Take it slow',
          description: 'Build the relationship gradually',
          consequences: {
            immediate: 'You develop a stable, healthy relationship',
            longTerm: 'Strong foundation for long-term success'
          },
          statChanges: { happiness: 15, intelligence: 5 },
          riskLevel: 'low',
          probability: 80
        },
        {
          id: 'casual',
          text: 'Keep it casual',
          description: 'Don\'t get too attached',
          consequences: {
            immediate: 'You maintain your independence',
            longTerm: 'Freedom but potential regret about missed opportunity'
          },
          statChanges: { happiness: 5, looks: 3 },
          riskLevel: 'medium',
          probability: 75
        }
      ]
    },

    // Health Decisions
    {
      id: 'fitness-choice',
      title: 'Health and Fitness',
      description: 'You want to improve your health. What approach do you take?',
      category: 'health',
      ageRange: [16, 60],
      options: [
        {
          id: 'gym',
          text: 'Join a gym',
          description: 'Regular structured workouts',
          consequences: {
            immediate: 'You start a consistent workout routine',
            longTerm: 'Significant improvement in fitness and appearance'
          },
          statChanges: { health: 20, looks: 15, happiness: 10 },
          moneyChange: -1200,
          riskLevel: 'low',
          probability: 70
        },
        {
          id: 'sports',
          text: 'Join a sports team',
          description: 'Social fitness through team sports',
          consequences: {
            immediate: 'You make new friends while getting fit',
            longTerm: 'Great fitness and social connections'
          },
          statChanges: { health: 15, happiness: 15, looks: 10 },
          riskLevel: 'medium',
          probability: 80
        },
        {
          id: 'home',
          text: 'Work out at home',
          description: 'Self-directed fitness routine',
          consequences: {
            immediate: 'You start exercising but struggle with consistency',
            longTerm: 'Moderate improvement if you stick with it'
          },
          statChanges: { health: 8, looks: 5 },
          riskLevel: 'high',
          probability: 50
        }
      ]
    }
  ];

  generateDecisionForAge(character: Character): Decision | null {
    const availableDecisions = this.decisions.filter(decision => 
      character.age >= decision.ageRange[0] && 
      character.age <= decision.ageRange[1] &&
      this.meetsRequirements(character, decision)
    );

    if (availableDecisions.length === 0) return null;

    // Random chance of getting a decision (30% per age up)
    if (Math.random() > 0.3) return null;

    return availableDecisions[Math.floor(Math.random() * availableDecisions.length)];
  }

  private meetsRequirements(character: Character, decision: Decision): boolean {
    if (!decision.requirements) return true;

    const req = decision.requirements;
    const stats = character.stats;

    if (req.intelligence && stats.intelligence < req.intelligence) return false;
    if (req.health && stats.health < req.health) return false;
    if (req.looks && stats.looks < req.looks) return false;
    if (req.happiness && stats.happiness < req.happiness) return false;
    if (req.money && character.bankAccount.balance < req.money) return false;

    return true;
  }

  processDecision(character: Character, decision: Decision, optionId: string): LifeEvent {
    const option = decision.options.find(opt => opt.id === optionId);
    if (!option) {
      throw new Error('Invalid option selected');
    }

    // Determine if the decision succeeds based on probability
    const success = Math.random() * 100 < option.probability;
    
    // Apply stat changes
    if (success) {
      Object.entries(option.statChanges).forEach(([stat, value]) => {
        if (value) {
          const currentValue = character.stats[stat as keyof typeof character.stats];
          character.stats[stat as keyof typeof character.stats] = 
            Math.max(0, Math.min(100, currentValue + value));
        }
      });

      // Apply money changes
      if (option.moneyChange) {
        character.bankAccount.balance += option.moneyChange;
      }
    }

    // Create life event
    const lifeEvent: LifeEvent = {
      id: Date.now().toString(),
      title: `Decision: ${decision.title}`,
      description: success ? option.consequences.immediate : `Your decision didn't go as planned: ${option.text}`,
      year: character.age,
      impact: success ? option.statChanges : {}
    };

    return lifeEvent;
  }
}