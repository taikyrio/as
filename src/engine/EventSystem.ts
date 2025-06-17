
import { Character, LifeEvent } from '../types/GameTypes';

export class EventSystem {
  private events: EventTemplate[] = [
    // Early Childhood events (0-5)
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'You took your very first steps today! Your parents were overjoyed as you wobbled across the living room, marking a major milestone in your development. This moment will be remembered forever.',
      ageRange: [1, 1],
      probability: 100,
      impact: { happiness: 5, health: 2 }
    },
    {
      id: 'first-word',
      title: 'First Word',
      description: 'You spoke your first word today: "Mama"! Your mother nearly cried with joy as you looked directly at her and said it clearly. Your journey of communication has officially begun.',
      ageRange: [1, 2],
      probability: 100,
      impact: { intelligence: 3, happiness: 5 }
    },
    {
      id: 'potty-trained',
      title: 'Potty Training Success',
      description: 'You successfully learned to use the potty! No more diapers for you. Your parents are proud of this important step toward independence, and you feel grown up.',
      ageRange: [2, 3],
      probability: 95,
      impact: { happiness: 8, intelligence: 2 }
    },
    {
      id: 'lost-tooth',
      title: 'Lost First Tooth',
      description: 'Your first tooth fell out today! You were a little scared at first, but when the tooth fairy left money under your pillow, you couldn\'t contain your excitement. Growing up has its perks!',
      ageRange: [5, 7],
      probability: 80,
      impact: { happiness: 8, intelligence: 1 }
    },

    // Childhood events (6-12)
    {
      id: 'school-start',
      title: 'Started Elementary School',
      description: 'Today marked your first day of elementary school! You met your new teacher, made some friends, and learned that school can actually be fun. Your educational journey has officially begun.',
      ageRange: [5, 6],
      probability: 95,
      impact: { intelligence: 10, happiness: 5 }
    },
    {
      id: 'excellent-grades',
      title: 'Received Excellent Grades',
      description: 'You brought home a report card filled with A\'s! Your teacher praised your hard work and dedication. Your parents rewarded you with your favorite dinner and extra screen time.',
      ageRange: [6, 18],
      probability: 30,
      requirements: { intelligence: 70 },
      impact: { intelligence: 5, happiness: 15 }
    },
    {
      id: 'poor-grades',
      title: 'Struggling in School',
      description: 'Your report card showed some concerning grades this term. Your parents scheduled a meeting with your teacher to discuss extra help. You\'re feeling discouraged but determined to improve.',
      ageRange: [6, 18],
      probability: 25,
      requirements: { intelligence: 50, maxIntelligence: 60 },
      impact: { happiness: -10, intelligence: -2 }
    },
    {
      id: 'made-best-friend',
      title: 'Made a Best Friend',
      description: 'You and a classmate clicked instantly and became inseparable! You spend every recess together, share lunch, and have already planned multiple sleepovers. True friendship is a beautiful thing.',
      ageRange: [6, 12],
      probability: 60,
      impact: { happiness: 20, intelligence: 3 }
    },
    {
      id: 'won-spelling-bee',
      title: 'Won School Spelling Bee',
      description: 'You correctly spelled "entrepreneur" to win the school spelling bee! Standing on stage with the trophy, you felt incredibly proud. Your vocabulary skills have really paid off.',
      ageRange: [8, 12],
      probability: 15,
      requirements: { intelligence: 75 },
      impact: { intelligence: 8, happiness: 25, looks: 3 }
    },
    {
      id: 'learned-to-ride-bike',
      title: 'Learned to Ride a Bike',
      description: 'After many attempts and a few scraped knees, you finally rode your bike without training wheels! The feeling of freedom and accomplishment was incredible as you pedaled down the street.',
      ageRange: [6, 10],
      probability: 85,
      impact: { happiness: 15, health: 5 }
    },

