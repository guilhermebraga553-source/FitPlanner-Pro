
import React, { useState } from 'react';
import { storageService } from '../services/storageService';

interface AuthProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    const users = storageService.getUsers();

    if (isLogin) {
      const user = users.find(u => u.email === email && u.passwordHash === password);
      if (user) {
        onLogin(email);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else {
      const exists = users.find(u => u.email === email);
      if (exists) {
        setError('Este e-mail já está cadastrado.');
      } else {
        storageService.saveUser({ email, passwordHash: password });
        onLogin(email);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-600/10 rounded-2xl mb-4 border border-violet-500/20">
            <i className="fa-solid fa-dumbbell text-4xl text-violet-500"></i>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">FitPlanner <span className="text-violet-500">Pro</span></h1>
          <p className="text-zinc-500 mt-2">{isLogin ? 'Bem-vindo de volta, atleta!' : 'Crie sua conta e comece a treinar'}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 mb-6 rounded-lg text-sm font-medium" role="alert">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition text-white placeholder:text-zinc-700"
              placeholder="exemplo@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition text-white placeholder:text-zinc-700"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-xl transition shadow-lg shadow-violet-600/20 active:scale-[0.98]"
          >
            {isLogin ? 'ENTRAR AGORA' : 'CRIAR CONTA'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-500 hover:text-violet-400 text-sm font-bold transition-colors"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
