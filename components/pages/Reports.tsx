import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, EXPENSE_CATEGORIES, Category } from '../../types';
import { getCustomCategories } from '../../services/storageService';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const customs = getCustomCategories().filter(c => c.type === 'expense');
    setCategories([...EXPENSE_CATEGORIES, ...customs]);
  }, []);

  const expenses = transactions.filter(t => t.type === 'expense');
  
  const data = categories.map(cat => {
    const amount = expenses
      .filter(t => t.category === cat.id)
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      name: cat.name,
      value: amount,
      color: cat.color
    };
  }).filter(item => item.value > 0);

  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="pt-12">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Gastos por Categoría</h2>
      
      {expenses.length === 0 ? (
         <div className="h-64 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p className="text-slate-400">No hay datos de gastos para mostrar</p>
         </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 transition-colors">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#ffffff',
                    color: '#1e293b' 
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#94a3b8' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-slate-400">Gasto Total</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">${totalExpense.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">Detalle</h3>
        {data.sort((a,b) => b.value - a.value).map((item) => (
          <div key={item.name} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="font-bold text-slate-800 dark:text-white">${item.value.toLocaleString()}</span>
               <span className="text-[10px] text-slate-400">{Math.round((item.value / totalExpense) * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;