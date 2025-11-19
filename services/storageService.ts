import { Transaction, Debt, Category } from '../types';
import { getCurrentUser } from './authService';

// We prefix keys with the user ID to ensure data privacy between local users
const getUserKey = (baseKey: string) => {
  const user = getCurrentUser();
  if (!user) return baseKey; // Fallback for legacy data or unauth
  return `${baseKey}_${user.id}`;
};

const BASE_KEY_TRANSACTIONS = 'finanzas_mvp_data';
const BASE_KEY_DEBTS = 'finanzas_mvp_debts';
const BASE_KEY_CATEGORIES = 'finanzas_mvp_categories';
const STORAGE_KEY_THEME = 'finanzas_mvp_theme';

// --- Theme (Global per browser, or could be per user too) ---
export const getStoredTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem(STORAGE_KEY_THEME) as 'light' | 'dark') || 'light';
};

export const saveStoredTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem(STORAGE_KEY_THEME, theme);
};

// --- Categories ---

export const getCustomCategories = (): Category[] => {
  try {
    const key = getUserKey(BASE_KEY_CATEGORIES);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading categories", e);
    return [];
  }
};

export const saveCustomCategory = (category: Category): Category[] => {
  const current = getCustomCategories();
  const updated = [...current, category];
  const key = getUserKey(BASE_KEY_CATEGORIES);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

// --- Transactions ---

export const getTransactions = (): Transaction[] => {
  try {
    const key = getUserKey(BASE_KEY_TRANSACTIONS);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading storage", e);
    return [];
  }
};

export const saveTransaction = (transaction: Transaction): Transaction[] => {
  const current = getTransactions();
  const updated = [transaction, ...current];
  const key = getUserKey(BASE_KEY_TRANSACTIONS);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const deleteTransaction = (id: string): Transaction[] => {
  const current = getTransactions();
  const updated = current.filter(t => t.id !== id);
  const key = getUserKey(BASE_KEY_TRANSACTIONS);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

// --- Debts ---

export const getDebts = (): Debt[] => {
  try {
    const key = getUserKey(BASE_KEY_DEBTS);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading debts storage", e);
    return [];
  }
};

export const saveDebt = (debt: Debt): Debt[] => {
  const current = getDebts();
  const updated = [debt, ...current];
  const key = getUserKey(BASE_KEY_DEBTS);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const deleteDebt = (id: string): Debt[] => {
  const current = getDebts();
  const updated = current.filter(d => d.id !== id);
  const key = getUserKey(BASE_KEY_DEBTS);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

// --- Utils ---

export const calculateBalance = (transactions: Transaction[]) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    income,
    expense,
    total: income - expense
  };
};