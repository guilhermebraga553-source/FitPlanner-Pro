
import React, { useState, useEffect } from 'react';
import { Workout, WorkoutExercise, Exercise, TabType } from '../types';
import ExerciseLibrary from './ExerciseLibrary';

interface WorkoutPlannerProps {
  workouts: Workout[];
  setWorkouts: (update: Workout[] | ((prev: Workout[]) => Workout[])) => void;
  onDeleteWorkout: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
}

const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({ workouts, setWorkouts, onDeleteWorkout, setActiveTab }) => {
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  // Resetar confirmação se mudar de aba ou após 5 segundos
  useEffect(() => {
    if (confirmingDeleteId) {
      const timer = setTimeout(() => setConfirmingDeleteId(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [confirmingDeleteId]);

  const shareWorkout = (e: React.MouseEvent, workout: Workout) => {
    e.preventDefault();
    e.stopPropagation();
    
    const text = `🔥 *FITPLANNER PRO - ${workout.title.toUpperCase()}* 🔥\n\n` +
      workout.exercises.map((ex, i) => 
        `${i+1}. ${ex.name}\n   └ ${ex.sets} sets x ${ex.reps} (${ex.rest} descanso)`
      ).join('\n\n') + 
      ` \n\nGerado por FitPlanner Pro 🚀`;

    if (navigator.share) {
      navigator.share({ title: workout.title, text: text }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Texto do treino copiado!');
    }
  };

  const createNewWorkout = () => {
    const newId = Date.now().toString();
    const newWorkout: Workout = {
      id: newId,
      title: 'Novo Treino',
      exercises: []
    };
    setWorkouts(prev => [...prev, newWorkout]);
    setEditingWorkoutId(newId);
  };

  // FUNÇÃO DE EXCLUSÃO REFORÇADA
  const handleToggleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirmingDeleteId === id) {
      // SEGUNDO CLIQUE: Exclui de fato
      onDeleteWorkout(id);
      if (editingWorkoutId === id) {
        setEditingWorkoutId(null);
      }
      setConfirmingDeleteId(null);
    } else {
      // PRIMEIRO CLIQUE: Entra em modo de confirmação
      setConfirmingDeleteId(id);
    }
  };

  const currentWorkout = workouts.find(w => w.id === editingWorkoutId);

  const updateWorkoutTitle = (id: string, title: string) => {
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, title } : w));
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    if (!editingWorkoutId) return;
    const newExercise: WorkoutExercise = { ...exercise, sets: 3, reps: '12', rest: '60s' };
    setWorkouts(prev => prev.map(w => w.id === editingWorkoutId ? { ...w, exercises: [...w.exercises, newExercise] } : w));
    setIsAddingExercise(false);
  };

  const removeExerciseFromWorkout = (workoutId: string, exerciseIndex: number) => {
    setWorkouts(prev => prev.map(w => {
      if (w.id === workoutId) {
        const newExercises = [...w.exercises];
        newExercises.splice(exerciseIndex, 1);
        return { ...w, exercises: newExercises };
      }
      return w;
    }));
  };

  const updateExerciseSpecs = (workoutId: string, index: number, field: keyof WorkoutExercise, value: any) => {
    setWorkouts(prev => prev.map(w => {
      if (w.id === workoutId) {
        const newExercises = [...w.exercises];
        newExercises[index] = { ...newExercises[index], [field]: value };
        return { ...w, exercises: newExercises };
      }
      return w;
    }));
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (!editingWorkoutId || !currentWorkout) return;
    const newExercises = [...currentWorkout.exercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newExercises.length) return;
    [newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]];
    setWorkouts(prev => prev.map(w => w.id === editingWorkoutId ? { ...w, exercises: newExercises } : w));
  };

  if (isAddingExercise && editingWorkoutId) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-8 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md p-4 rounded-[24px] border border-zinc-800 sticky top-24 z-20">
          <button onClick={() => setIsAddingExercise(false)} className="px-5 py-2.5 bg-zinc-800 text-zinc-300 hover:text-white flex items-center font-black uppercase text-[10px] tracking-widest transition rounded-xl">
            <i className="fa-solid fa-chevron-left mr-2"></i> Voltar
          </button>
          <span className="text-xs font-black text-violet-500 uppercase tracking-widest">Adicionando a: {currentWorkout?.title}</span>
        </div>
        <ExerciseLibrary onAddToWorkout={addExerciseToWorkout} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Lista Lateral */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <span className="w-2 h-8 bg-violet-600 rounded-full"></span>
            Minhas Rotinas
          </h2>
          <button 
            type="button"
            onClick={createNewWorkout} 
            className="w-10 h-10 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition shadow-lg flex items-center justify-center group"
          >
            <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i>
          </button>
        </div>
        
        <div className="space-y-4">
          {workouts.map(w => (
            <div
              key={w.id}
              onClick={() => setEditingWorkoutId(w.id)}
              className={`group p-6 rounded-[28px] cursor-pointer transition-all border-2 relative overflow-hidden ${
                editingWorkoutId === w.id 
                ? 'border-violet-600 bg-violet-600/10 shadow-xl' 
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className={`font-black text-lg tracking-tight truncate ${editingWorkoutId === w.id ? 'text-white' : 'text-zinc-400'}`}>
                    {w.title}
                  </h3>
                  <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {w.exercises.length} EXERCÍCIOS
                  </span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                   {!confirmingDeleteId && (
                     <button 
                      type="button"
                      onClick={(e) => shareWorkout(e, w)}
                      className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-violet-400 bg-zinc-950/80 border border-zinc-800 rounded-xl transition"
                     >
                      <i className="fa-solid fa-share-nodes text-xs"></i>
                     </button>
                   )}
                   
                   <button 
                    type="button"
                    onClick={(e) => handleToggleDelete(e, w.id)} 
                    className={`h-10 flex items-center justify-center transition-all duration-300 rounded-xl border font-black uppercase tracking-widest text-[10px] ${
                      confirmingDeleteId === w.id 
                        ? 'bg-red-600 text-white border-red-500 px-4 animate-pulse w-auto shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                        : 'bg-zinc-950/80 text-zinc-600 hover:text-red-500 border-zinc-800 w-10'
                    }`}
                   >
                    {confirmingDeleteId === w.id ? (
                      <span className="pointer-events-none">EXCLUIR?</span>
                    ) : (
                      <i className="fa-solid fa-trash-can text-xs pointer-events-none"></i>
                    )}
                   </button>
                </div>
              </div>
            </div>
          ))}
          
          {workouts.length === 0 && (
            <div className="border-2 border-dashed border-zinc-800 rounded-[32px] p-12 text-center bg-zinc-900/20">
              <i className="fa-solid fa-dumbbell text-2xl text-zinc-800 mb-4 block"></i>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Nenhuma rotina</p>
            </div>
          )}
        </div>
      </div>

      {/* Editor Principal */}
      <div className="lg:col-span-8">
        {currentWorkout ? (
          <div className="bg-zinc-900 rounded-[40px] border border-zinc-800 overflow-hidden shadow-2xl animate-in slide-in-from-right-8">
            <div className="p-8 md:p-10 bg-zinc-950 border-b border-zinc-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="text-[9px] font-black text-violet-500 uppercase tracking-[0.4em] mb-2 block">Editando Rotina</span>
                  <input
                    type="text"
                    value={currentWorkout.title}
                    onChange={(e) => updateWorkoutTitle(currentWorkout.id, e.target.value)}
                    className="text-3xl md:text-4xl font-black bg-transparent text-white outline-none w-full border-b-2 border-transparent focus:border-violet-600 transition-all tracking-tighter"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={(e) => shareWorkout(e, currentWorkout)}
                    className="h-12 px-6 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                  >
                    <i className="fa-solid fa-share-nodes mr-2"></i> SHARE
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => handleToggleDelete(e, currentWorkout.id)}
                    className={`h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      confirmingDeleteId === currentWorkout.id 
                      ? 'bg-red-600 text-white border-red-500 animate-pulse' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-500'
                    }`}
                  >
                    {confirmingDeleteId === currentWorkout.id ? 'CONFIRMAR EXCLUSÃO?' : 'EXCLUIR'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-10 space-y-6">
              {currentWorkout.exercises.length === 0 ? (
                <div className="py-20 text-center space-y-6">
                  <i className="fa-solid fa-layer-group text-4xl text-zinc-800 mb-2 block"></i>
                  <button 
                    onClick={() => setIsAddingExercise(true)} 
                    className="px-10 py-4 bg-violet-600 text-white font-black rounded-2xl uppercase text-xs tracking-[0.2em]"
                  >
                    ADICIONAR EXERCÍCIO
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {currentWorkout.exercises.map((ex, idx) => (
                      <div key={`${ex.id}-${idx}`} className="p-6 bg-zinc-950 rounded-[35px] border border-zinc-800 flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col">
                            <button onClick={() => moveExercise(idx, 'up')} disabled={idx === 0} className="flex-1 bg-zinc-800/20 text-white disabled:opacity-0"><i className="fa-solid fa-chevron-up text-[10px]"></i></button>
                            <button onClick={() => moveExercise(idx, 'down')} disabled={idx === currentWorkout.exercises.length - 1} className="flex-1 bg-zinc-800/20 text-white disabled:opacity-0"><i className="fa-solid fa-chevron-down text-[10px]"></i></button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-violet-500 font-black uppercase tracking-[0.3em] bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/10">{ex.muscle}</span>
                          <input 
                            type="text"
                            value={ex.name}
                            onChange={(e) => updateExerciseSpecs(currentWorkout.id, idx, 'name', e.target.value)}
                            className="block w-full bg-transparent font-black text-white text-xl tracking-tight mt-2 outline-none"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex gap-4">
                                <div className="space-y-1">
                                    <span className="text-[8px] text-zinc-600 font-black uppercase block text-center">Sets</span>
                                    <input type="number" value={ex.sets} onChange={(e) => updateExerciseSpecs(currentWorkout.id, idx, 'sets', parseInt(e.target.value) || 0)} className="w-12 h-10 bg-zinc-900 border border-zinc-800 rounded-lg text-center text-xs font-black text-white outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] text-zinc-600 font-black uppercase block text-center">Reps</span>
                                    <input type="text" value={ex.reps} onChange={(e) => updateExerciseSpecs(currentWorkout.id, idx, 'reps', e.target.value)} className="w-14 h-10 bg-zinc-900 border border-zinc-800 rounded-lg text-center text-xs font-black text-white outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] text-zinc-600 font-black uppercase block text-center">Rest</span>
                                    <input type="text" value={ex.rest} onChange={(e) => updateExerciseSpecs(currentWorkout.id, idx, 'rest', e.target.value)} className="w-16 h-10 bg-zinc-900 border border-zinc-800 rounded-lg text-center text-xs font-black text-white outline-none" />
                                </div>
                            </div>
                            <button onClick={() => removeExerciseFromWorkout(currentWorkout.id, idx)} className="w-10 h-10 bg-zinc-900 text-zinc-700 hover:text-red-500 rounded-xl transition-all border border-zinc-800">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <button onClick={() => setIsAddingExercise(true)} className="flex-1 py-6 bg-zinc-950 border-2 border-dashed border-zinc-800 text-zinc-600 rounded-[30px] hover:border-violet-500/50 hover:text-violet-500 transition-all font-black uppercase text-[10px] tracking-[0.4em]">
                        + ADICIONAR EXERCÍCIO
                    </button>
                    <button onClick={() => setEditingWorkoutId(null)} className="px-10 py-6 bg-zinc-800 text-white rounded-[30px] font-black uppercase text-[10px] tracking-[0.4em]">
                        CONCLUIR
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-zinc-900/10 border-2 border-dashed border-zinc-900 rounded-[50px] p-12 text-center min-h-[400px]">
            <i className="fa-solid fa-hand-pointer text-4xl text-zinc-800 mb-6 animate-bounce"></i>
            <h3 className="text-2xl font-black text-zinc-800 uppercase tracking-tighter">Selecione uma Rotina</h3>
            <button onClick={createNewWorkout} className="mt-8 px-8 py-4 bg-zinc-900 text-zinc-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-zinc-800 transition">
                NOVO TREINO DO ZERO
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanner;
