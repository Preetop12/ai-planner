
import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit, Zap, ShieldCheck, Target, Users, Moon, Sun } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, theme, toggleTheme }) => {
  return (
    <div className="min-h-screen" style={{ color: 'var(--text-primary)' }}>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" style={{ color: '#fff8f0' }} />
            </div>
            <span className="text-xl font-black tracking-tight" style={{ color: 'var(--cream)' }}>
              Edu<span className="grad-text">Mind</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
            <a href="#features" className="hover:text-amber-300 transition-colors" style={{ color: 'var(--text-muted)' }}>Features</a>
            <a href="#stats"    className="hover:text-amber-300 transition-colors" style={{ color: 'var(--text-muted)' }}>Impact</a>
            <a href="#about"    className="hover:text-amber-300 transition-colors" style={{ color: 'var(--text-muted)' }}>How It Works</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              aria-label="Toggle color theme"
              className="p-2.5 rounded-xl btn-ghost flex items-center justify-center transition-all hover:scale-105"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-amber-900" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </button>
            <button onClick={onStart} className="btn-primary px-6 py-2 rounded-xl text-sm">
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">

          <div className="badge inline-flex items-center gap-2 mb-8">
            <Sparkles className="w-3 h-3" />
            Powered by NVIDIA Nemotron Ultra
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 leading-[1.08] tracking-tight" style={{ color: 'var(--cream)' }}>
            Architect Your <br />
            <span className="grad-text">Learning Future.</span>
          </h1>

          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium" style={{ color: 'var(--text-muted)' }}>
            Stop guessing. Start mastering. EduMind AI converts your syllabus into a
            precision-engineered daily roadmap — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="group btn-primary w-full sm:w-auto px-10 py-5 rounded-3xl text-lg flex items-center justify-center gap-3"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-ghost w-full sm:w-auto px-10 py-5 rounded-3xl text-lg">
              Watch Demo
            </button>
          </div>

          {/* Floating mockup card */}
          <div className="mt-24 max-w-3xl mx-auto" style={{ animation: 'float 7s ease-in-out infinite' }}>
            <div className="glass rounded-[2.5rem] p-8 border" style={{ borderColor: 'var(--border-hover)' }}>
              {/* Fake top bar */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full" style={{ background: '#c4956a', opacity: 0.6 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#a87040', opacity: 0.4 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--text-dim)', opacity: 0.3 }} />
              </div>
              {/* Fake dashboard rows */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['Daily Goal', 'Completion', 'Streak'].map((label, i) => (
                  <div key={i} className="card rounded-2xl p-4 text-left">
                    <div className="h-1.5 w-16 rounded mb-3" style={{ background: 'rgba(196,149,106,0.2)' }} />
                    <div className="text-xl font-black grad-text">{['4h', '78%', '12d'][i]}</div>
                    <div className="text-xs font-bold mt-1" style={{ color: 'var(--text-dim)' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[90, 65, 45].map((w, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-2 rounded-full flex-1 progress-track">
                      <div className="h-full progress-fill rounded-full" style={{ width: `${w}%` }} />
                    </div>
                    <span className="text-xs font-bold w-8" style={{ color: 'var(--text-muted)' }}>{w}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--cream)' }}>
              Everything You Need to Succeed
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              A suite of tools built to remove friction from learning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BrainCircuit, title: 'AI Syllabus Analysis',  desc: 'Paste any syllabus. Nemotron Ultra breaks it into logical, daily learning blocks automatically.' },
              { icon: Zap,          title: 'Smart Scheduling',      desc: 'Adaptive workload balancing based on exam proximity and your daily availability.' },
              { icon: ShieldCheck,  title: 'Admin Controls',        desc: 'Enterprise role management: oversee entire student cohorts from a single dashboard.' },
            ].map((f, i) => (
              <div key={i} className="glass rounded-[2rem] p-10 card-hover">
                <div className="w-14 h-14 card rounded-2xl flex items-center justify-center mb-6" style={{ borderColor: 'rgba(196,149,106,0.3)' }}>
                  <f.icon className="w-7 h-7" style={{ color: 'var(--coffee)' }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--cream)' }}>{f.title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-10 leading-tight" style={{ color: 'var(--cream)' }}>
              Trusted by over<br /><span className="grad-text">50,000+ Students</span>
            </h2>
            <div className="grid grid-cols-2 gap-10">
              {[['92%', 'Score Improvement'], ['10h+', 'Saved per Week']].map(([val, label], i) => (
                <div key={i}>
                  <p className="text-5xl font-black grad-text mb-2">{val}</p>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 glass rounded-[2.5rem] p-10 card-hover relative">
            <div className="absolute -top-6 -right-6 w-16 h-16 glass rounded-full flex items-center justify-center" style={{ borderColor: 'var(--border-hover)' }}>
              <Users className="w-8 h-8" style={{ color: 'var(--coffee)' }} />
            </div>
            <p className="text-xl font-medium italic mb-8 leading-relaxed" style={{ color: 'var(--cream-muted)', fontFamily: 'Georgia, serif' }}>
              "EduMind AI took my messy semester syllabus and turned it into a clear plan. I stopped panicking and started studying. My GPA jumped from 3.2 to 3.9."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl btn-primary flex items-center justify-center text-white font-black text-lg">E</div>
              <div>
                <p className="font-bold" style={{ color: 'var(--cream)' }}>Emily Richardson</p>
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Computer Science, Stanford</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-16 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 btn-primary rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" style={{ color: '#fff8f0' }} />
            </div>
            <span className="text-xl font-black" style={{ color: 'var(--cream)' }}>EduMind <span className="grad-text">AI</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold mb-10" style={{ color: 'var(--text-dim)' }}>
            {['Twitter', 'Discord', 'Privacy', 'Security'].map(link => (
              <a key={link} href="#" className="hover:text-amber-400 transition-colors">{link}</a>
            ))}
          </div>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            © 2024 EduMind AI · Powered by NVIDIA Nemotron Ultra
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
