
import React from 'react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Target, Zap, Clock, TrendingUp, Award } from 'lucide-react';
import { StudyPlan } from '../types';

const COFFEE = '#c4956a';
const COFFEE_DIM = '#a87040';
const COLORS = ['#c4956a', '#a87040', '#8b5a30', '#d4b070', '#7a4a28'];

interface ProgressProps { plans: StudyPlan[]; }

const Progress: React.FC<ProgressProps> = ({ plans }) => {
  const hasData = plans.length > 0;

  const trendData = [
    { day: 'Mon', focus: hasData ? 75 : 0, goal: hasData ? 80 : 0 },
    { day: 'Tue', focus: hasData ? 85 : 0, goal: hasData ? 80 : 0 },
    { day: 'Wed', focus: hasData ? 60 : 0, goal: hasData ? 80 : 0 },
    { day: 'Thu', focus: hasData ? 95 : 0, goal: hasData ? 80 : 0 },
    { day: 'Fri', focus: hasData ? 90 : 0, goal: hasData ? 80 : 0 },
    { day: 'Sat', focus: hasData ? 100 : 0, goal: hasData ? 80 : 0 },
    { day: 'Sun', focus: hasData ? 80 : 0, goal: hasData ? 80 : 0 },
  ];

  const subjectData = plans.map(p => ({ name: p.subject, value: p.tasks.filter(t => t.completed).length, total: p.tasks.length })).filter(d => d.total > 0);
  const totalCompleted = plans.reduce((a, p) => a + p.tasks.filter(t => t.completed).length, 0);
  const totalTasks     = plans.reduce((a, p) => a + p.tasks.length, 0);
  const globalProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const tooltipStyle = { backgroundColor: 'rgba(26,14,8,0.95)', borderRadius: '14px', border: '1px solid rgba(196,149,106,0.2)', color: 'var(--cream)', padding: '10px' };

  return (
    <div className="space-y-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--cream)' }}>Learning Insights</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Data-driven analysis of your study habits.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost px-4 py-2 rounded-xl text-xs">Weekly</button>
          <button className="btn-primary px-4 py-2 rounded-xl text-xs">Monthly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Global mastery ring */}
          <div className="glass rounded-2xl p-7 text-center relative overflow-hidden">
            <div className="absolute top-3 right-3 opacity-5">
              <Award className="w-20 h-20" style={{ color: 'var(--coffee)' }} />
            </div>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(196,149,106,0.08)', border: `4px solid ${COFFEE}` }}>
              <span className="text-2xl font-black grad-text">{globalProgress}%</span>
            </div>
            <h3 className="font-bold mb-1" style={{ color: 'var(--cream)' }}>Global Mastery</h3>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Aggregate across all subjects</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: totalCompleted, label: 'Completed', color: COFFEE },
                { val: totalTasks,     label: 'Total Tasks', color: 'var(--text-dim)' },
              ].map(({ val, label, color }, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(196,149,106,0.05)', border: '1px solid rgba(196,149,106,0.08)' }}>
                  <p className="text-lg font-black" style={{ color }}>{val}</p>
                  <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-dim)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subject allocation pie */}
          <div className="glass rounded-2xl p-7">
            <h3 className="font-bold flex items-center gap-2 mb-5" style={{ color: 'var(--cream)' }}>
              <Target className="w-4 h-4" style={{ color: COFFEE }} />
              Subject Allocation
            </h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={subjectData.length > 0 ? subjectData : [{ name: 'Empty', value: 1 }]} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {(subjectData.length > 0 ? subjectData : [{}]).map((_, i) => (
                      <Cell key={i} fill={subjectData.length > 0 ? COLORS[i % COLORS.length] : 'rgba(196,149,106,0.1)'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {subjectData.length > 0 ? subjectData.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span style={{ color: 'var(--text-muted)' }}>{s.name}</span>
                  </div>
                  <span style={{ color: 'var(--text-dim)' }}>{s.value} units</span>
                </div>
              )) : <p className="text-center text-xs" style={{ color: 'var(--text-dim)' }}>No data yet</p>}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Trend chart */}
          <div className="glass rounded-2xl p-7">
            <h3 className="font-bold flex items-center gap-2 mb-7" style={{ color: 'var(--cream)' }}>
              <TrendingUp className="w-4 h-4" style={{ color: COFFEE }} />
              Study Intensity Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={COFFEE} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={COFFEE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(196,149,106,0.06)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="focus" stroke={COFFEE} strokeWidth={3} fillOpacity={1} fill="url(#focusGrad)" />
                  <Area type="monotone" dataKey="goal" stroke="rgba(196,149,106,0.3)" strokeDasharray="5 5" strokeWidth={2} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mini stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: Zap,   label: 'Active Streak', sub: 'Consistency', val: hasData ? '14' : '0', unit: 'Days', color: '#fbbf24', bar: true },
              { icon: Clock, label: 'Deep Work',     sub: 'Efficiency',  val: hasData ? '88%' : '0%', note: hasData ? '+12% vs last week during mornings.' : 'Start a plan to track.', color: '#6ee7b7', bar: false },
            ].map(({ icon: Icon, label, sub, val, unit, color, bar, note }, i) => (
              <div key={i} className="glass rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl" style={{ background: `${color}12` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--cream)' }}>{label}</p>
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>{sub}</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-black" style={{ color }}>{val}</span>
                  {unit && <span className="font-bold" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
                </div>
                {bar && (
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7].map(j => (
                      <div key={j} className="h-1.5 flex-1 rounded-full" style={{ background: hasData && j < 6 ? color : 'rgba(196,149,106,0.1)' }} />
                    ))}
                  </div>
                )}
                {note && <p className="text-xs leading-snug" style={{ color: 'var(--text-dim)' }}>{note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
