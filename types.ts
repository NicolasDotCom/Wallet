
export type TransactionType = 'income' | 'expense';
export type DebtType = 'payable' | 'receivable'; // payable = Yo debo, receivable = Me deben

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only used for validation, preferably hashed in real app
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string; // ISO string
  note?: string;
}

export interface Debt {
  id: string;
  title: string; // Nombre del banco, persona o concepto
  amount: number;
  type: DebtType;
  dueDate?: string; // Para prestamos normales
  notes?: string;
  // Credit Card specifics
  isCreditCard?: boolean;
  cutoffDay?: number; // Día del mes (1-31)
  paymentDay?: number; // Día del mes (1-31)
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Comida', icon: '🍔', color: '#ef4444', type: 'expense' },
  { id: 'transport', name: 'Transporte', icon: '🚌', color: '#f97316', type: 'expense' },
  { id: 'home', name: 'Hogar', icon: '🏠', color: '#8b5cf6', type: 'expense' },
  { id: 'entertainment', name: 'Ocio', icon: '🎬', color: '#ec4899', type: 'expense' },
  { id: 'health', name: 'Salud', icon: '💊', color: '#14b8a6', type: 'expense' },
  { id: 'other_expense', name: 'Otros', icon: '📦', color: '#64748b', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salario', icon: '💰', color: '#22c55e', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3b82f6', type: 'income' },
  { id: 'investment', name: 'Inversión', icon: '📈', color: '#eab308', type: 'income' },
  { id: 'other_income', name: 'Otros', icon: '💎', color: '#64748b', type: 'income' },
];
