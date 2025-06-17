import { Character, Crime, Imprisonment, CriminalRecord } from '../types/GameTypes';
import { crimeTypes, prisons, CrimeType, Prison } from '../data/crimeData';

export class CrimeSystem {
  commitCrime(character: Character, crimeId: string): CrimeResult {
    const crimeType = crimeTypes.find(c => c.id === crimeId);
    if (!crimeType) {
      return {
        success: false,
        caught: false,
        message: 'Invalid crime type'
      };
    }

    const success = this.calculateCrimeSuccess(character, crimeType);
    const caught = !success || Math.random() * 100 < this.calculateCatchProbability(character, crimeType);
    
    const crime: Crime = {
      id: Date.now().toString(),
      type: crimeType.name,
      severity: crimeType.difficulty,
      year: character.age,
      caught,
      sentence: caught ? this.calculateSentence(crimeType) : undefined
    };

    character.criminalRecord.crimes.push(crime);

    let result: CrimeResult = {
      success,
      caught,
      message: this.generateCrimeMessage(crimeType, success, caught),
      moneyGained: 0,
      sentence: 0
    };

    if (success && !caught) {
      const moneyGained = Math.floor(
        Math.random() * (crimeType.moneyRange[1] - crimeType.moneyRange[0]) + 
        crimeType.moneyRange[0]
      );
      character.bankAccount.balance += moneyGained;
      result.moneyGained = moneyGained;
      
      // Negative impact on happiness for successful crimes
      character.stats.happiness = Math.max(0, character.stats.happiness - Math.floor(crimeType.difficulty / 2));
    }

    if (caught && crime.sentence) {
      result.sentence = crime.sentence;
      this.sendToPrison(character, crime.sentence);
    }

    return result;
  }

  private calculateCrimeSuccess(character: Character, crimeType: CrimeType): boolean {
    let successRate = crimeType.successRate;
    
    // Adjust success rate based on character stats
    successRate += (character.stats.intelligence - 50) * 0.5;
    successRate += (character.stats.health - 50) * 0.2;
    
    // Criminal experience bonus
    const crimeExperience = character.criminalRecord.crimes.filter(c => 
      c.type === crimeType.name && !c.caught
    ).length;
    successRate += crimeExperience * 5;

    // Criminal history penalty (more likely to be suspected)
    const totalCrimes = character.criminalRecord.crimes.length;
    successRate -= totalCrimes * 2;

    return Math.random() * 100 < Math.max(10, Math.min(90, successRate));
  }

  private calculateCatchProbability(character: Character, crimeType: CrimeType): number {
    let catchRate = 100 - crimeType.successRate;
    
    // Criminal history increases catch probability
    const criminalHistory = character.criminalRecord.crimes.length;
    catchRate += criminalHistory * 3;
    
    // Recent crimes increase suspicion
    const recentCrimes = character.criminalRecord.crimes.filter(c => 
      character.age - c.year <= 2
    ).length;
    catchRate += recentCrimes * 5;

    return Math.max(5, Math.min(95, catchRate));
  }

  private calculateSentence(crimeType: CrimeType): number {
    const baseSentence = crimeType.minSentence;
    const maxSentence = crimeType.maxSentence;
    const variance = maxSentence - baseSentence;
    
    return Math.round((baseSentence + Math.random() * variance) * 12); // Convert to months
  }

  private sendToPrison(character: Character, sentenceMonths: number): void {
    const availablePrisons = prisons.filter(p => 
      this.getPrisonSecurityLevel(character) <= this.getSecurityLevelNum(p.securityLevel)
    );
    
    const prison = availablePrisons[Math.floor(Math.random() * availablePrisons.length)] || prisons[0];
    
    const imprisonment: Imprisonment = {
      id: Date.now().toString(),
      startYear: character.age,
      endYear: character.age + Math.ceil(sentenceMonths / 12),
      prison: prison.name,
      behavior: 50, // Start with neutral behavior
      jobsHeld: []
    };

    character.criminalRecord.imprisonments.push(imprisonment);
    character.criminalRecord.totalSentence += sentenceMonths;
    
    // Prison impacts based on security level
    const securityImpact = this.getSecurityLevelNum(prison.securityLevel);
    character.stats.happiness = Math.max(0, character.stats.happiness - (20 + securityImpact * 5));
    character.stats.health = Math.max(0, character.stats.health - (10 + securityImpact * 3));
    
    // Remove current job if employed
    if (character.career) {
      character.career = undefined;
    }
  }

  // Check if character is currently in prison
  isInPrison(character: Character, currentAge: number): boolean {
    return character.criminalRecord.imprisonments.some(imp => 
      currentAge >= imp.startYear && currentAge < imp.endYear
    );
  }

  // Process prison time effects during age up
  processPrisonTime(character: Character, currentYear: number): void {
    const currentImprisonment = character.criminalRecord.imprisonments.find(imp => 
      currentYear >= imp.startYear && currentYear < imp.endYear
    );

    if (currentImprisonment) {
      // Prison negatively affects stats over time
      if (Math.random() < 0.3) {
        character.stats.happiness = Math.max(0, character.stats.happiness - Math.floor(Math.random() * 3) + 1);
      }
      if (Math.random() < 0.2) {
        character.stats.health = Math.max(0, character.stats.health - Math.floor(Math.random() * 2) + 1);
      }
      
      // Chance for behavioral changes
      if (Math.random() < 0.1) {
        currentImprisonment.behavior += Math.floor(Math.random() * 21) - 10; // -10 to +10
        currentImprisonment.behavior = Math.max(0, Math.min(100, currentImprisonment.behavior));
      }
    }
  }

  private getPrisonSecurityLevel(character: Character): number {
    const totalSentence = character.criminalRecord.totalSentence;
    const violentCrimes = character.criminalRecord.crimes.filter(c => 
      c.type.includes('Assault') || c.type.includes('Murder')
    ).length;
    
    if (totalSentence > 120 || violentCrimes > 2) return 4; // Supermax
    if (totalSentence > 60 || violentCrimes > 0) return 3; // Maximum
    if (totalSentence > 12) return 2; // Medium
    return 1; // Minimum
  }

  private getSecurityLevelNum(level: string): number {
    switch (level) {
      case 'minimum': return 1;
      case 'medium': return 2;
      case 'maximum': return 3;
      case 'supermax': return 4;
      default: return 1;
    }
  }

  private generateCrimeMessage(crimeType: CrimeType, success: boolean, caught: boolean): string {
    if (!success) {
      return `Your attempt at ${crimeType.name.toLowerCase()} failed completely.`;
    }
    
    if (success && !caught) {
      return `You successfully committed ${crimeType.name.toLowerCase()} and got away with it!`;
    }
    
    if (caught) {
      return `You were caught attempting ${crimeType.name.toLowerCase()} and have been arrested!`;
    }
    
    return `Something went wrong with your ${crimeType.name.toLowerCase()} attempt.`;
  }

  getCrimeTypes(): CrimeType[] {
    return crimeTypes;
  }

  getPrisons(): Prison[] {
    return prisons;
  }
}

export interface CrimeResult {
  success: boolean;
  caught: boolean;
  message: string;
  moneyGained?: number;
  sentence?: number;
}