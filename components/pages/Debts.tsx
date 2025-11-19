import React from 'react';
import { CreditCard, TrendingDown, TrendingUp, Trash2, Calendar, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Debt } from '../../types';
import { deleteDebt } from '../../services/storageService';

interface DebtsProps {
  debts: Debt[];
  onAddDebt: () => void;
  onDebtDeleted: () => void;
}

const Debts: React.FC<DebtsProps> = ({ debts, onAddDebt, onDebtDeleted }) => {
  const totalPayable = debts
    .filter(d => d.type === 'payable')
    .reduce((acc, d) => acc + d.amount, 0);

  const totalReceivable = debts
    .filter(d => d.type === 'receivable')
    .reduce((acc, d) => acc + d.amount, 0);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      deleteDebt(id);
      onDebtDeleted();
    }
  };

  // Helper to determine CC status
  const getCardStatus = (cutoffDay: number, paymentDay: number) => {
    const today = new Date().getDate();
    
    // Logic: Best time to buy is immediately after cutoff
    // Warning zone: 3-4 days before cutoff (billing cycle closing soon)
    // Danger zone: Close to payment day

    // Calculate days remaining to cutoff
    let daysToCutoff = cutoffDay - today;
    if (daysToCutoff < 0) daysToCutoff += 30; // Rough estimation for next month

    // Calculate days to payment
    let daysToPay = paymentDay - today;
    if (daysToPay < 0) daysToPay += 30;

    if (today === cutoffDay) {
      return { 
        msg: 'Día de corte hoy. Espera a mañana para comprar.', 
        color: 'text-amber-500', 
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        icon: <AlertCircle size={14} /> 
      };
    }
    
    // If we are 1-5 days after cutoff, it's the golden window
    const daysSinceCutoff = today > cutoffDay ? today - cutoffDay : (today + 30) - cutoffDay;
    if (daysSinceCutoff > 0 && daysSinceCutoff <= 7) {
      return { 
        msg: 'Mejor momento: ~45 días para pagar.', 
        color: 'text-emerald-600 dark:text-emerald-400', 
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        icon: <CheckCircle size={14} /> 
      };
    }

    // If close to payment date (within 5 days)
    if (daysToPay <= 5 && daysToPay >= 0) {
      return { 
        msg: `¡Pago próximo! Faltan ${daysToPay} días.`, 
        color: 'text-rose-600 dark:text-rose-400', 
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        icon: <AlertCircle size={14} /> 
      };
    }

    return { 
      msg: `Corte el día ${cutoffDay}. Faltan ${daysToCutoff} días.`, 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: <Info size={14} /> 
    };
  };

  return (
    <div className="pt-12 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Mis Deudas</h2>
        <button 
          onClick={onAddDebt}
          className="text-sm bg-slate-900 dark:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium shadow-md active:scale-95 transition-transform"
        >
          + Nuevo
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600 dark:text-red-400">
              <TrendingDown size={16} />
            </div>
            <span className="text-xs font-bold text-red-800 dark:text-red-300 uppercase">Por Pagar</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">${totalPayable.toLocaleString()}</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
           <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
              <TrendingUp size={16} />
            </div>
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">Por Cobrar</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">${totalReceivable.toLocaleString()}</p>
        </div>
      </div>

      {/* Debt List */}
      <div className="flex flex-col gap-3">
        {debts.length === 0 ? (
           <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <CreditCard size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-slate-400 dark:text-slate-500 text-sm">No tienes registros de deudas</p>
          </div>
        ) : (
          debts.map((debt) => {
            const isCC = debt.isCreditCard && debt.cutoffDay && debt.paymentDay;
            const status = isCC ? getCardStatus(debt.cutoffDay!, debt.paymentDay!) : null;

            return (
              <div key={debt.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3 relative overflow-hidden transition-colors">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${debt.type === 'payable' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                
                <div className="flex justify-between items-start pl-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 dark:text-white">{debt.title}</h3>
                      {debt.isCreditCard && <CreditCard size={14} className="text-slate-400" />}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      debt.type === 'payable' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                    }`}>
                      {debt.type === 'payable' ? (debt.isCreditCard ? 'Tarjeta Crédito' : 'Debo dinero') : 'Me deben'}
                    </span>
                  </div>
                  <p className="font-bold text-lg text-slate-900 dark:text-white">${debt.amount.toLocaleString()}</p>
                </div>

                {/* Credit Card Smart Tip */}
                {isCC && status && (
                  <div className={`ml-2 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-medium ${status.bg} ${status.color}`}>
                    {status.icon}
                    {status.msg}
                  </div>
                )}

                <div className="flex justify-between items-center pl-2 pt-2 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Calendar size={12} />
                    {isCC ? (
                      <span>Corte: {debt.cutoffDay} / Pago: {debt.paymentDay}</span>
                    ) : (
                      <span>{debt.dueDate ? new Date(debt.dueDate).toLocaleDateString('es-ES') : 'Sin fecha'}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(debt.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Debts;