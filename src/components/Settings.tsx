
import React, { useState } from 'react';
import { X, Volume2, VolumeX, Monitor, Moon, Sun } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sound Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Audio</h3>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Sound Effects</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  soundEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {soundEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'light', label: 'Light', icon: Sun },
                { key: 'dark', label: 'Dark', icon: Moon },
                { key: 'auto', label: 'Auto', icon: Monitor }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key as any)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    theme === key ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Gameplay</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Auto-Save</span>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    autoSave ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                    autoSave ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Notifications</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    notifications ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                    notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Data</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                Export Save Data
              </button>
              <button className="w-full px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors">
                Import Save Data
              </button>
              <button className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
