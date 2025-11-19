
import { User } from '../types';

const STORAGE_KEY_USERS = 'finanzas_mvp_users';
const STORAGE_KEY_SESSION = 'finanzas_mvp_current_user';

// Helper function defined first
function setCurrentUser(user: User) {
  // Don't store password in session
  const safeUser = { ...user };
  delete safeUser.password; 
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(safeUser));
}

export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SESSION);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const registerUser = (name: string, email: string, password: string): { success: boolean; message?: string, user?: User } => {
  const users = getUsers();
  
  if (users.some(u => u.email === email)) {
    return { success: false, message: 'El correo electrónico ya está registrado.' };
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    password // In a real app, never store plain text passwords
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  
  // Auto login
  setCurrentUser(newUser);
  
  return { success: true, user: newUser };
};

export const loginUser = (email: string, password: string): { success: boolean; message?: string, user?: User } => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: 'Credenciales incorrectas.' };
  }

  setCurrentUser(user);
  return { success: true, user };
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEY_SESSION);
};
