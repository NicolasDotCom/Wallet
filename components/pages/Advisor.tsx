
import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { Transaction, Debt } from '../../types';
import { getFinancialAdvice } from '../../services/aiService';

interface AdvisorProps {
  transactions: Transaction[];
  debts?: Debt[];
}

const Advisor: React.FC<AdvisorProps> = ({ transactions, debts = [] }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(transactions, debts);
    setAdvice(result);
    setLoading(false);
  };
  
  // Safe check for API Key existence
  let hasApiKey = false;
  try {
    hasApiKey = typeof process !== 'undefined' && !!process.env && !!process.env.API_KEY;
  } catch (e) {
    hasApiKey = false;
  }

  return (
    <div className="pt-12 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Asesor Financiero IA</h2>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        
        <h3 className="font-bold text-lg mb-2 z-10 relative">Análisis Inteligente 2.0</h3>
        <p className="text-purple-100 text-sm mb-4 z-10 relative leading-relaxed">
          Ahora analizo también tus deudas y préstamos para darte una estrategia financiera completa.
        </p>
        
        <button 
          onClick={handleGetAdvice}
          disabled={loading}
          className="bg-white text-purple-700 px-5 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-purple-50 transition-colors flex items-center gap-2 disabled:opacity-70 z-10 relative"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {loading ? "Analizando..." : "Generar Consejo"}
        </button>
      </div>

      {advice && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30 shadow-sm animate-fade-in transition-colors">
          <h4 className="text-xs font-bold text-purple-500 dark:text-purple-400 uppercase tracking-wider mb-2">El consejo de Gemini</h4>
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed italic text-lg">
            "{advice}"
          </p>
        </div>
      )}

      {!hasApiKey && (
        <div className="mt-auto mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 p-4 rounded-xl flex gap-3">
           <AlertTriangle className="text-amber-500 shrink-0" size={20} />
           <p className="text-xs text-amber-800 dark:text-amber-200">
             Nota: Para que esta función opere, necesitas configurar la variable de entorno <code>API_KEY</code> con una clave válida de Google Gemini.
           </p>
        </div>
      )}
    </div>
  );
};

export default Advisor;
