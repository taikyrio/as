export interface CrimeType {
  id: string;
  name: string;
  category: string;
  difficulty: number; // 1-10
  minSentence: number; // years
  maxSentence: number; // years
  successRate: number; // 0-100
  moneyRange: [number, number]; // min, max potential earnings
  riskFactors: string[];
  description: string;
}

export const crimeTypes: CrimeType[] = [
  {
    id: 'petty-theft',
    name: 'Petty Theft',
    category: 'Theft',
    difficulty: 2,
    minSentence: 0.25,
    maxSentence: 1,
    successRate: 75,
    moneyRange: [50, 500],
    riskFactors: ['Low security', 'Busy area'],
    description: 'Steal small items from stores or individuals'
  },
  {
    id: 'burglary-house',
    name: 'House Burglary',
    category: 'Burglary',
    difficulty: 4,
    minSentence: 1,
    maxSentence: 5,
    successRate: 60,
    moneyRange: [1000, 15000],
    riskFactors: ['Security system', 'Neighborhood watch', 'Occupied house'],
    description: 'Break into residential properties to steal valuables'
  },
  {
    id: 'burglary-business',
    name: 'Business Burglary',
    category: 'Burglary',
    difficulty: 6,
    minSentence: 2,
    maxSentence: 8,
    successRate: 45,
    moneyRange: [2000, 50000],
    riskFactors: ['Security cameras', 'Alarm systems', 'Night security'],
    description: 'Break into commercial properties for cash and equipment'
  },
  {
    id: 'assault-minor',
    name: 'Simple Assault',
    category: 'Violence',
    difficulty: 3,
    minSentence: 0.5,
    maxSentence: 2,
    successRate: 80,
    moneyRange: [0, 0],
    riskFactors: ['Witnesses', 'Police presence'],
    description: 'Physical altercation resulting in minor injuries'
  },
  {
    id: 'assault-aggravated',
    name: 'Aggravated Assault',
    category: 'Violence',
    difficulty: 5,
    minSentence: 2,
    maxSentence: 10,
    successRate: 70,
    moneyRange: [0, 0],
    riskFactors: ['Weapons involved', 'Serious injury', 'Criminal history'],
    description: 'Serious physical attack causing significant harm'
  },
  {
    id: 'murder-unplanned',
    name: 'Manslaughter',
    category: 'Murder',
    difficulty: 7,
    minSentence: 5,
    maxSentence: 20,
    successRate: 30,
    moneyRange: [0, 0],
    riskFactors: ['Forensic evidence', 'Witnesses', 'Motive'],
    description: 'Unintentional killing during another crime'
  },
  {
    id: 'murder-planned',
    name: 'Premeditated Murder',
    category: 'Murder',
    difficulty: 9,
    minSentence: 15,
    maxSentence: 99,
    successRate: 20,
    moneyRange: [0, 0],
    riskFactors: ['DNA evidence', 'Digital footprint', 'Planning evidence'],
    description: 'Planned killing with intent and preparation'
  },
  {
    id: 'cybercrime-fraud',
    name: 'Online Fraud',
    category: 'Cybercrime',
    difficulty: 5,
    minSentence: 1,
    maxSentence: 7,
    successRate: 65,
    moneyRange: [5000, 100000],
    riskFactors: ['Digital forensics', 'Banking security', 'International law'],
    description: 'Fraudulent online schemes to steal money'
  },
  {
    id: 'cybercrime-hacking',
    name: 'Computer Hacking',
    category: 'Cybercrime',
    difficulty: 7,
    minSentence: 2,
    maxSentence: 15,
    successRate: 40,
    moneyRange: [10000, 500000],
    riskFactors: ['Corporate security', 'Federal agencies', 'Technical evidence'],
    description: 'Unauthorized access to computer systems for profit'
  },
  {
    id: 'drug-dealing',
    name: 'Drug Dealing',
    category: 'Drugs',
    difficulty: 6,
    minSentence: 3,
    maxSentence: 20,
    successRate: 55,
    moneyRange: [2000, 50000],
    riskFactors: ['Undercover operations', 'Informants', 'Rival dealers'],
    description: 'Sell illegal drugs for profit'
  },
  {
    id: 'bank-robbery',
    name: 'Bank Robbery',
    category: 'Robbery',
    difficulty: 9,
    minSentence: 10,
    maxSentence: 25,
    successRate: 25,
    moneyRange: [50000, 500000],
    riskFactors: ['FBI involvement', 'Security cameras', 'Armed guards'],
    description: 'Rob a bank using force or threat of force'
  },
  {
    id: 'kidnapping',
    name: 'Kidnapping',
    category: 'Violence',
    difficulty: 8,
    minSentence: 10,
    maxSentence: 30,
    successRate: 35,
    moneyRange: [100000, 1000000],
    riskFactors: ['FBI involvement', 'Amber alerts', 'Ransom demands'],
    description: 'Abduct someone for ransom or other purposes'
  }
];

