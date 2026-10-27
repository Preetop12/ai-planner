
import React from 'react';
import { ArrowLeft, CheckCircle2, Circle, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { StudyPlan } from '../types';

interface PlanViewProps {
  plan: StudyPlan;
  onBack: () => void;
  onToggleTask: (taskId: string) => void;
}

const PlanView: React.FC<PlanViewProps> = ({ plan, onBack, onToggleTask }) => {
  const completedCount = plan.tasks.filter(t => t.completed).length;
  const progress = plan.tasks.length ? Math.round((completedCount / plan.tasks.length) * 100) : 0;
  const daysLeft = Math.max(0, Math.ceil((new Date(plan.targetDate).getTime() - Date.now()) / 86400000));

  return (
    <div className="space-y-8" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--coffee)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </button>

        <div className="glass rounded-2xl px-6 py-3 flex items-center gap-6">
          {[
            { label: 'Progress', val: `${progress}%`, color: 'var(--coffee)' },
            { label: 'Days Left', val: daysLeft.toString(), color: '#fbbf24' },
          ].map(({ label, val, color }, i) => (
            <div key={i} className="text-center">
              <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-dim)' }}>{label}</p>
              <p className="text-xl font-black" style={{ color }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary sidebar */}
        <div className="lg:col-span-1 space-y-5">
          {/* Subject card */}
          <div className="rounded-2xl p-7 text-white" style={{ background: 'linear-gradient(135deg, #5c3420 0%, #2c1810 100%)', border: '1px solid rgba(196,149,106,0.25)' }}>
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--cream)' }}>{plan.subject}</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>AI-engineered path to mastery</p>
            <div className="space-y-3">
              {[
                { icon: Clock,    label: 'Daily Target', val: `${plan.dailyHours} hours` },
                { icon: BookOpen, label: 'Total Topics',  val: `${plan.tasks.length} modules` },
              ].map(({ icon: Icon, label, val }, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(196,149,106,0.08)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--coffee)' }} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>{label}</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--cream)' }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--cream)' }}>
              <AlertCircle className="w-4 h-4" style={{ color: 'var(--coffee)' }} />
              Study Tips
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              {[
                'Take a 5-min break every 25 min (Pomodoro).',
                'Review yesterday\'s topics before starting new ones.',
                'Stay hydrated — aim for 7+ hours of sleep.',
              ].map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--coffee)' }} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(196,149,106,0.1)', background: 'rgba(196,149,106,0.03)' }}>
              <h3 className="font-bold" style={{ color: 'var(--cream)' }}>Learning Roadmap</h3>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{completedCount}/{plan.tasks.length} done</span>
            </div>

            <div className="p-3 max-h-[600px] overflow-y-auto no-scrollbar">
              {plan.tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: task.completed ? 'rgba(110,231,183,0.05)' : 'transparent',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={e => { if (!task.completed) (e.currentTarget as HTMLElement).style.background = 'rgba(196,149,106,0.05)'; }}
                  onMouseLeave={e => { if (!task.completed) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div className="mt-1 flex-shrink-0">
                    {task.completed
                      ? <CheckCircle2 className="w-5 h-5" style={{ color: '#6ee7b7' }} />
                      : <Circle className="w-5 h-5 transition-colors" style={{ color: 'var(--text-dim)' }} />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--coffee)' }}>Day {task.day}</span>
                      <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{task.durationMinutes} min</span>
                    </div>
                    <h4 className="font-bold transition-all" style={{ color: task.completed ? 'var(--text-dim)' : 'var(--cream)', textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.topic}
                    </h4>
                    {task.subtopics && task.subtopics.length > 0 && !task.completed && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {task.subtopics.map((sub, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs font-bold uppercase" style={{ background: 'rgba(196,149,106,0.08)', color: 'var(--text-muted)', border: '1px solid rgba(196,149,106,0.12)' }}>
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanView;
