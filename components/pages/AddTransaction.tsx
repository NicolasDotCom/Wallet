import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Plus, ChevronLeft } from 'lucide-react';
import { TransactionType, EXPENSE_CATEGORIES, INCOME_CATEGORIES, Category } from '../../types';
import { saveTransaction, getCustomCategories, saveCustomCategory } from '../../services/storageService';

interface AddTransactionProps {
  onSave: () => void;
  onCancel: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onSave, onCancel }) => {
  // Main Form State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  
  // Data State
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏷️');
  const [newCatColor, setNewCatColor] = useState('#64748b');

  useEffect(() => {
    loadCategories();
  }, [type]);

  const loadCategories = () => {
    const defaults = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const customs = getCustomCategories().filter(c => c.type === type);
    setAllCategories([...defaults, ...customs]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    saveTransaction({
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      note
    });
    
    onSave();
  };

  const handleSaveCategory = () => {
    if (!newCatName) return;
    const newCat: Category = {
      id: `custom_${Date.now()}`,
      name: newCatName,
      icon: newCatIcon,
      color: newCatColor,
      type: type
    };
    saveCustomCategory(newCat);
    loadCategories();
    setCategory(newCat.id); // Auto select
    setIsCreatingCategory(false);
    // Reset form
    setNewCatName('');
    setNewCatIcon('🏷️');
  };

  if (isCreatingCategory) {
    return (
      <div className="pt-12 h-full flex flex-col animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setIsCreatingCategory(false)} className="flex items-center text-slate-500 dark:text-slate-400">
            <ChevronLeft size={20} /> Volver
          </button>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Crear Categoría</h2>
          <div className="w-5"></div> 
        </div>

        <div className="flex flex-col gap-6">
           {/* Name */}
           <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Nombre</label>
            <input 
              type="text" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Ej. Gimnasio"
              className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              autoFocus
            />
          </div>

          {/* Icon (Emoji) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Icono (Emoji)</label>
            <input 
              type="text" 
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              maxLength={2}
              placeholder="💪"
              className="w-20 text-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Color</label>
            <div className="grid grid-cols-6 gap-3">
              {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#14b8a6'].map(c => (
                <button
                  key={c}
                  onClick={() => setNewCatColor(c)}
                  className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-transform active:scale-90 ${newCatColor === c ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900' : ''}`}
                  style={{ backgroundColor: c }}
                >
                  {newCatColor === c && <Check size={16} className="text-white drop-shadow-md" />}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSaveCategory}
            disabled={!newCatName}
            className={`mt-8 w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              !newCatName ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800'
            }`}
          >
            Crear Categoría
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nueva Transacción</h2>
        <button onClick={onCancel} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
        
        {/* Type Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'expense' 
              ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              type === 'income' 
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Ingreso
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Monto</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <DollarSign size={20} />
            </div>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-2xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Category Grid */}
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Categoría</label>
          <div className="grid grid-cols-3 gap-3">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  category === cat.id 
                    ? `bg-${type === 'income' ? 'emerald' : 'rose'}-50 dark:bg-opacity-10 border-${type === 'income' ? 'emerald' : 'rose'}-200 dark:border-${type === 'income' ? 'emerald' : 'rose'}-800 ring-2 ring-${type === 'income' ? 'emerald' : 'rose'}-500 ring-offset-2 dark:ring-offset-slate-900` 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <div className="text-xl">{cat.icon}</div>
                <span className={`text-xs font-medium ${category === cat.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
            
            {/* Add Category Button */}
            <button
              type="button"
              onClick={() => setIsCreatingCategory(true)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <Plus size={16} />
              </div>
              <span className="text-xs font-medium">Nueva</span>
            </button>
          </div>
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Fecha</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-auto pb-4">
          <button 
            type="submit"
            disabled={!amount || !category}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
              !amount || !category ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700'
            }`}
          >
            <Check size={20} /> Guardar Transacción
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;