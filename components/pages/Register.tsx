import React, { useState } from 'react';
import { Wallet, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';
import { registerUser } from '../../services/authService';
import { User } from '../../types';

interface RegisterProps {
  onRegisterSuccess: (user: User) => void;
  onGoToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    const result = registerUser(name, email, password);
    if (result.success && result.user) {
      onRegisterSuccess(result.user);
    } else {
      setError(result.message || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <Wallet size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Crear Cuenta</h1>
          <p className="text-slate-500 dark:text-slate-400">Toma el control de tu dinero</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
           <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Nombre</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-4 w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Registrarse <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <button onClick={onGoToLogin} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;