
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Workout, WorkoutExercise, TabType } from '../types';
import { EXERCISE_LIBRARY } from '../constants';

interface WorkoutGeneratorAIProps {
  profile: UserProfile;
  onSaveRoutine: (workouts: Workout[]) => void;
  setActiveTab: (tab: TabType) => void;
}

const WorkoutGeneratorAI: React.FC<WorkoutGeneratorAIProps> = ({ profile, onSaveRoutine, setActiveTab }) => {
  const [loading, setLoading] = useState(false);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [intensity, setIntensity] = useState<'moderada' | 'alta'>('moderada');
  const [experience, setExperience] = useState<'iniciante' | 'intermediario' | 'avancado'>('intermediario');
  const [focusArea, setFocusArea] = useState<'equilibrado' | 'superiores' | 'inferiores' | 'posterior'>('equilibrado');
  const [equipment, setEquipment] = useState<'academia' | 'pesos_livres'>('academia');
  const [generatedRoutine, setGeneratedRoutine] = useState<Workout[] | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const generateRoutine = async () => {
    if (!profile.goal) {
      alert("Por favor, preencha seu objetivo no Perfil primeiro!");
      setActiveTab(TabType.PROFILE);
      return;
    }

    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const prompt = `
        Aja como um Personal Trainer de elite. Gere uma ROTINA SEMANAL COMPLETA de exatamente ${daysPerWeek} dias para o seguinte perfil:
        - Objetivo Principal: ${profile.goal}
        - Nível de Experiência: ${experience} (iniciante foca em básicos, avançado foca em volume e técnicas)
        - Foco Específico: ${focusArea} (priorize exercícios desta área)
        - Equipamento: ${equipment === 'academia' ? 'Academia Completa' : 'Apenas Pesos Livres/Halteres'}
        - Perfil: ${profile.age} anos, ${profile.weight}kg
        - Frequência: ${daysPerWeek} dias por semana
        - Intensidade: ${intensity}

        USE APENAS exercícios desta biblioteca oficial:
        ${EXERCISE_LIBRARY.map(e => `ID: ${e.id} | Nome: ${e.name} | Músculo: ${e.muscle}`).join('\n')}

        Diretrizes de Especialização:
        1. Se for 3 dias: OBRIGATORIAMENTE divida em Dia A: Peito/Tríceps/Ombros, Dia B: Costas/Bíceps/Antebraço, Dia C: Pernas/Panturrilha/Glúteo.
        2. Se o foco for "superiores", aumente o volume de peito/costas/braços. Se for "inferiores", aumente o volume de quadríceps/posteriores.
        3. Se o equipamento for "pesos_livres", PRIORIZE exercícios com halteres e barras, evite máquinas pesadas (como leg press, hack, etc) se possível, ou substitua por variações livres equivalentes da lista.
        4. OBRIGATÓRIO PARA EMAGRECIMENTO: Se o objetivo for "Emagrecimento", adicione Cardio (cardio1-4) ao final de cada treino.

        Retorne um array JSON de objetos Workout com title e exercises (id, sets, reps, rest).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      sets: { type: Type.INTEGER },
                      reps: { type: Type.STRING },
                      rest: { type: Type.STRING }
                    },
                    required: ["id", "sets", "reps", "rest"]
                  }
                }
              },
              required: ["title", "exercises"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]');
      
      const routine: Workout[] = data.map((workoutData: any) => {
        const fullExercises: WorkoutExercise[] = workoutData.exercises.map((ge: any) => {
          const baseEx = EXERCISE_LIBRARY.find(e => e.id === ge.id);
          return baseEx ? {
            ...baseEx,
            sets: ge.sets,
            reps: ge.reps,
            rest: ge.rest
          } : null;
        }).filter((ex: any) => ex !== null);

        return {
          id: Math.random().toString(36).substr(2, 9),
          title: workoutData.title || "Treino Planejado",
          exercises: fullExercises
        };
      });

      setGeneratedRoutine(routine);
      setStep(2);
    } catch (error) {
      console.error("Erro ao gerar rotina:", error);
      alert("Erro ao processar a inteligência artificial. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoutine = () => {
    if (generatedRoutine) {
      onSaveRoutine(generatedRoutine);
      alert(`${generatedRoutine.length} treinos adicionados à sua lista!`);
      setActiveTab(TabType.ROUTINES);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Questionnaire Phase */}
      {step === 1 && (
        <div className="bg-zinc-900 rounded-[40px] border border-zinc-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <i className="fa-solid fa-microchip text-[200px] text-violet-500"></i>
          </div>

          <div className="relative z-10 space-y-12">
            <div className="text-center md:text-left">
              <span className="px-4 py-1.5 bg-violet-600/10 text-violet-500 text-[10px] font-black rounded-full border border-violet-500/20 uppercase tracking-[0.3em]">
                Gerador de Protocolos Avançados
              </span>
              <h2 className="text-4xl font-black text-white mt-4 uppercase tracking-tighter leading-none">
                Sua Estratégia de <span className="text-violet-600">Alta Performance</span>
              </h2>
              <p className="text-zinc-500 mt-2 font-medium">A IA do FitPlanner Pro precisa entender seu contexto exato.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Disponibilidade */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-calendar-day text-violet-500"></i> Frequência
                </h3>
                <div className="flex gap-2 bg-zinc-950 p-2 rounded-2xl border border-zinc-800">
                  {[3, 4, 5, 6].map(d => (
                    <button
                      key={d}
                      onClick={() => setDaysPerWeek(d)}
                      className={`flex-1 h-12 rounded-xl font-black text-sm transition-all ${
                        daysPerWeek === d ? 'bg-violet-600 text-white' : 'text-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Experiência */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-medal text-violet-500"></i> Experiência
                </h3>
                <div className="flex gap-2 bg-zinc-950 p-2 rounded-2xl border border-zinc-800">
                  {[
                    { val: 'iniciante', label: 'Beg' },
                    { val: 'intermediario', label: 'Int' },
                    { val: 'avancado', label: 'Pro' }
                  ].map(e => (
                    <button
                      key={e.val}
                      onClick={() => setExperience(e.val as any)}
                      className={`flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        experience === e.val ? 'bg-violet-600 text-white' : 'text-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Foco */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-bullseye text-violet-500"></i> Foco Muscular
                </h3>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value as any)}
                  className="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 text-xs font-black text-zinc-300 uppercase tracking-widest outline-none focus:border-violet-600 transition-all appearance-none cursor-pointer"
                >
                  <option value="equilibrado">Equilibrado (Full Body)</option>
                  <option value="superiores">Superior (Peito/Costas)</option>
                  <option value="inferiores">Inferior (Quadríceps/Post)</option>
                  <option value="posterior">Cadeia Posterior (Glúteos)</option>
                </select>
              </div>

              {/* Equipamento */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-dumbbell text-violet-500"></i> Equipamento
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setEquipment('academia')}
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all text-center ${
                      equipment === 'academia' ? 'border-violet-600 bg-violet-600/10 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                    }`}
                  >
                    <i className="fa-solid fa-building-shield mb-2"></i>
                    <p className="text-[10px] font-black uppercase tracking-widest">Academia</p>
                  </button>
                  <button
                    onClick={() => setEquipment('pesos_livres')}
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all text-center ${
                      equipment === 'pesos_livres' ? 'border-violet-600 bg-violet-600/10 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                    }`}
                  >
                    <i className="fa-solid fa-house mb-2"></i>
                    <p className="text-[10px] font-black uppercase tracking-widest">Livre/Casa</p>
                  </button>
                </div>
              </div>

              {/* Intensidade */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-bolt text-violet-500"></i> Intensidade
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIntensity('moderada')}
                    className={`flex-1 h-14 rounded-2xl border-2 font-black text-[10px] uppercase tracking-[0.3em] transition-all ${
                      intensity === 'moderada' ? 'border-violet-600 bg-violet-600/10 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                    }`}
                  >
                    Resistência Moderada
                  </button>
                  <button
                    onClick={() => setIntensity('alta')}
                    className={`flex-1 h-14 rounded-2xl border-2 font-black text-[10px] uppercase tracking-[0.3em] transition-all ${
                      intensity === 'alta' ? 'border-violet-600 bg-violet-600/10 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                    }`}
                  >
                    Alta Intensidade (HIIT/Carga)
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-3xl border border-zinc-800">
                <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-user-check text-violet-500"></i>
                </div>
                <div className="min-w-[120px]">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Meta</p>
                  <p className="text-xs font-black text-white uppercase">{profile.goal || "Definir"}</p>
                </div>
              </div>

              <button
                onClick={generateRoutine}
                disabled={loading}
                className={`w-full md:w-auto px-16 py-6 bg-violet-600 text-white font-black rounded-3xl uppercase tracking-[0.3em] text-xs shadow-2xl shadow-violet-600/40 hover:bg-violet-500 active:scale-95 transition-all flex items-center justify-center gap-4 ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    SINCRONIZANDO IA...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-sparkles"></i>
                    GERAR TREINO SOB MEDIDA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Phase */}
      {step === 2 && generatedRoutine && (
        <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-zinc-900/80 p-8 rounded-[40px] border border-zinc-800 backdrop-blur-xl sticky top-[73px] z-30 shadow-2xl">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setStep(1)}
                className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition group"
              >
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              </button>
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Rotina Customizada</h3>
                <div className="flex gap-3 mt-1">
                  <span className="text-[9px] font-black text-violet-500 uppercase tracking-widest bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">{experience}</span>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">{equipment}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleSaveRoutine}
              className="w-full lg:w-auto px-12 py-5 bg-white text-black font-black rounded-3xl text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-violet-50 transition-all active:scale-95"
            >
              SALVAR ESTA ROTINA
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {generatedRoutine.map((workout, wIdx) => (
              <div key={wIdx} className="bg-zinc-900 rounded-[45px] border border-zinc-800 overflow-hidden flex flex-col group hover:border-violet-500/40 transition-all shadow-2xl">
                <div className="p-8 bg-zinc-950 border-b border-zinc-800">
                  <div className="flex justify-between items-start mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-500 font-black text-sm border border-violet-500/20">
                      {wIdx + 1}
                    </span>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      {workout.exercises.length} Exercícios
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{workout.title}</h4>
                </div>
                <div className="p-8 space-y-4 flex-1">
                  {workout.exercises.map((ex, eIdx) => (
                    <div key={eIdx} className="p-4 bg-zinc-950/60 rounded-3xl border border-zinc-800/50 flex items-center justify-between group-hover:bg-zinc-950 transition-colors">
                      <div className="min-w-0 pr-4">
                        <p className="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">{ex.muscle}</p>
                        <h5 className="text-[12px] font-black text-zinc-100 truncate">{ex.name}</h5>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-black text-white">{ex.sets}x{ex.reps}</p>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{ex.rest}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {profile.goal === 'Emagrecimento' && (
                  <div className="px-8 py-5 bg-violet-600/5 border-t border-violet-500/10 flex items-center gap-4">
                    <i className="fa-solid fa-fire-flame-curved text-violet-500"></i>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Finalizador Cardio Incluso</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && !generatedRoutine && step === 2 && (
         <div className="text-center py-24 bg-zinc-900/50 rounded-[50px] border-2 border-dashed border-zinc-800">
            <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
              <i className="fa-solid fa-triangle-exclamation text-zinc-700 text-3xl"></i>
            </div>
            <h4 className="text-zinc-400 font-black uppercase tracking-widest">Falha na Sincronização IA</h4>
            <p className="text-zinc-600 text-sm mt-2">O servidor não respondeu com a rotina. Tente novamente.</p>
            <button onClick={() => setStep(1)} className="mt-8 px-8 py-3 bg-zinc-800 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-zinc-700 transition-all">
              TENTAR NOVAMENTE
            </button>
         </div>
      )}
    </div>
  );
};

export default WorkoutGeneratorAI;