export interface Prison {
  id: string;
  name: string;
  securityLevel: 'minimum' | 'medium' | 'maximum' | 'supermax';
  reputation: number; // 1-10, 1 being worst
  programs: string[];
  jobs: PrisonJob[];
  dailyRoutine: string[];
}

export interface PrisonJob {
  id: string;
  name: string;
  pay: number; // per day
  requirements: string[];
  benefits: string[];
}

export const prisons: Prison[] = [
  {
    id: 'county-jail',
    name: 'County Jail',
    securityLevel: 'minimum',
    reputation: 4,
    programs: ['GED Classes', 'Substance Abuse Treatment'],
    jobs: [
      {
        id: 'kitchen',
        name: 'Kitchen Worker',
        pay: 2,
        requirements: ['Good behavior record'],
        benefits: ['Extra food portions', 'Early meal access']
      },
      {
        id: 'laundry',
        name: 'Laundry Service',
        pay: 1.5,
        requirements: ['Basic health check'],
        benefits: ['Clean clothes priority']
      }
    ],
    dailyRoutine: ['6:00 AM - Wake up', '7:00 AM - Breakfast', '8:00 AM - Work detail', '12:00 PM - Lunch', '1:00 PM - Recreation', '5:00 PM - Dinner', '9:00 PM - Lights out']
  },
  {
    id: 'state-pen',
    name: 'State Penitentiary',
    securityLevel: 'medium',
    reputation: 5,
    programs: ['Vocational Training', 'College Courses', 'Anger Management'],
    jobs: [
      {
        id: 'library',
        name: 'Library Assistant',
        pay: 3,
        requirements: ['High school education', 'Good behavior'],
        benefits: ['Book access', 'Quiet environment']
      },
      {
        id: 'maintenance',
        name: 'Maintenance Crew',
        pay: 4,
        requirements: ['Physical fitness', 'Technical skills'],
        benefits: ['Skill development', 'Movement around facility']
      }
    ],
    dailyRoutine: ['5:30 AM - Wake up', '6:30 AM - Breakfast', '7:30 AM - Work assignment', '11:30 AM - Lunch', '12:30 PM - Work continues', '4:30 PM - Recreation', '6:00 PM - Dinner', '8:30 PM - Cell time', '10:00 PM - Lights out']
  },
  {
    id: 'max-security',
    name: 'Maximum Security Prison',
    securityLevel: 'maximum',
    reputation: 2,
    programs: ['Basic Education', 'Religious Services'],
    jobs: [
      {
        id: 'cleaning',
        name: 'Cell Block Cleaner',
        pay: 1,
        requirements: ['Solitary confinement completion'],
        benefits: ['Out of cell time']
      }
    ],
    dailyRoutine: ['6:00 AM - Wake up', '6:30 AM - Breakfast in cell', '8:00 AM - Limited recreation', '10:00 AM - Return to cell', '12:00 PM - Lunch in cell', '2:00 PM - Shower time', '5:00 PM - Dinner in cell', '8:00 PM - Lights out']
  },
  {
    id: 'federal-prison',
    name: 'Federal Correctional Institution',
    securityLevel: 'medium',
    reputation: 6,
    programs: ['Computer Training', 'Business Skills', 'Drug Treatment', 'Mental Health Services'],
    jobs: [
      {
        id: 'office',
        name: 'Administrative Assistant',
        pay: 5,
        requirements: ['College education', 'Clean record'],
        benefits: ['Office skills', 'Administrative experience']
      },
      {
        id: 'workshop',
        name: 'Workshop Supervisor',
        pay: 6,
        requirements: ['Leadership experience', 'Technical skills'],
        benefits: ['Management experience', 'Skill teaching']
      }
    ],
    dailyRoutine: ['6:00 AM - Wake up', '7:00 AM - Breakfast', '8:00 AM - Work program', '12:00 PM - Lunch', '1:00 PM - Educational programs', '4:00 PM - Recreation', '6:00 PM - Dinner', '8:00 PM - Personal time', '10:00 PM - Lights out']
  }
];