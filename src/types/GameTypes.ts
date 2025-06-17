export interface Character {
  id: string;
  name: string;
  age: number;
  birthYear: number;
  stats: CharacterStats;
  location: string;
  career?: Career;
  education: Education[];
  relationships: Relationship[];
  properties: Property[];
  bankAccount: BankAccount;
  criminalRecord: CriminalRecord;
  health: HealthStatus;
  achievements: Achievement[];
  lifeEvents: LifeEvent[];
}

export interface CharacterStats {
  health: number;
  intelligence: number;
  looks: number;
  happiness: number;
}

export interface Career {
  id: string;
  title: string;
  company: string;
  salary: number;
  experience: number;
  startYear: number;
  level: number;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  gpa: number;
}

export interface Relationship {
  id: string;
  name: string;
  type: 'family' | 'friend' | 'romantic' | 'spouse';
  relationship: number; // 0-100
  age: number;
}

export interface Property {
  id: string;
  type: 'house' | 'apartment' | 'car' | 'other';
  name: string;
  value: number;
  purchaseYear: number;
  monthlyExpense: number;
}

export interface BankAccount {
  balance: number;
  income: number;
  expenses: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: Date;
}

export interface CriminalRecord {
  crimes: Crime[];
  imprisonments: Imprisonment[];
  totalSentence: number;
}

export interface Crime {
  id: string;
  type: string;
  severity: number;
  year: number;
  caught: boolean;
  sentence?: number;
}

export interface Imprisonment {
  id: string;
  startYear: number;
  endYear: number;
  prison: string;
  behavior: number;
  jobsHeld: string[];
}

export interface HealthStatus {
  conditions: string[];
  medications: string[];
  lastCheckup: number;
  lifeExpectancy: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedYear: number;
}

export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  year: number;
  impact: {
    health?: number;
    intelligence?: number;
    looks?: number;
    happiness?: number;
  };
}

export interface Country {
  id: string;
  name: string;
  currency: string;
  exchangeRate: number;
  educationSystem: EducationSystem;
  jobMarket: JobMarket;
  crimeRate: number;
  healthcare: HealthcareSystem;
  costOfLiving: CostOfLiving;
}

export interface EducationSystem {
  primaryYears: number;
  secondaryYears: number;
  tertiaryOptions: string[];
  quality: number;
}

export interface JobMarket {
  unemploymentRate: number;
  averageSalary: number;
  popularCareers: string[];
  growth: number;
}

export interface HealthcareSystem {
  quality: number;
  cost: number;
  publicSystem: boolean;
}

export interface CostOfLiving {
  housing: number;
  food: number;
  transportation: number;
  healthcare: number;
  entertainment: number;
}

export interface CareerPath {
  id: string;
  name: string;
  category: string;
  educationRequired: string[];
  baseSalary: number;
  salaryGrowth: number;
  jobSecurity: number;
  stress: number;
  prestige: number;
}

export interface GameState {
  character: Character;
  currentYear: number;
  gameStarted: boolean;
  countries: Country[];
  careers: CareerPath[];
  achievements: Achievement[];
}