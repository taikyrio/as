import { Character, LifeEvent } from '../types/GameTypes';

export class EventSystem {
  private events: EventTemplate[] = [
    // Childhood events (0-12)
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'You took your first steps!',
      ageRange: [1, 1],
      probability: 100,
      impact: { happiness: 5 }
    },
    {
      id: 'first-word',
      title: 'First Word',
      description: 'You spoke your first word: "Mama"!',
      ageRange: [1, 2],
      probability: 100,
      impact: { intelligence: 3, happiness: 5 }
    },
    {
      id: 'lost-tooth',
      title: 'Lost First Tooth',
      description: 'You lost your first tooth and the tooth fairy visited!',
      ageRange: [5, 7],
      probability: 80,
      impact: { happiness: 8 }
    },
    {
      id: 'school-start',
      title: 'Started School',
      description: 'You started elementary school and made new friends!',
      ageRange: [5, 6],
      probability: 95,
      impact: { intelligence: 10, happiness: 5 }
    },
    {
      id: 'good-grades',
      title: 'Excellent Grades',
      description: 'You received excellent grades this year!',
      ageRange: [6, 18],
      probability: 30,
      requirements: { intelligence: 70 },
      impact: { intelligence: 5, happiness: 10 }
    },
    {
      id: 'bad-grades',
      title: 'Poor Grades',
      description: 'Your grades were disappointing this year.',
      ageRange: [6, 18],
      probability: 25,
      requirements: { intelligence: 50, maxIntelligence: 60 },
      impact: { happiness: -10, intelligence: -2 }
    },
    
    // Teen events (13-17)
    {
      id: 'first-job',
      title: 'First Part-Time Job',
      description: 'You got your first part-time job at a local store!',
      ageRange: [14, 16],
      probability: 40,
      impact: { happiness: 15 },
      money: 200
    },
    {
      id: 'driving-license',
      title: 'Got Driving License',
      description: 'You passed your driving test and got your license!',
      ageRange: [16, 18],
      probability: 70,
      impact: { happiness: 20, looks: 5 }
    },
    {
      id: 'prom',
      title: 'Went to Prom',
      description: 'You had an amazing time at your high school prom!',
      ageRange: [17, 18],
      probability: 60,
      requirements: { looks: 50 },
      impact: { happiness: 25, looks: 3 }
    },
    {
      id: 'graduation',
      title: 'High School Graduation',
      description: 'You graduated from high school!',
      ageRange: [17, 18],
      probability: 85,
      impact: { intelligence: 10, happiness: 20 }
    },
    
    // Young adult events (18-30)
    {
      id: 'college-acceptance',
      title: 'Accepted to College',
      description: 'You were accepted to your dream college!',
      ageRange: [18, 19],
      probability: 50,
      requirements: { intelligence: 70 },
      impact: { intelligence: 15, happiness: 30 }
    },
    {
      id: 'first-love',
      title: 'First Love',
      description: 'You fell in love for the first time!',
      ageRange: [16, 25],
      probability: 60,
      requirements: { looks: 40 },
      impact: { happiness: 30, looks: 5 }
    },
    {
      id: 'heartbreak',
      title: 'Heartbreak',
      description: 'Your relationship ended and you\'re heartbroken.',
      ageRange: [16, 40],
      probability: 35,
      impact: { happiness: -25, health: -5 }
    },
    {
      id: 'job-promotion',
      title: 'Job Promotion',
      description: 'You received a promotion at work!',
      ageRange: [22, 65],
      probability: 25,
      requirements: { intelligence: 60 },
      impact: { happiness: 20, intelligence: 3 },
      money: 5000
    },
    
    // Mid-life events (30-50)
    {
      id: 'marriage',
      title: 'Got Married',
      description: 'You got married to the love of your life!',
      ageRange: [22, 40],
      probability: 40,
      requirements: { happiness: 60, looks: 50 },
      impact: { happiness: 40 }
    },
    {
      id: 'first-child',
      title: 'First Child Born',
      description: 'Your first child was born! You\'re now a parent.',
      ageRange: [20, 45],
      probability: 30,
      requirements: { happiness: 60 },
      impact: { happiness: 50, health: -10 },
      money: -2000
    },
    {
      id: 'house-purchase',
      title: 'Bought First House',
      description: 'You purchased your first home!',
      ageRange: [25, 50],
      probability: 35,
      requirements: { money: 50000 },
      impact: { happiness: 30 },
      money: -100000
    },
    
    // Health events
    {
      id: 'flu',
      title: 'Got the Flu',
      description: 'You came down with a bad case of the flu.',
      ageRange: [3, 80],
      probability: 15,
      impact: { health: -15, happiness: -10 }
    },
    {
      id: 'injury',
      title: 'Sports Injury',
      description: 'You injured yourself playing sports.',
      ageRange: [10, 50],
      probability: 10,
      impact: { health: -20, happiness: -15 }
    },
    {
      id: 'gym-membership',
      title: 'Joined Gym',
      description: 'You started working out regularly at the gym.',
      ageRange: [16, 70],
      probability: 20,
      impact: { health: 15, looks: 10, happiness: 10 }
    },
    
    // Random events
    {
      id: 'lottery-small',
      title: 'Small Lottery Win',
      description: 'You won a small amount in the lottery!',
      ageRange: [18, 80],
      probability: 5,
      impact: { happiness: 20 },
      money: 1000
    },
    {
      id: 'lottery-big',
      title: 'Big Lottery Win',
      description: 'You won big in the lottery!',
      ageRange: [18, 80],
      probability: 0.1,
      impact: { happiness: 50 },
      money: 100000
    },
    {
      id: 'car-accident',
      title: 'Car Accident',
      description: 'You were in a car accident but survived.',
      ageRange: [16, 80],
      probability: 8,
      impact: { health: -25, happiness: -20 },
      money: -5000
    }
  ];

  generateEventsForAge(character: Character): LifeEvent[] {
    const availableEvents = this.events.filter(event => 
      character.age >= event.ageRange[0] && 
      character.age <= event.ageRange[1] &&
      this.meetsRequirements(character, event)
    );

    const generatedEvents: LifeEvent[] = [];

    availableEvents.forEach(event => {
      if (Math.random() * 100 < event.probability) {
        const lifeEvent: LifeEvent = {
          id: Date.now().toString() + Math.random(),
          title: event.title,
          description: event.description,
          year: character.age,
          impact: event.impact || {}
        };
        
        // Apply money changes
        if (event.money) {
          character.bankAccount.balance += event.money;
        }
        
        generatedEvents.push(lifeEvent);
      }
    });

    return generatedEvents;
  }

  private meetsRequirements(character: Character, event: EventTemplate): boolean {
    if (!event.requirements) return true;

    const req = event.requirements;
    const stats = character.stats;

    if (req.intelligence && stats.intelligence < req.intelligence) return false;
    if (req.maxIntelligence && stats.intelligence > req.maxIntelligence) return false;
    if (req.health && stats.health < req.health) return false;
    if (req.looks && stats.looks < req.looks) return false;
    if (req.happiness && stats.happiness < req.happiness) return false;
    if (req.money && character.bankAccount.balance < req.money) return false;

    return true;
  }
}

interface EventTemplate {
  id: string;
  title: string;
  description: string;
  ageRange: [number, number];
  probability: number;
  impact?: {
    health?: number;
    intelligence?: number;
    looks?: number;
    happiness?: number;
  };
  requirements?: {
    intelligence?: number;
    maxIntelligence?: number;
    health?: number;
    looks?: number;
    happiness?: number;
    money?: number;
  };
  money?: number;
}