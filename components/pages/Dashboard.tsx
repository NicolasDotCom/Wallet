import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES, Category } from '../../types';
import { calculateBalance, getCustomCategories } from '../../services/storageService';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const { income, expense, total } = calculateBalance(transactions);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
     const customs = getCustomCategories();
     setAllCategories([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES, ...customs]);
  }, [transactions]); // Refresh categories when transactions change (mostly to ensure sync on load)

  const getCategoryIcon = (id: string) => {
    const cat = allCategories.find(c => c.id === id);
    return cat ? { icon: cat.icon, color: cat.color, name: cat.name } : { icon: '❓', color: '#94a3b8', name: 'Otro' };
  };

  return (
    <div className="flex flex-col gap-6 pt-8">
      
      {/* Balance Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 transition-colors">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Saldo Total</span>
        <h2 className={`text-4xl font-bold ${total >= 0 ? 'text-slate-900 dark:text-white' : 'text-red-500'}`}>
          ${total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
        </h2>
        <div className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-3 py-1 rounded-full mt-1 flex items-center gap-1">
          <TrendingUp size={12} /> Actualizado hoy
        </div>
      </div>

      {/* Income/Expense Split */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden transition-colors">
          <div className="absolute right-2 top-2 opacity-10">
            <ArrowUpRight size={48} className="text-emerald-600" />
          </div>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase mb-1">
            <ArrowUpRight size={14} /> Ingresos
          </span>
          <p className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
            ${income.toLocaleString('es-ES')}
          </p>
        </div>

        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 relative overflow-hidden transition-colors">
           <div className="absolute right-2 top-2 opacity-10">
            <ArrowDownLeft size={48} className="text-rose-600" />
          </div>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase mb-1">
            <ArrowDownLeft size={14} /> Gastos
          </span>
          <p className="text-lg font-bold text-rose-900 dark:text-rose-300">
            ${expense.toLocaleString('es-ES')}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-3">Recientes</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 text-sm">No hay transacciones aún</p>
            <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">Toca el botón + para agregar una</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.slice(0, 5).map((t) => {
              const cat = getCategoryIcon(t.category);
              return (
                <div key={t.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm"
                      style={{ backgroundColor: `${cat.color}20` }} // 20 is opacity hex
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{cat.name}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">{new Date(t.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;