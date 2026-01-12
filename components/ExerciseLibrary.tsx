
import React, { useState } from 'react';
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from '../constants';
import { Exercise } from '../types';
import ExerciseDetailView from './ExerciseDetailView';

interface ExerciseLibraryProps {
  onAddToWorkout?: (exercise: Exercise) => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onAddToWorkout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');
  const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null);

  const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      ex.name.toLowerCase().includes(term) || 
      ex.muscle.toLowerCase().includes(term);
    const matchesMuscle = selectedMuscle === 'Todos' || ex.muscle === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="space-y-6">
      {viewingExercise && (
        <ExerciseDetailView 
          exercise={viewingExercise} 
          onClose={() => setViewingExercise(null)} 
        />
      )}

      <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800 sticky top-4 z-10 backdrop-blur-md bg-zinc-900/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center">
            <i className="fa-solid fa-book-open mr-3 text-violet-500"></i>
            Biblioteca
          </h2>
          <div className="px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-black rounded-full border border-violet-500/20 uppercase tracking-widest">
            {filteredExercises.length} Exercícios
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-zinc-500"></i>
            <input
              type="text"
              placeholder="Buscar por nome ou músculo..."
              className="w-full pl-11 pr-10 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-violet-500/50 outline-none text-white transition placeholder:text-zinc-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-violet-500/50 outline-none text-white transition"
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
          >
            <option value="Todos">Todos Músculos</option>
            {MUSCLE_GROUPS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(ex => (
          <div 
            key={ex.id} 
            onClick={() => setViewingExercise(ex)}
            className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/5 transition-all group flex flex-col h-full cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-black text-white leading-tight group-hover:text-violet-400 transition-colors pr-2">{ex.name}</h3>
              <span className="px-2 py-1 bg-zinc-950 text-violet-400 text-[10px] font-black rounded border border-zinc-800 uppercase tracking-widest whitespace-nowrap">
                {ex.muscle}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed line-clamp-3">
                {ex.instructions}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                className="flex-1 py-3 bg-zinc-950 text-zinc-500 font-black rounded-xl hover:text-white transition-all border border-zinc-800 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-eye text-xs"></i> VER DETALHES
              </button>
              {onAddToWorkout && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWorkout(ex);
                  }}
                  className="w-12 h-12 bg-violet-600/10 text-violet-400 font-black rounded-xl hover:bg-violet-600 hover:text-white transition-all border border-violet-500/20 flex items-center justify-center"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