    // Teen events (13-17)
    {
      id: 'first-crush',
      title: 'First Crush',
      description: 'You developed your first real crush on a classmate! Every interaction makes your heart race, and you find yourself daydreaming about them constantly. Young love is both exciting and nerve-wracking.',
      ageRange: [12, 16],
      probability: 70,
      impact: { happiness: 15, looks: 3 }
    },
    {
      id: 'first-job',
      title: 'Got First Part-Time Job',
      description: 'You landed your first job at a local store! Learning about responsibility, customer service, and earning your own money feels incredibly empowering. Your first paycheck was a moment of pride.',
      ageRange: [14, 16],
      probability: 40,
      impact: { happiness: 15, intelligence: 5 },
      money: 500
    },
    {
      id: 'drivers-license',
      title: 'Passed Driving Test',
      description: 'You passed your driving test on the first try! Getting handed that license felt like receiving the key to freedom. Your parents are nervous, but you\'re ready to explore the world.',
      ageRange: [16, 18],
      probability: 70,
      impact: { happiness: 25, looks: 5, intelligence: 3 }
    },
    {
      id: 'prom-king-queen',
      title: 'Crowned Prom Royalty',
      description: 'You were elected Prom King/Queen! Walking across the stage to receive your crown was a magical moment. The entire school cheered as you took your place as royalty for the night.',
      ageRange: [17, 18],
      probability: 10,
      requirements: { looks: 80, happiness: 70 },
      impact: { happiness: 35, looks: 8, intelligence: 2 }
    },
    {
      id: 'prom-night',
      title: 'Attended Prom',
      description: 'Prom night was everything you dreamed it would be! You danced the night away, took countless photos, and made memories that will last a lifetime. It was the perfect end to your high school experience.',
      ageRange: [17, 18],
      probability: 60,
      requirements: { looks: 50 },
      impact: { happiness: 25, looks: 3 }
    },
    {
      id: 'graduation-valedictorian',
      title: 'Graduated as Valedictorian',
      description: 'You graduated as valedictorian of your class! Delivering the commencement speech to hundreds of people was nerve-wracking but incredibly rewarding. Your academic excellence has been recognized.',
      ageRange: [17, 18],
      probability: 5,
      requirements: { intelligence: 90 },
      impact: { intelligence: 15, happiness: 30, looks: 5 }
    },
    {
      id: 'high-school-graduation',
      title: 'High School Graduation',
      description: 'You walked across the stage to receive your high school diploma! Years of hard work culminated in this moment. Your family cheered loudly from the audience as you entered the next chapter of life.',
      ageRange: [17, 18],
      probability: 85,
      impact: { intelligence: 10, happiness: 20 }
    },

    // Young adult events (18-30)
    {
      id: 'college-acceptance',
      title: 'Accepted to Dream College',
      description: 'The acceptance letter arrived in the mail - you got into your dream college! Your hard work in high school paid off. You\'re excited but nervous about this new adventure ahead.',
      ageRange: [18, 19],
      probability: 50,
      requirements: { intelligence: 70 },
      impact: { intelligence: 15, happiness: 30 }
    },
    {
      id: 'college-party-phase',
      title: 'College Party Phase',
      description: 'You discovered the social side of college life! While fun, you\'re learning to balance parties with academics. Some late nights studying after social events taught you valuable time management.',
      ageRange: [18, 22],
      probability: 40,
      impact: { happiness: 15, health: -5, intelligence: -3 }
    },
    {
      id: 'study-abroad',
      title: 'Studied Abroad',
      description: 'You spent a semester studying in another country! Immersing yourself in a different culture broadened your perspective and created lifelong memories. You returned more worldly and confident.',
      ageRange: [19, 22],
      probability: 20,
      requirements: { intelligence: 65, money: 10000 },
      impact: { intelligence: 12, happiness: 25, looks: 5 },
      money: -15000
    },
    {
      id: 'first-love',
      title: 'Fell in Love',
      description: 'You experienced your first true love! Every moment together feels magical, and you can\'t imagine life without them. This relationship is teaching you about commitment, compromise, and deep affection.',
      ageRange: [16, 25],
      probability: 60,
      requirements: { looks: 40, happiness: 50 },
      impact: { happiness: 35, looks: 5, health: 5 }
    },
    {
      id: 'heartbreak',
      title: 'Devastating Heartbreak',
      description: 'Your relationship ended unexpectedly, leaving you heartbroken. The pain feels unbearable right now, but friends and family remind you that this too shall pass. Time will heal these wounds.',
      ageRange: [16, 40],
      probability: 35,
      impact: { happiness: -30, health: -8, looks: -3 }
    },
    {
      id: 'dream-job-offer',
      title: 'Received Dream Job Offer',
      description: 'A company offered you your dream job! The salary, benefits, and career growth opportunities exceed your expectations. All those years of education and hard work have finally paid off.',
      ageRange: [22, 30],
      probability: 25,
      requirements: { intelligence: 75 },
      impact: { happiness: 30, intelligence: 5 },
      money: 15000
    },

