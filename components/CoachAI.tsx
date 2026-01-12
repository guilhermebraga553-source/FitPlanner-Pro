
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { EXERCISE_LIBRARY } from '../constants';
import { UserProfile, Workout } from '../types';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface CoachAIProps {
  profile: UserProfile;
  workouts: Workout[];
}

const CoachAI: React.FC<CoachAIProps> = ({ profile, workouts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `Olá ${profile.name || 'atleta'}! Sou seu Coach AI. Analisei seu perfil de ${profile.goal || 'treino'} e estou pronto para te ajudar. Como está o foco hoje?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const context = `
        Você é o "Coach AI", um personal trainer de elite.
        DADOS DO ATLETA ATUAL:
        - Nome: ${profile.name || 'Usuário'}
        - Objetivo: ${profile.goal}
        - Peso: ${profile.weight}kg
        - Treinos Salvos: ${workouts.map(w => w.title).join(', ')}

        BIBLIOTECA DISPONÍVEL:
        ${EXERCISE_LIBRARY.map(e => `- ${e.name} (${e.muscle})`).join(', ')}
        
        REGRAS:
        1. Responda em Português (PT-BR).
        2. Seja motivador, mas extremamente técnico e preciso.
        3. Se o usuário perguntar sobre os treinos DELE, cite os nomes que ele salvou.
        4. Mantenha as respostas curtas (máximo 3 parágrafos).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: context,
        },
      });

      const aiResponse = response.text || "Tive um pequeno lapso de memória. Pode repetir?";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Erro de conexão. O servidor de elite está em manutenção rápida." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-16 h-16 bg-violet-600 text-white rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 border-2 border-violet-400/30"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-headset'} text-2xl`}></i>
      </button>

      {isOpen && (
        <div className="fixed bottom-44 right-6 md:bottom-28 md:right-8 w-[calc(100vw-3rem)] md:w-[400px] h-[600px] bg-zinc-950 border border-zinc-800 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-zinc-900/50 backdrop-blur-xl p-6 border-b border-zinc-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/30">
              <i className="fa-solid fa-bolt text-white"></i>
            </div>
            <div>
              <h3 className="font-black text-white text-base tracking-tight">Coach Inteligente</h3>
              <p className="text-[10px] text-violet-400 font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Analítico & Ativo
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-[24px] text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-violet-600 text-white rounded-tr-none shadow-lg shadow-violet-600/10' 
                    : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 p-4 rounded-2xl rounded-tl-none border border-zinc-800 flex gap-2">
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-zinc-900/30 border-t border-zinc-800 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Dúvida técnica ou de rotina..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-violet-600 transition-all placeholder:text-zinc-700"
            />
            <button
              onClick={handleSend}
              className="w-12 h-12 bg-violet-600 text-white rounded-2xl flex items-center justify-center hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20 active:scale-90"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CoachAI;
