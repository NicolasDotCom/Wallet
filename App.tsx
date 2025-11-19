import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  PieChart, 
  Sparkles,
  Wallet,
  CreditCard,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

import { Transaction, Debt, User } from './types';
import { getTransactions, getDebts, getStoredTheme, saveStoredTheme } from './services/storageService';
import { getCurrentUser, logoutUser } from './services/authService';

// Import pages
import Dashboard from './components/pages/Dashboard';
import AddTransaction from './components/pages/AddTransaction';
import Reports from './components/pages/Reports';
import Advisor from './components/pages/Advisor';
import Debts from './components/pages/Debts';
import AddDebt from './components/pages/AddDebt';
import Login from './components/pages/Login';
import Register from './components/pages/Register';

type View = 'dashboard' | 'add_transaction' | 'reports' | 'advisor' | 'debts' | 'add_debt';
type AuthView = 'login' | 'register' | 'app';

const App: React.FC = () => {
  // Auth State
  const [authView, setAuthView] = useState<AuthView>('login'); // Default to login check
  const [user, setUser] = useState<User | null>(null);

  // App State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initial Auth Check & Theme Load
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setTheme(storedTheme);

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setAuthView('app');
      // Data will be loaded in the next effect when user state changes
    }
  }, []);

  // Load Data when User changes (or login happens)
  useEffect(() => {
    if (user) {
      setTransactions(getTransactions());
      setDebts(getDebts());
    }
  }, [user]);

  // Apply theme to body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a'; // slate-950
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc'; // slate-50
    }
    saveStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    // Removed confirm dialog to ensure immediate action and avoid browser blocking
    logoutUser();
    setUser(null);
    setAuthView('login');
    setTransactions([]);
    setDebts([]);
    setCurrentView('dashboard');
  };

  const refreshData = () => {
    setTransactions(getTransactions());
    setDebts(getDebts());
  };

  const handleTransactionSaved = () => {
    refreshData();
    setCurrentView('dashboard');
  };
  
  const handleDebtSaved = () => {
    refreshData();
    setCurrentView('debts');
  };

  // Render Auth Views
  if (authView === 'login') {
    return (
      <Login 
        onLoginSuccess={(u) => { setUser(u); setAuthView('app'); }} 
        onGoToRegister={() => setAuthView('register')} 
      />
    );
  }

  if (authView === 'register') {
    return (
      <Register 
        onRegisterSuccess={(u) => { setUser(u); setAuthView('app'); }} 
        onGoToLogin={() => setAuthView('login')} 
      />
    );
  }

  // Main App Render (Only if authenticated)
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'add_transaction':
        return <AddTransaction onSave={handleTransactionSaved} onCancel={() => setCurrentView('dashboard')} />;
      case 'reports':
        return <Reports transactions={transactions} />;
      case 'debts':
        return <Debts debts={debts} onAddDebt={() => setCurrentView('add_debt')} onDebtDeleted={refreshData} />;
      case 'add_debt':
        return <AddDebt onSave={handleDebtSaved} onCancel={() => setCurrentView('debts')} />;
      case 'advisor':
        return <Advisor transactions={transactions} debts={debts} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* Mobile Container Wrapper */}
      <div className="w-full max-w-md h-full min-h-screen shadow-2xl flex flex-col relative overflow-hidden transition-colors duration-300 bg-white dark:bg-slate-900">
        
        {/* Header */}
        {/* Z-index 40 ensures header is always on top of scrolling content */}
        <header className="bg-slate-900 dark:bg-black text-white p-4 pt-14 pb-10 rounded-b-3xl shadow-lg z-40 relative transition-colors">
          <div className="flex justify-between items-center mb-2 relative z-50">
            <div className="flex items-center gap-2 pointer-events-none">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Wallet size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Mi Billetera</h1>
                <p className="text-xs text-slate-400 font-medium">Hola, {user?.name.split(' ')[0]}</p>
              </div>
            </div>
            {/* Reinforced Z-Index and pointer events for buttons */}
            <div className="flex items-center gap-3 relative z-50 pointer-events-auto">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                aria-label="Alternar tema"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full bg-slate-800 text-red-400 hover:text-white hover:bg-red-900 transition-all cursor-pointer"
                aria-label="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        {/* Z-index 0 ensures content slides BEHIND the header */}
        <main className="flex-1 overflow-y-auto pb-24 -mt-6 z-0 px-4 bg-transparent relative">
           {renderView()}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 w-full bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 px-4 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30 transition-colors">
          <NavButton 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
            icon={<LayoutDashboard size={22} />} 
            label="Inicio" 
          />
          
          <NavButton 
            active={currentView === 'debts' || currentView === 'add_debt'} 
            onClick={() => setCurrentView('debts')} 
            icon={<CreditCard size={22} />} 
            label="Deudas" 
          />

          {/* Floating Action Button for Add Transaction */}
          <div className="relative -top-8">
            <button 
              onClick={() => setCurrentView('add_transaction')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-transform active:scale-95 flex items-center justify-center border-4 border-slate-50 dark:border-slate-900"
            >
              <PlusCircle size={30} />
            </button>
          </div>

          <NavButton 
            active={currentView === 'reports'} 
            onClick={() => setCurrentView('reports')} 
            icon={<PieChart size={22} />} 
            label="Reportes" 
          />

          <NavButton 
            active={currentView === 'advisor'} 
            onClick={() => setCurrentView('advisor')} 
            icon={<Sparkles size={22} />} 
            label="IA Tips" 
          />
        </nav>

      </div>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-2 transition-colors ${
      active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;