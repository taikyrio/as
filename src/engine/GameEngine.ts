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

  private initializeGameState(): GameState {
    return {
      character: this.createNewCharacter(),
      currentYear: new Date().getFullYear(),
      gameStarted: false,
      countries,
      careers,
      achievements: []
    };
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

  ageUp(): void {
    if (!this.gameState.gameStarted) return;
    
    this.gameState.character.age++;
    this.gameState.currentYear++;
    
    // Process aging effects
    this.processAging();
    
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
    if (this.checkForDeath()) {
      this.handleDeath();
      return;
    }
    
    this.saveGame();
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

  private checkForDeath(): boolean {
    const character = this.gameState.character;
    
    // Base death probability increases with age
    let deathProbability = 0;
    
    if (character.age < 1) deathProbability = 0.001;
    else if (character.age < 10) deathProbability = 0.0001;
    else if (character.age < 20) deathProbability = 0.0005;
    else if (character.age < 40) deathProbability = 0.001;
    else if (character.age < 60) deathProbability = 0.005;
    else if (character.age < 80) deathProbability = 0.02;
    else deathProbability = 0.1;
    
    // Health affects death probability
    const healthFactor = (100 - character.stats.health) / 100;
    deathProbability += healthFactor * 0.05;
    
    // Criminal activity increases death risk
    const recentCrimes = character.criminalRecord.crimes.filter(c => 
      character.age - c.year <= 5
    ).length;
    deathProbability += recentCrimes * 0.01;
    
    return Math.random() < deathProbability;
  }

  private handleDeath(): void {
    const character = this.gameState.character;
    
    // Determine cause of death
    let causeOfDeath = 'natural causes';
    if (character.stats.health < 20) causeOfDeath = 'illness';
    else if (character.age < 30 && Math.random() < 0.3) causeOfDeath = 'accident';
    else if (character.criminalRecord.crimes.length > 0 && Math.random() < 0.2) causeOfDeath = 'violence';
    
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
    return this.crimeSystem.commitCrime(this.gameState.character, crimeId);
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  saveGame(): void {
    try {
      localStorage.setItem(this.saveKey, JSON.stringify(this.gameState));
    } catch (error) {
      console.error('Failed to save game:', error);
    }
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