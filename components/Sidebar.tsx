
import React from 'react';
import { LayoutDashboard, Calendar, Settings, LogOut, PlusCircle, ShieldCheck, BookOpen, BarChart3, HelpCircle } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard, role: 'user'  },
  { id: 'new-plan',  label: 'New Plan',    icon: PlusCircle,      role: 'user'  },
  { id: 'my-plans',  label: 'My Plans',    icon: BookOpen,        role: 'user'  },
  { id: 'doubt-chat',label: 'AI Doubt Chat', icon: HelpCircle,    role: 'user'  },
  { id: 'progress',  label: 'Progress',    icon: BarChart3,       role: 'user'  },
  { id: 'admin',     label: 'Admin Panel', icon: ShieldCheck,     role: 'admin' },
  { id: 'settings',  label: 'Settings',    icon: Settings,        role: 'user'  },
];

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, onLogout }) => (
  <div
    className="w-64 h-[calc(100vh-2.5rem)] flex flex-col fixed left-5 top-5 rounded-[2rem] z-50 no-scrollbar glass shadow-2xl"
    style={{
      boxShadow: '0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(196,149,106,0.1)'
    }}
  >
    {/* Logo */}
    <div className="px-7 pt-7 pb-5 flex items-center gap-3">
      <div className="w-11 h-11 btn-primary rounded-xl flex items-center justify-center flex-shrink-0">
        <Calendar className="w-6 h-6" style={{ color: '#fff8f0' }} />
      </div>
      <div>
        <h1 className="text-lg font-black tracking-tight" style={{ color: 'var(--cream)' }}>EduMind</h1>
        <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--coffee)' }}>AI Study OS</p>
      </div>
    </div>

    <div className="mx-6 divider mb-5" />

    {/* Nav */}
    <nav className="flex-1 px-4 space-y-1 no-scrollbar overflow-y-auto">
      {menuItems
        .filter(item => user.role === 'admin' || item.role === 'user')
        .map(item => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold relative ${active ? 'nav-active' : ''}`}
              style={{ color: active ? 'var(--coffee)' : 'var(--text-dim)' }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--cream-muted)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; }}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {active && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--coffee)', boxShadow: '0 0 8px rgba(196,149,106,0.8)' }} />
              )}
            </button>
          );
        })}
    </nav>

    {/* User card */}
    <div className="p-4">
      <div className="rounded-2xl p-4" style={{ background: 'rgba(196,149,106,0.05)', border: '1px solid rgba(196,149,106,0.1)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover"
              style={{ border: '2px solid rgba(196,149,106,0.3)' }}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 dot-online rounded-full border-2" style={{ borderColor: '#1a0e08' }} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate" style={{ color: 'var(--cream)' }}>{user.name}</p>
            <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--coffee)' }}>{user.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
          style={{
            color: '#f87171',
            background: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.12)'
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.14)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.06)'; }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  </div>
);

export default Sidebar;
