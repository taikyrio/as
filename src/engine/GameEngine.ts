import { GameState, Character, CharacterStats, LifeEvent, Achievement } from '../types/GameTypes';
import { countries } from '../data/countries';
import { careers } from '../data/careers';
import { EventSystem } from './EventSystem';
import { CrimeSystem } from './CrimeSystem';
import { DecisionSystem, Decision } from './DecisionSystem';

export class GameEngine {
  private gameState: GameState;
  private eventSystem: EventSystem;
  private crimeSystem: CrimeSystem;
  private decisionSystem: DecisionSystem;
  private saveKey = 'lifesim-save';

  constructor() {
    this.eventSystem = new EventSystem();
    this.crimeSystem = new CrimeSystem();
    this.decisionSystem = new DecisionSystem();
    this.gameState = this.initializeGameState();
  }

  loadGameFromSave(saveData: any): GameState {
    const safeCountries = Array.isArray(countries) ? countries : [];
    const safeCareers = Array.isArray(careers) ? careers : [];
    
    this.gameState = {
      ...saveData.gameState,
      countries: safeCountries,
      careers: safeCareers
    };
    return this.gameState;
  }

  private initializeGameState(): GameState {
    // Ensure countries and careers are properly imported
    const safeCountries = Array.isArray(countries) ? countries : [];
    const safeCareers = Array.isArray(careers) ? careers : [];
    
    return {
      character: this.createNewCharacter(),
      currentYear: new Date().getFullYear(),
      gameStarted: false,
      countries: safeCountries,
      careers: safeCareers,
      achievements: []
    };
  }

  private getRandomName(): string {
    const firstNames = [
      'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
      'Blake', 'Sage', 'River', 'Phoenix', 'Skyler', 'Cameron', 'Drew', 'Emery',
      'Finley', 'Harper', 'Hayden', 'Indigo', 'Jamie', 'Kai', 'Logan', 'Max',
      'Nova', 'Ocean', 'Parker', 'Reese', 'Sam', 'Storm', 'Tatum', 'Vale'
    ];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
  }

  private getRandomCountry(): string {
    const countryIds = [
      'usa', 'canada', 'uk', 'germany', 'japan', 'australia',
      'france', 'singapore', 'sweden', 'switzerland'
    ];
    return countryIds[Math.floor(Math.random() * countryIds.length)];
  }

  private createNewCharacter(): Character {
    const birthYear = new Date().getFullYear();
    return {
      id: Date.now().toString(),
      name: '',
      age: 0,
      birthYear,
      stats: {
        health: 100,
        intelligence: Math.floor(Math.random() * 30) + 70,
        looks: Math.floor(Math.random() * 30) + 70,
        happiness: Math.floor(Math.random() * 20) + 80
      },
      location: 'usa',
      education: [],
      relationships: [],
      properties: [],
      bankAccount: {
        balance: 0,
        income: 0,
        expenses: 0,
        transactions: []
      },
      criminalRecord: {
        crimes: [],
        imprisonments: [],
        totalSentence: 0
      },
      health: {
        conditions: [],
        medications: [],
        lastCheckup: 0,
        lifeExpectancy: Math.floor(Math.random() * 20) + 70
      },
      achievements: [],
      lifeEvents: []
    };
  }

  startNewLife(name: string, country: string): void {
    this.gameState.character = this.createNewCharacter();
    this.gameState.character.name = name;
    this.gameState.character.location = country;
    this.gameState.gameStarted = true;
    this.gameState.currentYear = this.gameState.character.birthYear;

    // Add birth event
    this.addLifeEvent({
      id: Date.now().toString(),
      title: 'Born',
      description: `You were born in ${this.getCountryName(country)}! Welcome to the world.`,
      year: 0,
      impact: {}
    });

    this.saveGame();
  }

  startRandomLife(): void {
    const randomName = this.getRandomName();
    const randomCountry = this.getRandomCountry();
    this.startNewLife(randomName, randomCountry);
  }

