
import { Student, AuthResponse } from '../types';

const TOKEN_KEY = 'codevault_session_token';
const USER_KEY = 'codevault_user_data';

// --- MOCK DATABASE (Data Dummy) ---
const MOCK_USERS = [
  { 
    id: 's1', 
    username: 'student_01', 
    name: 'Ahmad Student', 
    role: 'student',
    accessKey: 'learn2code' 
  },
  { 
    id: 's2', 
    username: 'student_02', 
    name: 'Budi React', 
    role: 'student',
    accessKey: 'react_rocks' 
  },
  { 
    id: 'admin1', 
    username: 'admin', 
    name: 'System Administrator', 
    role: 'admin',
    accessKey: 'admin123' 
  },
  { 
    id: 'g1', 
    username: 'demo', 
    name: 'Guest User', 
    role: 'student',
    accessKey: '123456' 
  }
];

/**
 * Login using Mock Data
 */
export const login = async (username: string, accessKey: string): Promise<AuthResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const userMatch = MOCK_USERS.find(u => u.username === username && u.accessKey === accessKey);

  if (!userMatch) {
    throw new Error('Invalid credentials');
  }

  // Create safe user object (without accessKey)
  const user: Student = {
    id: userMatch.id,
    username: userMatch.username,
    name: userMatch.name,
    role: userMatch.role as 'student' | 'admin'
  };

  const token = `mock-token-${Date.now()}`;

  // Save to localStorage to simulate session
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { user, token };
};

/**
 * Check Session from LocalStorage
 */
export const checkSession = async (): Promise<Student | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);

  if (!token || !userStr) return null;

  try {
    return JSON.parse(userStr) as Student;
  } catch (e) {
    return null;
  }
};

/**
 * Logout (Clear LocalStorage)
 */
export const logout = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