    // Career and life events (25-65)
    {
      id: 'job-promotion',
      title: 'Major Promotion',
      description: 'Your boss called you into their office to offer you a significant promotion! Your hard work, dedication, and leadership skills have been recognized. The raise will change your lifestyle considerably.',
      ageRange: [22, 65],
      probability: 25,
      requirements: { intelligence: 60 },
      impact: { happiness: 25, intelligence: 3 },
      money: 8000
    },
    {
      id: 'started-business',
      title: 'Started Own Business',
      description: 'You took the entrepreneurial leap and started your own business! It\'s risky but exciting. Working for yourself brings freedom but also the stress of being responsible for everything.',
      ageRange: [25, 50],
      probability: 15,
      requirements: { intelligence: 70, money: 25000 },
      impact: { happiness: 20, intelligence: 10, health: -5 },
      money: -20000
    },
    {
      id: 'business-success',
      title: 'Business Became Successful',
      description: 'Your business is thriving beyond your wildest dreams! Revenue is up, you\'re hiring employees, and industry publications are writing about your success. The risk has paid off handsomely.',
      ageRange: [27, 55],
      probability: 20,
      requirements: { intelligence: 75, money: 50000 },
      impact: { happiness: 40, intelligence: 8, looks: 5 },
      money: 100000
    },

    // Relationship and family events
    {
      id: 'met-soulmate',
      title: 'Met Your Soulmate',
      description: 'You met someone who feels like your perfect match! Every conversation flows naturally, you share similar values and dreams, and being together feels effortless. This could be "the one."',
      ageRange: [20, 45],
      probability: 30,
      requirements: { happiness: 60, looks: 50 },
      impact: { happiness: 30, health: 5, looks: 3 }
    },
    {
      id: 'engagement',
      title: 'Got Engaged',
      description: 'Your partner proposed and you said yes! Planning the wedding is exciting but stressful. You\'re looking forward to spending your life with someone who truly understands and loves you.',
      ageRange: [22, 40],
      probability: 40,
      requirements: { happiness: 70, looks: 50 },
      impact: { happiness: 35, looks: 5 }
    },
    {
      id: 'dream-wedding',
      title: 'Had Dream Wedding',
      description: 'Your wedding day was absolutely perfect! Surrounded by family and friends, you exchanged vows with the love of your life. Every detail was exactly as you imagined it would be.',
      ageRange: [22, 45],
      probability: 35,
      requirements: { happiness: 70, money: 30000 },
      impact: { happiness: 45, looks: 8 },
      money: -25000
    },
    {
      id: 'first-child-born',
      title: 'First Child Born',
      description: 'You became a parent for the first time! Holding your newborn baby was the most incredible moment of your life. The love you feel is indescribable, though you\'re also terrified of the responsibility.',
      ageRange: [20, 45],
      probability: 30,
      requirements: { happiness: 60 },
      impact: { happiness: 50, health: -10, intelligence: 5 },
      money: -5000
    },
    {
      id: 'child-first-words',
      title: 'Child\'s First Words',
      description: 'Your child spoke their first word today, and it was "Mama" or "Dada"! You immediately called everyone you know to share the exciting news. Watching them develop brings such joy.',
      ageRange: [21, 50],
      probability: 40,
      requirements: { happiness: 60 },
      impact: { happiness: 25, health: 3 }
    },