  ageUp(): { events: LifeEvent[], decisions: Decision[], isDead?: boolean, causeOfDeath?: string } {
    this.gameState.character.age++;
    this.gameState.currentYear++;

    // Check for death
    const deathResult = this.checkForDeath();
    if (deathResult.isDead) {
      return { events: [], decisions: [], isDead: true, causeOfDeath: deathResult.cause };
    }

    // Generate random events
    const events = this.eventSystem.generateEventsForAge(this.gameState.character);
    events.forEach(event => this.addLifeEvent(event));

    // Generate potential decisions
    const decision = this.decisionSystem.generateDecisionForAge(this.gameState.character);
    if (decision) {
      // For now, we'll store the decision in the character's life events
      // In a full implementation, you'd show this as a modal to the user
      this.addLifeEvent({
        id: Date.now().toString(),
        title: 'Life Decision',
        description: `You faced a decision: ${decision.title}`,
        year: this.gameState.character.age,
        impact: {}
      });
    }

    // Update finances
    this.updateFinances();

    // Check for achievements
    this.checkAchievements();

    // Check for death
    if (this.checkForDeath().isDead) {
      this.handleDeath(deathResult.cause);
      return { events: [], decisions: [], isDead: true, causeOfDeath: deathResult.cause };
    }

    this.saveGame();
    return { events: [], decisions: [] };
  }

  private processAging(): void {
    const character = this.gameState.character;

    // Natural aging effects
    if (character.age > 30) {
      // Gradual decline starts after 30
      if (Math.random() < 0.1) character.stats.health -= 1;
      if (Math.random() < 0.05) character.stats.looks -= 1;
    }

    if (character.age > 50) {
      // More noticeable decline after 50
      if (Math.random() < 0.2) character.stats.health -= Math.floor(Math.random() * 3) + 1;
      if (Math.random() < 0.15) character.stats.looks -= Math.floor(Math.random() * 2) + 1;
      if (Math.random() < 0.1) character.stats.intelligence -= 1;
    }

    if (character.age > 70) {
      // Significant decline in elder years
      if (Math.random() < 0.3) character.stats.health -= Math.floor(Math.random() * 5) + 1;
      if (Math.random() < 0.2) character.stats.intelligence -= Math.floor(Math.random() * 3) + 1;
    }

    // Ensure stats don't go below 0
    character.stats.health = Math.max(0, character.stats.health);
    character.stats.intelligence = Math.max(0, character.stats.intelligence);
    character.stats.looks = Math.max(0, character.stats.looks);
    character.stats.happiness = Math.max(0, character.stats.happiness);
  }

  private checkForDeath(): { isDead: boolean, cause?: string } {
    const character = this.gameState.character;

    // Critical health check
    if (character.stats.health <= 0) {
      return { isDead: true, cause: 'illness' };
    }

    // Age-based death probability
    let deathChance = 0;
    let cause = 'natural causes';

    if (character.age >= 100) deathChance = 0.4;
    else if (character.age >= 95) deathChance = 0.25;
    else if (character.age >= 90) deathChance = 0.15;
    else if (character.age >= 85) deathChance = 0.08;
    else if (character.age >= 80) deathChance = 0.04;
    else if (character.age >= 75) deathChance = 0.02;
    else if (character.age >= 70) deathChance = 0.01;

    // Health-based death probability
    if (character.stats.health < 30) {
      deathChance += 0.05;
      cause = 'illness';
    }
    if (character.stats.health < 20) {
      deathChance += 0.1;
      cause = 'illness';
    }
    if (character.stats.health < 10) {
      deathChance += 0.2;
      cause = 'illness';
    }

    // Criminal activity increases accident/violence risk
    if (character.criminalRecord.crimes.length > 0) {
      const crimeRisk = Math.min(character.criminalRecord.crimes.length * 0.01, 0.05);
      deathChance += crimeRisk;
      if (Math.random() < 0.5) cause = 'violence';
      else cause = 'accident';
    }

    // Low happiness increases accident risk
    if (character.stats.happiness < 20) {
      deathChance += 0.02;
      if (cause === 'natural causes') cause = 'accident';
    }

    // Random accidents (very low chance)
    if (character.age >= 16 && character.age <= 75) {
      deathChance += 0.001;
      if (Math.random() < 0.3) cause = 'accident';
    }

    if (Math.random() < deathChance) {
      return { isDead: true, cause };
    }

    return { isDead: false };
  }

