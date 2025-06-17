
import { GameState, Character } from '../types/GameTypes';

export interface SaveData {
  id: string;
  name: string;
  character: Character;
  gameState: GameState;
  timestamp: number;
  version: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  notifications: boolean;
  autoSaveInterval: number;
}

export class LocalDatabase {
  private static instance: LocalDatabase;
  private readonly SAVE_PREFIX = 'lifesim-save-';
  private readonly SETTINGS_KEY = 'lifesim-settings';
  private readonly STATS_KEY = 'lifesim-global-stats';
  private readonly VERSION = '1.0.0';

  static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  // Save Management
  saveGame(character: Character, gameState: GameState, name?: string): string {
    const saveId = `save_${Date.now()}`;
    const saveName = name || `${character.name} - Age ${character.age}`;
    
    const saveData: SaveData = {
      id: saveId,
      name: saveName,
      character: { ...character },
      gameState: { ...gameState },
      timestamp: Date.now(),
      version: this.VERSION
    };

    localStorage.setItem(this.SAVE_PREFIX + saveId, JSON.stringify(saveData));
    this.updateGlobalStats('gamesPlayed', 1);
    return saveId;
  }

  loadGame(saveId: string): SaveData | null {
    try {
      const data = localStorage.getItem(this.SAVE_PREFIX + saveId);
      if (!data) return null;
      return JSON.parse(data) as SaveData;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  getAllSaves(): SaveData[] {
    const saves: SaveData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.SAVE_PREFIX)) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            saves.push(JSON.parse(data));
          }
        } catch (error) {
          console.error('Failed to parse save:', error);
        }
      }
    }
    return saves.sort((a, b) => b.timestamp - a.timestamp);
  }

  deleteSave(saveId: string): boolean {
    try {
      localStorage.removeItem(this.SAVE_PREFIX + saveId);
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }

  getLatestSave(): SaveData | null {
    const saves = this.getAllSaves();
    return saves.length > 0 ? saves[0] : null;
  }

  // Settings Management
  saveSettings(settings: GameSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  loadSettings(): GameSettings {
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    
    // Default settings
    return {
      soundEnabled: true,
      theme: 'dark',
      autoSave: true,
      notifications: true,
      autoSaveInterval: 30000
    };
  }

  // Global Statistics
  updateGlobalStats(stat: string, value: number): void {
    try {
      const stats = this.getGlobalStats();
      stats[stat] = (stats[stat] || 0) + value;
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to update global stats:', error);
    }
  }

  getGlobalStats(): Record<string, number> {
    try {
      const data = localStorage.getItem(this.STATS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load global stats:', error);
      return {};
    }
  }

  // Data Management
  exportData(): string {
    const data = {
      saves: this.getAllSaves(),
      settings: this.loadSettings(),
      globalStats: this.getGlobalStats(),
      exportDate: new Date().toISOString(),
      version: this.VERSION
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      // Import saves
      if (data.saves && Array.isArray(data.saves)) {
        data.saves.forEach((save: SaveData) => {
          localStorage.setItem(this.SAVE_PREFIX + save.id, JSON.stringify(save));
        });
      }
      
      // Import settings
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      
      // Import global stats
      if (data.globalStats) {
        localStorage.setItem(this.STATS_KEY, JSON.stringify(data.globalStats));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  clearAllData(): void {
    // Clear all saves
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.SAVE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear settings and stats
    localStorage.removeItem(this.SETTINGS_KEY);
    localStorage.removeItem(this.STATS_KEY);
  }

  // Storage size calculation
  getStorageUsage(): { used: number; total: number; percentage: number } {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('lifesim-')) {
        used += (localStorage.getItem(key) || '').length;
      }
    }
    
    const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
    return {
      used,
      total,
      percentage: (used / total) * 100
    };
  }
}

export const localDB = LocalDatabase.getInstance();
