
import React from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center border border-violet-500/30">
          <i className="fa-solid fa-user-pen text-xl text-violet-500"></i>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Editar Perfil</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-violet-500/50 outline-none text-white transition placeholder:text-zinc-800"
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Idade</label>
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-violet-500/50 outline-none text-white transition"
            placeholder="Ex: 25"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Peso (kg)</label>
          <input
            type="number"
            name="weight"
            value={profile.weight}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-violet-500/50 outline-none text-white transition"
            placeholder="Ex: 75.5"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Objetivo Principal</label>
          <select
            name="goal"
            value={profile.goal}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-violet-500/50 outline-none text-white transition bg-zinc-950"
          >
            <option value="">Selecione um objetivo</option>
            <option value="Hipertrofia">Hipertrofia (Ganho de Massa)</option>
            <option value="Emagrecimento">Emagrecimento (Perda de Gordura)</option>
            <option value="Condicionamento">Condicionamento Físico</option>
            <option value="Força">Treino de Força (Powerlifting)</option>
          </select>
        </div>
      </div>
      <div className="mt-10 p-6 bg-violet-600/5 rounded-2xl border border-violet-500/20 text-center">
        <p className="text-violet-400 italic text-sm font-medium">
          <i className="fa-solid fa-quote-left mr-2 opacity-50"></i>
          O único treino ruim é aquele que não aconteceu. Mantenha o foco nos seus objetivos!
          <i className="fa-solid fa-quote-right ml-2 opacity-50"></i>
        </p>
      </div>
    </div>
  );
};

export default Profile;