  private handleDeath(causeOfDeath: string): void {
    const character = this.gameState.character;

    this.addLifeEvent({
      id: Date.now().toString(),
      title: 'Death',
      description: `You passed away at age ${character.age} from ${causeOfDeath}. Your life has come to an end.`,
      year: character.age,
      impact: {}
    });

    // Calculate life score
    const lifeScore = Math.floor(
      (character.stats.health + character.stats.intelligence + 
       character.stats.looks + character.stats.happiness) / 4
    );

    this.addLifeEvent({
      id: Date.now().toString(),
      title: 'Life Summary',
      description: `You lived ${character.age} years with a life satisfaction score of ${lifeScore}/100. You experienced ${character.lifeEvents.length} major life events and earned ${character.achievements.length} achievements.`,
      year: character.age,
      impact: {}
    });
  }

  enrollInEducation(educationType: string, field: string): any {
    const character = this.gameState.character;

    const educationCosts = {
      'Primary School': 0,
      'High School': 0,
      'Trade School': 15000,
      'College': 40000,
      'University': 60000,
      'Graduate School': 80000
    };

    const cost = educationCosts[educationType as keyof typeof educationCosts] || 0;

    if (character.bankAccount.balance < cost) {
      return { success: false, message: 'Insufficient funds for education' };
    }

    // Age requirements
    const ageRequirements = {
      'Primary School': 5,
      'High School': 14,
      'Trade School': 16,
      'College': 17,
      'University': 17,
      'Graduate School': 22
    };

    const requiredAge = ageRequirements[educationType as keyof typeof ageRequirements] || 0;
    if (character.age < requiredAge) {
      return { success: false, message: `You must be at least ${requiredAge} years old` };
    }

    character.bankAccount.balance -= cost;
    character.education.push({
      id: Date.now().toString(),
      institution: `${this.getRandomInstitutionName()} ${educationType}`,
      degree: educationType,
      field: field,
      startYear: character.age,
      endYear: character.age + this.getEducationDuration(educationType),
      gpa: 0,
      completed: false
    });

    if (cost > 0) {
      this.addTransaction({
        id: Date.now().toString(),
        amount: cost,
        type: 'expense',
        description: `Tuition for ${educationType}`,
        date: new Date()
      });
    }

    this.addLifeEvent({
      id: Date.now().toString(),
      title: 'Started Education',
      description: `Enrolled in ${educationType} studying ${field}`,
      year: character.age,
      impact: { intelligence: 5, happiness: 10 }
    });

    return { success: true, message: `Successfully enrolled in ${educationType}!` };
  }

