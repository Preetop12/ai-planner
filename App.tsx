
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Menu,
  Moon,
  Sun
} from 'lucide-react';
import { User, StudyPlan, PlanGenerationInput, Role } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PlanCreator from './components/PlanCreator';
import PlanList from './components/PlanList';
import PlanView from './components/PlanView';
import AdminPanel from './components/AdminPanel';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import Progress from './components/Progress';
import Settings from './components/Settings';
import { DoubtChat } from './components/DoubtChat';
import { generateStudyPlan } from './services/nemotronService';

type ViewState = 'landing' | 'auth' | 'app';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Persistent Stores
  const [plans, setPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem('study_plans');
    return saved ? JSON.parse(saved) : [];
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);

  // Auth Persistence Check
  useEffect(() => {
    const session = localStorage.getItem('edumind_current_session');
    if (session) {
      setUser(JSON.parse(session));
      setViewState('app');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('study_plans', JSON.stringify(plans));
  }, [plans]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- Authentication Logic ---

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const registry: any[] = JSON.parse(localStorage.getItem('edumind_user_registry') || '[]');
    const matched = registry.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (matched) {
      const { password: _, ...userProfile } = matched;
      setUser(userProfile as User);
      localStorage.setItem('edumind_current_session', JSON.stringify(userProfile));
      setViewState('app');
      setActiveTab(userProfile.role === 'admin' ? 'admin' : 'dashboard');
      addNotification(`Welcome back, ${userProfile.name}!`);
      return true;
    }
    return false;
  };

  const handleRegister = async (role: Role, email: string, name: string, password: string): Promise<boolean> => {
    const registry: any[] = JSON.parse(localStorage.getItem('edumind_user_registry') || '[]');
    if (registry.some(u => u.email.toLowerCase() === email.toLowerCase())) return false;

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      password, // In a real app, this would be hashed on server
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      joins: new Date().toLocaleDateString()
    };

    registry.push(newUser);
    localStorage.setItem('edumind_user_registry', JSON.stringify(registry));
    
    // Auto Login after registration
    const { password: _, ...userProfile } = newUser;
    setUser(userProfile as User);
    localStorage.setItem('edumind_current_session', JSON.stringify(userProfile));
    setViewState('app');
    setActiveTab(role === 'admin' ? 'admin' : 'dashboard');
    addNotification(`Account created for ${name}`);
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('edumind_current_session');
    setViewState('landing');
    setUser(null);
    setActiveTab('dashboard');
    setSelectedPlanId(null);
  };

  const clearAllData = () => {
    if (window.confirm("Delete all your study plans? This cannot be undone.")) {
      const filtered = plans.filter(p => p.ownerId !== user?.id); // Future proofing for user-specific plans
      setPlans([]);
      localStorage.removeItem('study_plans');
      addNotification("Data reset successfully.");
    }
  };

  const handleGeneratePlan = async (input: PlanGenerationInput) => {
    setIsGenerating(true);
    try {
      const generated = await generateStudyPlan(input);
      const newPlan: StudyPlan & { ownerId?: string } = {
        id: Math.random().toString(36).substr(2, 9),
        subject: generated.subject || input.subject,
        targetDate: generated.targetDate || input.examDate,
        dailyHours: generated.dailyHours || input.dailyStudyHours,
        tasks: generated.tasks || [],
        createdAt: new Date().toISOString(),
        ownerId: user?.id
      };
      setPlans(prev => [newPlan as StudyPlan, ...prev]);
      setActiveTab('my-plans');
      addNotification(`Syllabus analyzed! Plan ready.`);
    } catch (error: any) {
      console.error("AI Generation error:", error);
      const detail = error?.message ? ` (${error.message})` : "";
      alert(`AI Generation failed${detail}. Check API key and logs.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = (planId: string, taskId: string) => {
    setPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        tasks: plan.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      };
    }));
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.filter(m => m !== msg));
    }, 5000);
  };

  if (viewState === 'landing') {
    return <LandingPage onStart={() => setViewState('auth')} theme={theme} toggleTheme={toggleTheme} />;
  }

  if (viewState === 'auth') {
    return <AuthForm onLogin={handleLogin} onRegister={handleRegister} onBack={() => setViewState('landing')} />;
  }

  const renderContent = () => {
    const userPlans = plans; // In real implementation, filter by user ID

    // If a plan is selected, show detail view
    if (selectedPlanId) {
      const selectedPlan = userPlans.find(p => p.id === selectedPlanId);
      if (selectedPlan) {
        return (
          <PlanView 
            plan={selectedPlan} 
            onBack={() => setSelectedPlanId(null)} 
            onToggleTask={(taskId) => handleToggleTask(selectedPlanId, taskId)}
          />
        );
      }
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard plans={userPlans} />;
      case 'new-plan': return <PlanCreator onGenerate={handleGeneratePlan} isGenerating={isGenerating} />;
      case 'my-plans': 
        return (
          <PlanList 
            plans={userPlans} 
            onSelectPlan={(p) => setSelectedPlanId(p.id)} 
          />
        );
      case 'progress': return <Progress plans={userPlans} />;
      case 'doubt-chat': return <DoubtChat plans={userPlans} />;
      case 'settings': return user ? <Settings user={user} theme={theme} onThemeToggle={toggleTheme} onReset={clearAllData} /> : null;
      case 'admin': return <AdminPanel plans={plans} />;
      default: return <Dashboard plans={userPlans} />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ color: 'var(--text-primary)' }}>
      {showSidebar && user && (
        <Sidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedPlanId(null);
            if (window.innerWidth < 1024) setShowSidebar(false);
          }} 
          onLogout={handleLogout}
        />
      )}

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="sticky top-0 z-30 glass border-b px-8 py-4 m-4 rounded-2xl shadow-lg" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 hover:bg-white/10 rounded-lg lg:hidden" style={{ color: 'var(--cream)' }}>
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-black capitalize tracking-tight font-display" style={{ color: 'var(--cream)' }}>{activeTab.replace('-', ' ')}</h2>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2.5 btn-ghost rounded-xl transition-all hover:scale-105" aria-label="Toggle theme">
                {theme === 'light' ? <Moon className="w-5 h-5 text-amber-900" /> : <Sun className="w-5 h-5 text-amber-300" />}
              </button>
              <div className="relative group cursor-pointer p-2.5 btn-ghost rounded-xl">
                <Bell className="w-5 h-5" style={{ color: 'var(--coffee)' }} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-stone-900 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                    {notifications.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-140px)] animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
