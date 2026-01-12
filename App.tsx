
import React, { useState, useEffect } from 'react';
import { TabType, UserData, UserProfile, Workout } from './types';
import { storageService } from './services/storageService';
import Auth from './components/Auth';
import Profile from './components/Profile';
import ExerciseLibrary from './components/ExerciseLibrary';
import WorkoutPlanner from './components/WorkoutPlanner';
import CoachAI from './components/CoachAI';
import WorkoutGeneratorAI from './components/WorkoutGeneratorAI';

const App: React.FC = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.ROUTINES);
  
  const [profile, setProfile] = useState<UserProfile>({ name: '', age: '', weight: '', goal: '' });
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    if (currentUserEmail) {
      const data = storageService.getUserData(currentUserEmail);
      if (data) {
        setProfile(data.profile);
        setWorkouts(data.workouts);
      } else {
        const initialData: UserData = {
          profile: { name: '', age: '', weight: '', goal: '' },
          workouts: []
        };
        storageService.saveUserData(currentUserEmail, initialData);
        setProfile(initialData.profile);
        setWorkouts(initialData.workouts);
      }
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      storageService.saveUserData(currentUserEmail, { profile, workouts });
    }
  }, [profile, workouts, currentUserEmail]);

  const handleLogout = () => {
    setCurrentUserEmail(null);
    setActiveTab(TabType.ROUTINES);
  };

  const handleSaveRoutine = (newWorkouts: Workout[]) => {
    setWorkouts(prev => [...prev, ...newWorkouts]);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  if (!currentUserEmail) {
    return <Auth onLogin={setCurrentUserEmail} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 pb-24 md:pb-0 font-sans">
      {/* Header Premium */}
      <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 py-5 px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(124,58,237,0.4)]">
              <i className="fa-solid fa-dumbbell text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white leading-none">FITPLANNER <span className="text-violet-500">PRO</span></h1>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] mt-1">Sincronia IA • Performance</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Atleta Logado</p>
              <p className="text-sm font-bold text-violet-400 tracking-tight">{currentUserEmail.split('@')[0]}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-12 h-12 bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-red-500 hover:border-red-500/50 rounded-2xl transition-all shadow-lg active:scale-90"
              title="Encerrar Sessão"
            >
              <i className="fa-solid fa-power-off"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Navegação Superior (Desktop) */}
      <nav className="hidden md:flex bg-zinc-950 border-b border-zinc-900 px-8 py-1 sticky top-[89px] z-30 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex gap-10">
          {[
            { id: TabType.ROUTINES, label: 'Central de Treinos', icon: 'fa-layer-group' },
            { id: TabType.AI_GENERATOR, label: 'Arquiteto IA', icon: 'fa-wand-magic-sparkles' },
            { id: TabType.LIBRARY, label: 'Biblioteca Técnica', icon: 'fa-dna' },
            { id: TabType.PROFILE, label: 'Bio & Metas', icon: 'fa-id-card' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-5 px-1 font-black text-[11px] uppercase tracking-[0.3em] transition-all relative whitespace-nowrap flex items-center gap-3 ${
                activeTab === tab.id ? 'text-violet-500' : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500 rounded-t-full shadow-[0_-5px_15px_rgba(124,58,237,0.5)]"></span>}
              <i className={`fa-solid ${tab.icon} text-sm`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
        {activeTab === TabType.PROFILE && <Profile profile={profile} setProfile={setProfile} />}
        {activeTab === TabType.LIBRARY && <ExerciseLibrary />}
        {activeTab === TabType.ROUTINES && (
          <WorkoutPlanner 
            workouts={workouts} 
            setWorkouts={setWorkouts} 
            onDeleteWorkout={handleDeleteWorkout}
            setActiveTab={setActiveTab} 
          />
        )}
        {activeTab === TabType.AI_GENERATOR && (
          <WorkoutGeneratorAI 
            profile={profile} 
            onSaveRoutine={handleSaveRoutine} 
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Assistente Coach AI Sensível ao Contexto */}
      <CoachAI profile={profile} workouts={workouts} />

      {/* Navegação Inferior (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800/50 flex justify-around items-center h-24 z-40 px-4">
        {[
          { id: TabType.ROUTINES, label: 'Treinos', icon: 'fa-calendar-check' },
          { id: TabType.AI_GENERATOR, label: 'IA Gen', icon: 'fa-bolt-lightning' },
          { id: TabType.LIBRARY, label: 'Atlas', icon: 'fa-book-open-reader' },
          { id: TabType.PROFILE, label: 'Bio', icon: 'fa-user-astronaut' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all relative ${
              activeTab === tab.id ? 'text-violet-500 scale-110' : 'text-zinc-600'
            }`}
          >
            {activeTab === tab.id && <span className="absolute top-2 w-1.5 h-1.5 bg-violet-500 rounded-full"></span>}
            <i className={`fa-solid ${tab.icon} text-2xl`}></i>
            <span className="text-[9px] font-black mt-2 uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
