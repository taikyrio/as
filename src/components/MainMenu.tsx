import React from 'react';
import { Play, FileText, Settings, BarChart3, Users } from 'lucide-react';

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
  onStats: () => void;
  hasExistingSave: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onLoadGame,
  onSettings,
  onStats,
  hasExistingSave
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-2 tracking-tight">
            LifeSim
          </h1>
          <p className="text-xl text-purple-200">Live Your Digital Life</p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mt-4 rounded"></div>
        </div>
        
        <div className="space-y-4">
          <MenuButton
            icon={<Play className="w-6 h-6" />}
            text="New Life"
            onClick={onNewGame}
            primary={true}
          />
          
          {hasExistingSave && (
            <MenuButton
              icon={<FileText className="w-6 h-6" />}
              text="Continue Life"
              onClick={onLoadGame}
            />
          )}
          
          <MenuButton
            icon={<BarChart3 className="w-6 h-6" />}
            text="Statistics"
            onClick={onStats}
          />
          
          <MenuButton
            icon={<Settings className="w-6 h-6" />}
            text="Settings"
            onClick={onSettings}
          />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-purple-300 text-sm">
            A comprehensive life simulation experience
          </p>
        </div>
      </div>
    </div>
  );
};

interface MenuButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  primary?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, text, onClick, primary = false }) => {
  const baseClasses = "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl";
  const primaryClasses = "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600";
  const secondaryClasses = "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};