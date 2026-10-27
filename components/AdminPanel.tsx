
import React, { useMemo } from 'react';
import { Users, Activity, Trash2, Database, Zap, Mail, ShieldAlert } from 'lucide-react';
import { User, StudyPlan } from '../types';

interface AdminPanelProps {
  plans: StudyPlan[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ plans }) => {
  const users = useMemo(() => {
    const saved = localStorage.getItem('edumind_user_registry');
    return saved ? JSON.parse(saved) as (User & { status?: string, joins?: string })[] : [];
  }, []);

  const stats = [
    { 
      icon: Users, 
      label: 'Platform Users', 
      val: users.length.toString(), 
      color: 'var(--coffee)', 
      bg: 'rgba(196,149,106,0.12)' 
    },
    { 
      icon: Activity, 
      label: 'Total Roadmaps', 
      val: plans.length.toString(), 
      color: '#6ee7b7', 
      bg: 'rgba(110,231,183,0.12)' 
    },
    { 
      icon: Zap, 
      label: 'AI Tasks', 
      val: plans.reduce((acc, p) => acc + p.tasks.length, 0).toLocaleString(), 
      color: '#fbbf24', 
      bg: 'rgba(251,191,36,0.12)' 
    },
    { 
      icon: Database, 
      label: 'Data Integrity', 
      val: '99.9%', 
      color: '#c4956a', 
      bg: 'rgba(196,149,106,0.12)' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl card-hover relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: stat.bg, color: stat.color }}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>{stat.label}</p>
            <p className="text-2xl font-black mt-1" style={{ color: 'var(--cream)' }}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: 'var(--border)', background: 'rgba(196,149,106,0.03)' }}>
          <div>
            <h3 className="text-2xl font-bold font-display" style={{ color: 'var(--cream)' }}>User Intelligence</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Monitor and moderate all active system accounts.</p>
          </div>
          <div className="flex gap-3">
             <button className="btn-ghost px-6 py-3 rounded-xl text-sm font-bold">
              Export Audit
            </button>
            <button className="btn-primary px-6 py-3 rounded-xl text-sm font-bold">
              Manage System
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {users.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: 'rgba(196,149,106,0.04)', color: 'var(--text-dim)' }}>
                  <th className="px-8 py-5">Identity</th>
                  <th className="px-8 py-5">Permission</th>
                  <th className="px-8 py-5">System State</th>
                  <th className="px-8 py-5">Registry Date</th>
                  <th className="px-8 py-5 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {users.map((user) => (
                  <tr key={user.id} className="table-row-hover transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black group-hover:scale-110 transition-transform overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                          <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--cream)' }}>{user.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'admin' ? 'badge' : 'btn-ghost'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full dot-online" />
                        <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Active</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                      {user.joins || new Date().toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 btn-ghost rounded-xl">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-3 btn-ghost rounded-xl hover:text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldAlert className="w-12 h-12 mb-4" style={{ color: 'var(--text-dim)' }} />
              <p className="font-bold uppercase tracking-widest text-xs" style={{ color: 'var(--coffee)' }}>Registry Clean</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>No registered users currently found in the system state.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
