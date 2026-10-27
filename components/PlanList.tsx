
import React from 'react';
import { Calendar, Clock, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { StudyPlan } from '../types';

interface PlanListProps {
  plans: StudyPlan[];
  onSelectPlan: (plan: StudyPlan) => void;
}

const PlanList: React.FC<PlanListProps> = ({ plans, onSelectPlan }) => {
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(196,149,106,0.08)', border: '1px solid rgba(196,149,106,0.15)' }}>
          <BookOpen className="w-10 h-10" style={{ color: 'var(--coffee)' }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--cream)' }}>No plans yet</h3>
        <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
          Use the "New Plan" tab to let AI build your personalized learning roadmap.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan, idx) => {
        const completed = plan.tasks.filter(t => t.completed).length;
        const progress  = plan.tasks.length ? Math.round((completed / plan.tasks.length) * 100) : 0;

        return (
          <div
            key={plan.id}
            onClick={() => onSelectPlan(plan)}
            className="glass rounded-2xl p-7 cursor-pointer card-hover group relative overflow-hidden"
            style={{ animationDelay: `${idx * 80}ms`, animation: 'fadeIn 0.5s ease-out both' }}
          >
            {/* Watermark icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity" style={{ transform: 'rotate(12deg)' }}>
              <BookOpen className="w-32 h-32" style={{ color: 'var(--coffee)' }} />
            </div>

            <div className="relative z-10">
              {/* Badge */}
              <div className="flex justify-between items-start mb-5">
                <span className="badge">AI Planned</span>
              </div>

              <h3 className="text-lg font-bold mb-5 break-words" style={{ color: 'var(--cream)' }}>
                {plan.subject}
              </h3>

              <div className="space-y-3 mb-6">
                {[
                  { icon: Calendar,     text: `Exam: ${new Date(plan.targetDate).toLocaleDateString()}` },
                  { icon: Clock,        text: `${plan.dailyHours}h daily effort` },
                  { icon: CheckCircle2, text: `${completed} of ${plan.tasks.length} tasks done` },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(196,149,106,0.08)' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: 'var(--coffee)' }} />
                    </div>
                    {text}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs font-bold mb-2" style={{ color: 'var(--text-dim)' }}>
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full progress-track">
                  <div className="h-full progress-fill rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div
                  className="p-2 rounded-xl transition-all group-hover:scale-110"
                  style={{ background: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.2)' }}
                >
                  <ChevronRight className="w-4 h-4" style={{ color: 'var(--coffee)' }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanList;
