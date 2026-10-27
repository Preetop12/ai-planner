
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Trophy, Target, Flame, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { StudyPlan } from '../types';

const COFFEE = '#c4956a';
const COFFEE_DIM = '#a87040';

interface DashboardProps { plans: StudyPlan[]; }

const Dashboard: React.FC<DashboardProps> = ({ plans }) => {
  const totalTasks    = plans.reduce((a, p) => a + p.tasks.length, 0);
  const completedTasks = plans.reduce((a, p) => a + p.tasks.filter(t => t.completed).length, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalHours    = plans.reduce((a, p) => a + (p.dailyHours * (p.tasks.length > 0 ? 1 : 0)), 0);
  const hasPlans = plans.length > 0;

  const chartData = [
    { name: 'Mon', hours: hasPlans ? 2 : 0, tasks: hasPlans ? 1 : 0 },
    { name: 'Tue', hours: hasPlans ? 3 : 0, tasks: hasPlans ? 2 : 0 },
    { name: 'Wed', hours: hasPlans ? 4 : 0, tasks: hasPlans ? 3 : 0 },
    { name: 'Thu', hours: hasPlans ? 2 : 0, tasks: hasPlans ? 1 : 0 },
    { name: 'Fri', hours: hasPlans ? 5 : 0, tasks: hasPlans ? 4 : 0 },
    { name: 'Sat', hours: hasPlans ? 7 : 0, tasks: hasPlans ? 6 : 0 },
    { name: 'Sun', hours: hasPlans ? 3 : 0, tasks: hasPlans ? 2 : 0 },
  ];

  const stats = [
    { icon: Clock,        label: 'Daily Effort',  value: `${totalHours}h`, accent: COFFEE },
    { icon: CheckCircle2, label: 'Completion',    value: `${completionRate}%`, accent: '#6ee7b7' },
    { icon: Flame,        label: 'Study Streak',  value: hasPlans ? '1 Day' : '0 Days', accent: '#fbbf24' },
    { icon: Trophy,       label: 'Focus Score',   value: hasPlans ? '85' : '0', accent: '#f87171' },
  ];

  const tooltipStyle = {
    backgroundColor: 'rgba(26, 14, 8, 0.95)',
    borderRadius: '16px',
    border: '1px solid rgba(196,149,106,0.2)',
    color: 'var(--cream)',
    padding: '12px'
  };

  return (
    <div className="space-y-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ icon: Icon, label, value, accent }, i) => (
          <div key={i} className="glass rounded-2xl p-6 card-hover relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl opacity-15" style={{ background: accent }} />
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
                <Icon className="w-6 h-6" style={{ color: accent }} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-dim)' }}>{label}</p>
                <p className="text-2xl font-black" style={{ color: 'var(--cream)' }}>{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area chart */}
        <div className="glass rounded-2xl p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--cream)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: COFFEE }} />
              Learning Velocity
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: COFFEE }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>Live</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COFFEE} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COFFEE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(196,149,106,0.06)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12, fontWeight: 700 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: COFFEE, strokeWidth: 2 }} />
                <Area type="monotone" dataKey="hours" stroke={COFFEE} strokeWidth={4} fillOpacity={1} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart */}
        <div className="glass rounded-2xl p-8">
          <h3 className="font-bold mb-8 flex items-center gap-2" style={{ color: 'var(--cream)' }}>
            <Target className="w-5 h-5" style={{ color: COFFEE_DIM }} />
            Task Density
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(196,149,106,0.06)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12, fontWeight: 700 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(196,149,106,0.04)' }} />
                <Bar dataKey="tasks" fill={COFFEE_DIM} radius={[8, 8, 3, 3]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
