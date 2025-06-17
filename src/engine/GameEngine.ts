import { GameState, Character, CharacterStats, LifeEvent, Achievement } from '../types/GameTypes';
import { countries } from '../data/countries';
import { careers } from '../data/careers';
import { EventSystem } from './EventSystem';
import { CrimeSystem } from './CrimeSystem';

export class GameEngine {
  private gameState: GameState;
  private eventSystem: EventSystem;
  private crimeSystem: CrimeSystem;
  private saveKey = 'lifesim-save';

  constructor() {
    this.eventSystem = new EventSystem();
    this.crimeSystem = new CrimeSystem();
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
      description: `You were born in ${this.getCountryName(country)}!`,
      year: this.gameState.character.birthYear,
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
    
    // Update finances
    this.updateFinances();
    
    // Check for achievements
    this.checkAchievements();
    
    this.saveGame();
  }

  private processAging(): void {
    const character = this.gameState.character;
    
    // Natural aging effects
    if (character.age > 40) {
      character.stats.health -= Math.floor(Math.random() * 3);
      character.stats.looks -= Math.floor(Math.random() * 2);
    }
    
    if (character.age > 65) {
      character.stats.health -= Math.floor(Math.random() * 5);
      character.stats.intelligence -= Math.floor(Math.random() * 2);
    }
    
    // Ensure stats don't go below 0
    character.stats.health = Math.max(0, character.stats.health);
    character.stats.intelligence = Math.max(0, character.stats.intelligence);
    character.stats.looks = Math.max(0, character.stats.looks);
    character.stats.happiness = Math.max(0, character.stats.happiness);
  }

  private updateFinances(): void {
    const character = this.gameState.character;
    
    if (character.career) {
      const salary = character.career.salary;
      character.bankAccount.balance += salary / 12; // Monthly salary
      character.bankAccount.income += salary / 12;
      
      this.addTransaction({
        id: Date.now().toString(),
        amount: salary / 12,
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
    
    // Milestone achievements
    if (character.age === 18 && !existingAchievements.includes('adult')) {
      this.unlockAchievement({
        id: 'adult',
        name: 'Coming of Age',
        description: 'Reached adulthood at 18 years old',
        unlockedYear: character.age
      });
    }
    
    if (character.age === 65 && !existingAchievements.includes('retirement')) {
      this.unlockAchievement({
        id: 'retirement',
        name: 'Golden Years',
        description: 'Reached retirement age',
        unlockedYear: character.age
      });
    }
    
    // Wealth achievements
    if (character.bankAccount.balance >= 100000 && !existingAchievements.includes('wealthy')) {
      this.unlockAchievement({
        id: 'wealthy',
        name: 'Six Figures',
        description: 'Accumulated $100,000 in savings',
        unlockedYear: character.age
      });
    }
    
    if (character.bankAccount.balance >= 1000000 && !existingAchievements.includes('millionaire')) {
      this.unlockAchievement({
        id: 'millionaire',
        name: 'Millionaire',
        description: 'Became a millionaire',
        unlockedYear: character.age
      });
    }
  }

  private unlockAchievement(achievement: Achievement): void {
    this.gameState.character.achievements.push(achievement);
    this.addLifeEvent({
      id: Date.now().toString(),
      title: 'Achievement Unlocked',
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

  commitCrime(crimeId: string): any {
    return this.crimeSystem.commitCrime(this.gameState.character, crimeId);
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  saveGame(): void {
    localStorage.setItem(this.saveKey, JSON.stringify(this.gameState));
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