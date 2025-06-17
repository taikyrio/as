import React, { useState, useEffect } from 'react';
import { Play, FileText, Settings, BarChart3, Save, Trash2, Calendar, Zap } from 'lucide-react';
import { localDB, SaveData } from '../engine/LocalDatabase';

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: (saveData: SaveData) => void;
  onSettings: () => void;
  onStats: () => void;
  hasExistingSave: boolean;
  onQuickStart: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onLoadGame,
  onSettings,
  onStats,
  hasExistingSave,
  onQuickStart
}) => {
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [saves, setSaves] = useState<SaveData[]>([]);

  useEffect(() => {
    setSaves(localDB.getAllSaves());
  }, []);

  const handleDeleteSave = (saveId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this save?')) {
      localDB.deleteSave(saveId);
      setSaves(localDB.getAllSaves());
    }
  };

  const LoadGameMenu = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 w-full max-w-md max-h-[80vh] border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Load Game</h2>
          <button
            onClick={() => setShowLoadMenu(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {saves.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">No saved games found</p>
            </div>
          ) : (
            saves.map((save) => (
              <div
                key={save.id}
                onClick={() => {
                  onLoadGame(save);
                  setShowLoadMenu(false);
                }}
                className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer group border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-purple-200 transition-colors">
                      {save.character.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-white/70 mt-1">
                      <span>Age {save.character.age}</span>
                      <span>${save.character.money.toLocaleString()}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(save.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSave(save.id, e)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="text-8xl mb-4">🎮</div>
            <h1 className="text-6xl font-bold text-white mb-2 tracking-tight bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              LifeSim
            </h1>
          </div>
          <p className="text-xl text-purple-200 mb-2">Live Your Digital Life</p>
          <p className="text-sm text-white/60">Make choices, build relationships, chase dreams</p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mt-4 rounded"></div>
        </div>

        <div className="space-y-4">
          <MenuButton
            icon={<Play className="w-6 h-6" />}
            text="New Life"
            subtitle="Start fresh adventure"
            onClick={onNewGame}
            primary={true}
          />

          <MenuButton
            icon={<Zap className="w-6 h-6" />}
            text="Quick Start"
            subtitle="Jump into a random life"
            onClick={onQuickStart}
          />

          <MenuButton
            icon={<FileText className="w-6 h-6" />}
            text="Continue Life"
            subtitle={saves.length > 0 ? `${saves.length} save${saves.length !== 1 ? 's' : ''} available` : "No saves found"}
            onClick={() => setShowLoadMenu(true)}
            disabled={saves.length === 0}
          />

          <MenuButton
            icon={<BarChart3 className="w-6 h-6" />}
            text="Statistics"
            subtitle="View your achievements"
            onClick={onStats}
          />

          <MenuButton
            icon={<Settings className="w-6 h-6" />}
            text="Settings"
            subtitle="Customize your experience"
            onClick={onSettings}
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-purple-300 text-sm leading-relaxed">
            A comprehensive life simulation where every choice matters.<br />
            Build your legacy, one decision at a time.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/50">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Made with ❤️</span>
          </div>
        </div>
      </div>

      {showLoadMenu && <LoadGameMenu />}
    </div>
  );
};

interface MenuButtonProps {
  icon: React.ReactNode;
  text: string;
  subtitle?: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ 
  icon, 
  text, 
  subtitle, 
  onClick, 
  primary = false, 
  disabled = false 
}) => {
  const baseClasses = "w-full flex items-center gap-4 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  const primaryClasses = "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25";
  const secondaryClasses = "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="text-lg">{text}</div>
        {subtitle && (
          <div className="text-sm opacity-70 font-normal">{subtitle}</div>
        )}
      </div>
    </button>
  );
};