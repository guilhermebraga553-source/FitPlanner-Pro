
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Exercise } from '../types';

interface ExerciseDetailViewProps {
  exercise: Exercise;
  onClose: () => void;
}

type DetailTab = 'anatomy' | 'videos';

const ExerciseDetailView: React.FC<ExerciseDetailViewProps> = ({ exercise, onClose }) => {
  const [imageContent, setImageContent] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{ execution: string; muscles: string; tip: string } | null>(null);
  const [videoRefs, setVideoRefs] = useState<{ title: string; uri: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>('anatomy');

  const getAnatomicalPrompt = (exName: string, muscle: string) => {
    return `
      MEDICAL ANATOMICAL DIAGRAM: ${exName}.
      VISUAL STYLE: Professional clinical fitness illustration. 
      SUBJECT: Translucent charcoal-grey human silhouette showing the skeletal and muscular structure.
      HIGHLIGHT: The ${muscle} muscles are glowing in a sharp, vibrant neon violet color.
      BACKGROUND: Solid deep black (#000000).
      VIEWPOINT: Technical angle showing the range of motion for this specific exercise.
      CRITICAL: No faces. No gym background. Pure biomechanical focus.
    `;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      try {
        // 1. Geração da Imagem Técnica (Anatomia IA)
        const imagePromise = ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: getAnatomicalPrompt(exercise.name, exercise.muscle) }] },
          config: { imageConfig: { aspectRatio: "1:1" } }
        });

        // 2. Análise Biomecânica de Texto
        const textPromise = ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Forneça uma análise biomecânica ultra-curta para ${exercise.name}. Retorne JSON: execution (3 passos objetivos), muscles (músculos envolvidos), tip (dica de ouro para performance).`,
          config: { responseMimeType: "application/json" }
        });

        // 3. Busca de Vídeos Reais (Google Search Grounding)
        const searchPromise = ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Encontre os melhores vídeos de execução e tutoriais no YouTube para o exercício: ${exercise.name}. Foque em técnica correta.`,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const [imageRes, textRes, searchRes] = await Promise.all([imagePromise, textPromise, searchPromise]);

        // Processar Imagem
        if (imageRes.candidates?.[0]?.content?.parts) {
          const imgPart = imageRes.candidates[0].content.parts.find(p => p.inlineData);
          if (imgPart?.inlineData) setImageContent(`data:image/png;base64,${imgPart.inlineData.data}`);
        }

        // Processar Texto
        const json = JSON.parse(textRes.text || '{}');
        setAnalysis({
          execution: json.execution || exercise.instructions,
          muscles: json.muscles || exercise.muscle,
          tip: json.tip || "Mantenha o controle na fase excêntrica."
        });

        // Processar Grounding (Links de Vídeos)
        const chunks = searchRes.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const links = chunks
          .map((chunk: any) => ({
            title: chunk.web?.title || 'Tutorial de Execução',
            uri: chunk.web?.uri || ''
          }))
          .filter((link: any) => link.uri.includes('youtube.com') || link.uri.includes('youtu.be'))
          .slice(0, 3);
        
        setVideoRefs(links);

      } catch (error: any) {
        console.error("Erro na busca de dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [exercise]);

  return (
    <div className="fixed inset-0 z-[60] bg-[#000000] flex flex-col animate-in fade-in zoom-in-95 duration-500 overflow-y-auto">
      {/* Header Minimalista */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-zinc-900 p-5 flex items-center justify-between z-10">
        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="text-center">
          <p className="text-[9px] font-black text-violet-500 uppercase tracking-[0.4em] mb-1">Biomechanics Lab</p>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">{exercise.name}</h2>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 md:p-12 space-y-10">
        
        {/* Seletor de Abas Internas */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
            <button 
              onClick={() => setActiveTab('anatomy')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'anatomy' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-500 hover:text-white'}`}
            >
              <i className="fa-solid fa-dna mr-2"></i> Diagrama IA
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'videos' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-zinc-500 hover:text-white'}`}
            >
              <i className="fa-solid fa-play mr-2"></i> Vídeos Reais
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Lado Visual (Conteúdo da Aba) */}
          <div className="relative group">
            {activeTab === 'anatomy' ? (
              <div className="relative aspect-square bg-[#0a0a0a] rounded-[38px] border border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">
                {loading ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Renderizando...</p>
                  </div>
                ) : imageContent ? (
                  <img src={imageContent} className="w-full h-full object-cover animate-in fade-in duration-700" alt="Anatomia IA" />
                ) : (
                  <p className="text-zinc-700 font-black uppercase text-xs">Erro na renderização</p>
                )}
              </div>
            ) : (
              <div className="relative aspect-square bg-[#0a0a0a] rounded-[38px] border border-zinc-800 p-8 flex flex-col justify-center gap-6 shadow-2xl">
                <h3 className="text-white font-black uppercase text-sm mb-2 flex items-center gap-2">
                  <i className="fa-brands fa-youtube text-red-500"></i> Tutoriais Encontrados
                </h3>
                {videoRefs.length > 0 ? (
                  <div className="space-y-4">
                    {videoRefs.map((v, i) => (
                      <a 
                        key={i} 
                        href={v.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-violet-500/50 transition-all group"
                      >
                        <div className="min-w-0 pr-4">
                          <p className="text-xs font-bold text-zinc-300 truncate group-hover:text-white">{v.title}</p>
                          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">Assistir no YouTube</p>
                        </div>
                        <i className="fa-solid fa-arrow-up-right-from-square text-zinc-700 group-hover:text-violet-500"></i>
                      </a>
                    ))}
                    <p className="text-[10px] text-zinc-600 italic mt-4">
                      Estes links foram validados em tempo real via Google Search para garantir que você aprenda com humanos reais.
                    </p>
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Buscando referências...</p>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <i className="fa-solid fa-magnifying-glass text-zinc-800 text-4xl mb-4"></i>
                    <p className="text-zinc-500 text-xs font-bold uppercase">Nenhum vídeo específico encontrado.</p>
                    <a 
                      href={`https://www.youtube.com/results?search_query=${exercise.name}+execução+correta`}
                      target="_blank"
                      className="inline-block mt-4 text-violet-500 text-[10px] font-black underline uppercase"
                    >
                      Pesquisar manualmente no YouTube
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lado Informativo */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="px-4 py-1.5 bg-violet-600/10 text-violet-400 text-[10px] font-black rounded-full border border-violet-500/20 uppercase tracking-[0.2em]">
                {exercise.muscle}
              </span>
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
                {activeTab === 'anatomy' ? 'Anatomia' : 'Aprendizado'} <span className="text-violet-600">Pro</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm">
                Combine o diagrama técnico da IA com as referências reais para uma execução livre de lesões.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
                <h3 className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-violet-500"></i> Biomecânica Sugerida
                </h3>
                <p className="text-zinc-300 text-base leading-relaxed font-medium">
                  {analysis?.execution}
                </p>
              </div>

              <div className="p-6 bg-violet-600/10 rounded-3xl border border-violet-500/30 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                  <i className="fa-solid fa-lightbulb text-5xl text-violet-500"></i>
                </div>
                <h3 className="text-violet-400 font-black text-[10px] uppercase tracking-widest mb-2">Dica Extra</h3>
                <p className="text-white text-lg font-black leading-tight">
                  {analysis?.tip}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row gap-4 justify-between items-center text-[9px] font-black text-zinc-600 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} FitPlanner Pro | Inteligência Híbrida (IA + Realidade)</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><i className="fa-solid fa-shield-halved text-violet-500"></i> Segurança Técnica</span>
            <span className="flex items-center gap-2"><i className="fa-brands fa-google text-violet-500"></i> Google Grounding</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailView;