    // Health and fitness events
    {
      id: 'fitness-transformation',
      title: 'Amazing Fitness Transformation',
      description: 'Months of dedication to diet and exercise have paid off! You\'ve lost weight, gained muscle, and feel more confident than ever. People are complimenting your new look constantly.',
      ageRange: [16, 70],
      probability: 20,
      impact: { health: 25, looks: 15, happiness: 20 }
    },
    {
      id: 'ran-marathon',
      title: 'Completed First Marathon',
      description: 'You crossed the marathon finish line! Training for months prepared you for this 26.2-mile journey. The sense of accomplishment and physical achievement is overwhelming.',
      ageRange: [18, 60],
      probability: 10,
      requirements: { health: 70 },
      impact: { health: 15, happiness: 30, intelligence: 5 }
    },
    {
      id: 'health-scare',
      title: 'Minor Health Scare',
      description: 'A routine checkup revealed some concerning results that required follow-up tests. Fortunately, everything turned out fine, but it was a wake-up call about taking better care of yourself.',
      ageRange: [30, 80],
      probability: 25,
      impact: { health: -15, happiness: -20, intelligence: 5 }
    },

    // Random positive events
    {
      id: 'lottery-small',
      title: 'Won Scratch-Off Lottery',
      description: 'You bought a scratch-off ticket on a whim and won $1,000! It\'s not life-changing money, but it was enough to treat yourself to something nice and pay off a few bills.',
      ageRange: [18, 80],
      probability: 5,
      impact: { happiness: 20 },
      money: 1000
    },
    {
      id: 'lottery-jackpot',
      title: 'Won Lottery Jackpot',
      description: 'You won the lottery jackpot! $100,000 will completely change your life. After the initial shock wore off, you started making plans for paying off debt, investing, and maybe taking a dream vacation.',
      ageRange: [18, 80],
      probability: 0.1,
      impact: { happiness: 50 },
      money: 100000
    },
    {
      id: 'found-wallet',
      title: 'Returned Lost Wallet',
      description: 'You found someone\'s wallet and returned it to them. They were so grateful that they insisted on giving you a reward. Doing the right thing made you feel good about yourself.',
      ageRange: [10, 80],
      probability: 8,
      impact: { happiness: 15, intelligence: 2 },
      money: 200
    },
    {
      id: 'surprise-inheritance',
      title: 'Received Unexpected Inheritance',
      description: 'A distant relative you barely knew left you money in their will. While you\'re sad about their passing, the inheritance will help secure your financial future.',
      ageRange: [25, 70],
      probability: 3,
      impact: { happiness: 25, health: -5 },
      money: 25000
    },

    // Random negative events
    {
      id: 'car-accident',
      title: 'Car Accident',
      description: 'You were involved in a car accident that wasn\'t your fault. Thankfully, your injuries were minor, but the car needs expensive repairs and the whole experience was traumatic.',
      ageRange: [16, 80],
      probability: 8,
      impact: { health: -20, happiness: -15 },
      money: -3000
    },
    {
      id: 'house-burglary',
      title: 'House Was Burglarized',
      description: 'You came home to find your house had been broken into. While insurance will cover most of the stolen items, the violation of your personal space leaves you feeling unsafe.',
      ageRange: [20, 80],
      probability: 5,
      impact: { happiness: -25, health: -5 },
      money: -2000
    },
    {
      id: 'pet-adopted',
      title: 'Adopted a Pet',
      description: 'You adopted an adorable pet from the animal shelter! Having a furry companion brings so much joy to your daily life, though the responsibility and expenses are significant.',
      ageRange: [12, 70],
      probability: 30,
      impact: { happiness: 25, health: 5 },
      money: -1000
    },
    {
      id: 'pet-passed-away',
      title: 'Beloved Pet Passed Away',
      description: 'Your beloved pet passed away after years of companionship. The grief is overwhelming - they were truly a member of the family. The house feels empty without their presence.',
      ageRange: [15, 80],
      probability: 15,
      impact: { happiness: -30, health: -5 }
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
          id: `${event.id}-${Date.now()}-${Math.random()}`,
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