  private getRandomInstitutionName(): string {
    const names = [
      'Springfield', 'Riverside', 'Oakwood', 'Hillcrest', 'Westfield', 
      'Northside', 'Central', 'Metropolitan', 'State', 'Technical'
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  private getEducationDuration(type: string): number {
    const durations = {
      'Primary School': 6,
      'High School': 4,
      'Trade School': 2,
      'College': 4,
      'University': 4,
      'Graduate School': 3
    };
    return durations[type as keyof typeof durations] || 4;
  }

  startRelationship(type: 'friend' | 'romantic' | 'family'): any {
    const character = this.gameState.character;

    if (character.age < 5) {
      return { success: false, message: 'Too young for meaningful relationships' };
    }

    const relationship = {
      id: Date.now().toString(),
      name: this.generateRandomName(),
      type: type,
      relationshipStrength: Math.floor(Math.random() * 30) + 20,
      yearMet: character.age,
      status: 'active' as const
    };

    character.relationships.push(relationship);

    this.addLifeEvent({
      id: Date.now().toString(),
      title: `New ${type === 'romantic' ? 'Romance' : type === 'friend' ? 'Friend' : 'Family Member'}`,
      description: `You met ${relationship.name} and ${type === 'romantic' ? 'started dating' : 'became friends'}`,
      year: character.age,
      impact: { happiness: 15, looks: type === 'romantic' ? 5 : 0 }
    });

    return { success: true, message: `You're now in a relationship with ${relationship.name}!` };
  }

  private generateRandomName(): string {
    const names = [
      'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
      'Blake', 'Sage', 'River', 'Phoenix', 'Skyler', 'Cameron', 'Drew', 'Emery',
      'Sam', 'Charlie', 'Dakota', 'Eden', 'Finley', 'Harper', 'Hayden', 'Jamie'
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  buyProperty(propertyType: string): any {
    const character = this.gameState.character;

    const propertyPrices = {
      'Small Apartment': 150000,
      'Large Apartment': 300000,
      'Small House': 400000,
      'Large House': 800000,
      'Mansion': 2000000,
      'Business': 500000
    };

    const monthlyExpenses = {
      'Small Apartment': 800,
      'Large Apartment': 1500,
      'Small House': 2000,
      'Large House': 4000,
      'Mansion': 10000,
      'Business': 3000
    };

    const price = propertyPrices[propertyType as keyof typeof propertyPrices] || 0;
    const monthly = monthlyExpenses[propertyType as keyof typeof monthlyExpenses] || 0;

    if (character.bankAccount.balance < price) {
      return { success: false, message: 'Insufficient funds for this property' };
    }

    character.bankAccount.balance -= price;
    character.properties.push({
      id: Date.now().toString(),
      name: propertyType,
      value: price,
      monthlyExpense: monthly,
      yearPurchased: character.age
    });

    this.addTransaction({
      id: Date.now().toString(),
      amount: price,
      type: 'expense',
      description: `Purchased ${propertyType}`,
      date: new Date()
    });

    this.addLifeEvent({
      id: Date.now().toString(),
      title: 'Property Purchase',
      description: `You bought a ${propertyType}!`,
      year: character.age,
      impact: { happiness: 20, looks: 5 }
    });

    return { success: true, message: `You successfully bought a ${propertyType}!` };
  }

  private updateFinances(): void {
    const character = this.gameState.character;

    if (character.career) {
      const monthlySalary = character.career.salary / 12;
      character.bankAccount.balance += monthlySalary;
      character.bankAccount.income += monthlySalary;

      this.addTransaction({
        id: Date.now().toString(),
        amount: monthlySalary,
        type: 'income',
        description: `Salary from ${character.career.title}`,
        date: new Date()
      });
    }

    // Monthly expenses
    const monthlyExpenses = character.properties.reduce((total, property) => 
      total + property.monthlyExpense, 0);
    const country = this.getCountry(character.location);
    const baseLivingCost = country ? 
      (country.costOfLiving.food + country.costOfLiving.transportation + 
       country.costOfLiving.entertainment) : 500;

    const totalExpenses = monthlyExpenses + baseLivingCost;
    character.bankAccount.balance -= totalExpenses;
    character.bankAccount.expenses += totalExpenses;

    this.addTransaction({
      id: Date.now().toString(),
      amount: totalExpenses,
      type: 'expense',
      description: 'Monthly living expenses',
      date: new Date()
    });

    // Update relationship strength over time
    character.relationships.forEach(rel => {
      if (rel.status === 'active') {
        // Small chance relationships get stronger or weaker
        if (Math.random() < 0.1) {
          rel.relationshipStrength += Math.floor(Math.random() * 11) - 5; // -5 to +5
          rel.relationshipStrength = Math.max(0, Math.min(100, rel.relationshipStrength));

          if (rel.relationshipStrength <= 10) {
            rel.status = 'ended';
            this.addLifeEvent({
              id: Date.now().toString(),
              title: 'Relationship Ended',
              description: `Your relationship with ${rel.name} has ended`,
              year: character.age,
              impact: { happiness: -15 }
            });
          }
        }
      }
    });

    // Update education progress
    character.education.forEach(edu => {
      if (!edu.completed && character.age >= edu.endYear) {
        edu.completed = true;
        edu.gpa = Math.random() * 2 + 2; // 2.0 to 4.0 GPA

        this.addLifeEvent({
          id: Date.now().toString(),
          title: 'Graduated',
          description: `You graduated from ${edu.institution} with a ${edu.gpa.toFixed(1)} GPA!`,
          year: character.age,
          impact: { intelligence: 15, happiness: 25 }
        });
      }
    });
  }

  private addTransaction(transaction: any): void {
    this.gameState.character.bankAccount.transactions.unshift(transaction);
    // Keep only last 50 transactions
    if (this.gameState.character.bankAccount.transactions.length > 50) {
      this.gameState.character.bankAccount.transactions = 
        this.gameState.character.bankAccount.transactions.slice(0, 50);
    }
  }

  private checkAchievements(): void {
    const character = this.gameState.character;
    const existingAchievements = character.achievements.map(a => a.id);

    // Age milestones
    const ageMilestones = [1, 5, 10, 13, 16, 18, 21, 25, 30, 40, 50, 65, 75, 80, 90, 100];
    ageMilestones.forEach(milestone => {
      const achievementId = `age-${milestone}`;
      if (character.age === milestone && !existingAchievements.includes(achievementId)) {
        this.unlockAchievement({
          id: achievementId,
          name: `${milestone} Years Old`,
          description: `Reached the age of ${milestone}`,
          unlockedYear: character.age
        });
      }
    });

    // Wealth achievements
    const wealthMilestones = [
      { amount: 1000, name: 'First Thousand', id: 'wealth-1k' },
      { amount: 10000, name: 'Ten Grand', id: 'wealth-10k' },
      { amount: 100000, name: 'Six Figures', id: 'wealth-100k' },
      { amount: 1000000, name: 'Millionaire', id: 'wealth-1m' },
      { amount: 10000000, name: 'Multi-Millionaire', id: 'wealth-10m' }
    ];

    wealthMilestones.forEach(milestone => {
      if (character.bankAccount.balance >= milestone.amount && 
          !existingAchievements.includes(milestone.id)) {
        this.unlockAchievement({
          id: milestone.id,
          name: milestone.name,
          description: `Accumulated $${milestone.amount.toLocaleString()}`,
          unlockedYear: character.age
        });
      }
    });

    // Life events achievements
    if (character.lifeEvents.length >= 50 && !existingAchievements.includes('eventful-life')) {
      this.unlockAchievement({
        id: 'eventful-life',
        name: 'Eventful Life',
        description: 'Experienced 50 major life events',
        unlockedYear: character.age
      });
    }

    // Perfect stats achievements
    Object.entries(character.stats).forEach(([stat, value]) => {
      const achievementId = `perfect-${stat}`;
      if (value === 100 && !existingAchievements.includes(achievementId)) {
        this.unlockAchievement({
          id: achievementId,
          name: `Perfect ${stat.charAt(0).toUpperCase() + stat.slice(1)}`,
          description: `Achieved maximum ${stat}`,
          unlockedYear: character.age
        });
      }
    });
  }

  private unlockAchievement(achievement: Achievement): void {
    this.gameState.character.achievements.push(achievement);
    this.addLifeEvent({
      id: Date.now().toString(),
      title: 'Achievement Unlocked!',
      description: `${achievement.name}: ${achievement.description}`,
      year: this.gameState.character.age,
      impact: { happiness: 10 }
    });
  }

  addLifeEvent(event: LifeEvent): void {
    this.gameState.character.lifeEvents.unshift(event);

    // Apply impacts
    if (event.impact) {
      const stats = this.gameState.character.stats;
      if (event.impact.health) stats.health = Math.max(0, Math.min(100, stats.health + event.impact.health));
      if (event.impact.intelligence) stats.intelligence = Math.max(0, Math.min(100, stats.intelligence + event.impact.intelligence));
      if (event.impact.looks) stats.looks = Math.max(0, Math.min(100, stats.looks + event.impact.looks));
      if (event.impact.happiness) stats.happiness = Math.max(0, Math.min(100, stats.happiness + event.impact.happiness));
    }

    // Keep only last 100 events
    if (this.gameState.character.lifeEvents.length > 100) {
      this.gameState.character.lifeEvents = this.gameState.character.lifeEvents.slice(0, 100);
    }
  }

  getCountry(id: string) {
    return this.gameState.countries.find(c => c.id === id);
  }

  getCountryName(id: string): string {
    const country = this.getCountry(id);
    return country ? country.name : 'Unknown';
  }

  getCrimeSystem(): CrimeSystem {
    return this.crimeSystem;
  }

  getDecisionSystem(): DecisionSystem {
    return this.decisionSystem;
  }

  commitCrime(crimeId: string): any {
    const result = this.crimeSystem.commitCrime(this.gameState.character, crimeId);
    if (result.success && result.moneyGained) {
      this.gameState.character.bankAccount.balance += result.moneyGained;
      this.addTransaction({
        id: Date.now().toString(),
        amount: result.moneyGained,
        type: 'income' as const,
        description: `Crime: ${crimeId}`,
        date: new Date()
      });
    }
    return result;
  }

  applyForJob(careerId: string): any {
    const career = this.gameState.careers.find(c => c.id === careerId);
    if (!career) {
      return { success: false, message: 'Job not found' };
    }

    if (this.gameState.character.age < 16) {
      return { success: false, message: 'You must be at least 16 years old to work' };
    }

    // Check education requirements
    if (career.educationRequired.length > 0 && career.educationRequired[0] !== 'None') {
      const hasRequiredEducation = career.educationRequired.some(req => 
        this.gameState.character.education.some(edu => 
          edu.degree.toLowerCase().includes(req.toLowerCase()) || 
          edu.field.toLowerCase().includes(req.toLowerCase())
        )
      );
      if (!hasRequiredEducation) {
        return { 
          success: false, 
          message: `You need education in: ${career.educationRequired.join(', ')}` 
        };
      }
    }

    // Success chance based on stats and requirements
    const successChance = Math.min(90, 
      (this.gameState.character.stats.intelligence * 0.4) + 
      (this.gameState.character.stats.looks * 0.2) + 
      (this.gameState.character.stats.happiness * 0.2) + 
      20
    );

    if (Math.random() * 100 < successChance) {
      this.gameState.character.career = {
        id: career.id,
        title: career.name,
        company: this.generateCompanyName(career),
        salary: career.baseSalary,
        experience: 0,
        startYear: this.gameState.currentYear,
        level: 1
      };

      this.addLifeEvent({
        id: Date.now().toString(),
        title: 'New Job!',
        description: `Started working as ${career.name} at ${this.gameState.character.career.company}`,
        year: this.gameState.character.age,
        impact: { happiness: 10 }
      });

      return { 
        success: true, 
        message: `Congratulations! You got the job as ${career.name}!` 
      };
    } else {
      return { 
        success: false, 
        message: 'Unfortunately, you were not selected for this position. Try improving your stats and applying again.' 
      };
    }
  }

  private generateCompanyName(career: any): string {
    const companyPrefixes = ['Global', 'Premier', 'Elite', 'Advanced', 'Innovative', 'Dynamic', 'Superior', 'Prime'];
    const companySuffixes = ['Corp', 'Inc', 'LLC', 'Group', 'Solutions', 'Services', 'Industries', 'Enterprises'];

    const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
    const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];

    return `${prefix} ${suffix}`;
  }

  endGame(): void {
    this.addLifeEvent({
      id: Date.now().toString(),
      title: 'Life Ended',
      description: 'Your journey has come to an end.',
      year: this.gameState.character.age,
      impact: {}
    });

    // Save final state
    this.saveGame();

    // Reset for new game
    this.resetGame();
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  saveGame(): void {
    const saveData = {
      gameState: this.gameState,
      timestamp: Date.now()
    };
    localStorage.setItem(this.saveKey, JSON.stringify(saveData));
  }

  commitSuicide(): { isDead: boolean, causeOfDeath: string } {
    // Add a final life event
    const suicideEvent: LifeEvent = {
      id: `suicide-${Date.now()}`,
      title: 'Made a Final Decision',
      description: 'You decided to end your life.',
      year: this.gameState.currentYear,
      impact: {}
    };

    this.gameState.character.lifeEvents.push(suicideEvent);
    return { isDead: true, causeOfDeath: 'suicide' };
  }

  loadGame(): boolean {
    try {
      const saved = localStorage.getItem(this.saveKey);
      if (saved) {
        this.gameState = JSON.parse(saved);
        return true;
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
    return false;
  }

  resetGame(): void {
    localStorage.removeItem(this.saveKey);
    this.gameState = this.initializeGameState();
  }
}