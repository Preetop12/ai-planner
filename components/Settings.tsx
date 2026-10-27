
import React from 'react';
import { User as UserIcon, Bell, Shield, Moon, Sun, Smartphone, Globe } from 'lucide-react';
import { User } from '../types';

interface SettingsProps {
  user: User;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onReset: () => void;
}

const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300"
    style={active ? { background: 'linear-gradient(135deg, #c4956a, #8b5a30)' } : { background: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.15)' }}
  >
    <span
      className="inline-block h-4 w-4 rounded-full transition-transform duration-300"
      style={{ background: '#fff8f0', transform: active ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
    />
  </button>
);

const Settings: React.FC<SettingsProps> = ({ user, theme, onThemeToggle, onReset }) => {
  const rowStyle = { background: 'rgba(196,149,106,0.04)', border: '1px solid rgba(196,149,106,0.08)' };

  return (
    <div className="max-w-4xl mx-auto space-y-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Profile */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(196,149,106,0.08)', border: '1px solid rgba(196,149,106,0.15)' }}>
            <UserIcon className="w-5 h-5" style={{ color: 'var(--coffee)' }} />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: 'var(--cream)' }}>Personal Profile</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your identity and credentials.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <img src={user.avatar} className="w-28 h-28 rounded-2xl object-cover" style={{ border: '3px solid rgba(196,149,106,0.3)' }} alt="Avatar" />
            <button className="absolute -bottom-2 -right-2 p-2 rounded-xl transition-colors" style={{ background: 'linear-gradient(135deg, #c4956a, #8b5a30)', color: '#fff8f0' }}>
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[['Full Name', 'text', user.name], ['Email', 'email', user.email]].map(([label, type, val], i) => (
                <div key={i}>
                  <label className="text-xs font-black uppercase tracking-widest ml-1 block mb-2" style={{ color: 'var(--text-dim)' }}>{label}</label>
                  <input type={type as string} value={val} readOnly className="pro-input w-full px-5 py-3.5 rounded-xl text-sm opacity-70" />
                </div>
              ))}
            </div>
            <button className="btn-ghost px-6 py-2.5 rounded-xl text-sm">Update Information</button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(196,149,106,0.08)', border: '1px solid rgba(196,149,106,0.15)' }}>
            <Globe className="w-5 h-5" style={{ color: 'var(--coffee)' }} />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: 'var(--cream)' }}>App Preferences</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Customize how EduMind AI behaves.</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { icon: theme === 'dark' ? Moon : Sun, label: 'Dark Mode', desc: 'Toggle interface visual state.', active: theme === 'dark', onToggle: onThemeToggle, color: 'var(--coffee)' },
            { icon: Bell, label: 'Push Reminders', desc: 'Alerts before scheduled study sessions.', active: true, onToggle: () => {}, color: '#f87171' },
            { icon: Shield, label: 'Biometric Security', desc: 'Face or fingerprint login for this device.', active: false, onToggle: () => {}, color: '#6ee7b7' },
          ].map(({ icon: Icon, label, desc, active, onToggle, color }, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-xl" style={rowStyle}>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl" style={{ background: `${color}12` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--cream)' }}>{label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{desc}</p>
                </div>
              </div>
              <Toggle active={active} onToggle={onToggle} />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass rounded-2xl p-8" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.03)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold" style={{ color: '#fca5a5' }}>Danger Zone</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Delete all study plans and user data permanently.</p>
          </div>
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl text-sm font-black transition-all"
            style={{ color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.14)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.06)'}
          >
            Wipe All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
