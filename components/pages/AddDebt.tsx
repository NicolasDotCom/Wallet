
import React, { useState } from 'react';
import { X, Check, DollarSign, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { DebtType } from '../../types';
import { saveDebt } from '../../services/storageService';

interface AddDebtProps {
  onSave: () => void;
  onCancel: () => void;
}

const AddDebt: React.FC<AddDebtProps> = ({ onSave, onCancel }) => {
  const [type, setType] = useState<DebtType>('payable');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  
  // Standard Debt Fields
  const [dueDate, setDueDate] = useState('');

  // Credit Card Fields
  const [isCreditCard, setIsCreditCard] = useState(false);
  const [cutoffDay, setCutoffDay] = useState<string>('');
  const [paymentDay, setPaymentDay] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !title) return;

    saveDebt({
      id: Date.now().toString(),
      type,
      title,
      amount: parseFloat(amount),
      notes,
      dueDate: (!isCreditCard && dueDate) ? dueDate : undefined,
      isCreditCard: type === 'payable' && isCreditCard,
      cutoffDay: (isCreditCard && cutoffDay) ? parseInt(cutoffDay) : undefined,
      paymentDay: (isCreditCard && paymentDay) ? parseInt(paymentDay) : undefined,
    });
    
    onSave();
  };

  return (
    <div className="pt-12 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Registrar Deuda</h2>
        <button onClick={onCancel} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 overflow-y-auto pb-4">
        
        {/* Type Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => { setType('payable'); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'payable' 
              ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Yo debo (Pagar)
          </button>
          <button
            type="button"
            onClick={() => { setType('receivable'); setIsCreditCard(false); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'receivable' 
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Me deben (Cobrar)
          </button>
        </div>

        {/* Credit Card Toggle (Only for Payable) */}
        {type === 'payable' && (
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shrink-0">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer flex items-center ${isCreditCard ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`} onClick={() => setIsCreditCard(!isCreditCard)}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isCreditCard ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">¿Es Tarjeta de Crédito?</span>
          </div>
        )}

        {/* Concept Input */}
        <div className="shrink-0">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
            {type === 'payable' ? (isCreditCard ? 'Banco / Tarjeta' : 'Acreedor') : 'Deudor (Quién me debe)'}
          </label>
          <div className="relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <CreditCard size={20} />
            </div>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isCreditCard ? "Ej. Visa Oro, Nu, RappiCard" : "Ej. Préstamo Auto"}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Amount Input */}
        <div className="shrink-0">
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
            {isCreditCard ? 'Deuda Actual' : 'Monto Total'}
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <DollarSign size={20} />
            </div>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-2xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Conditional Fields based on Type */}
        {!isCreditCard ? (
          <div className="shrink-0">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Fecha Vencimiento (Opcional)</label>
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ) : (
          <div className="flex gap-4 shrink-0">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Día de Corte</label>
              <div className="relative">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <CalendarIcon size={16} />
                </div>
                <input 
                  type="number" 
                  min="1" max="31"
                  value={cutoffDay}
                  onChange={(e) => setCutoffDay(e.target.value)}
                  placeholder="Ej. 5"
                  className="w-full pl-9 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Día que cierra el estado de cuenta</p>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Día de Pago</label>
               <div className="relative">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <CalendarIcon size={16} />
                </div>
                <input 
                  type="number" 
                  min="1" max="31"
                  value={paymentDay}
                  onChange={(e) => setPaymentDay(e.target.value)}
                  placeholder="Ej. 20"
                  className="w-full pl-9 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Fecha límite para pagar</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 pb-4">
          <button 
            type="submit"
            disabled={!amount || !title}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
              !amount || !title ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700'
            }`}
          >
            <Check size={20} /> Guardar Registro
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDebt;
