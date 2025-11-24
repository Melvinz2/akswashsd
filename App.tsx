
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Student } from './types';
import { checkSession, logout } from './services/authService';

function App() {
  const [user, setUser] = useState<Student | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionUser = await checkSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        setCheckingSession(false);
      }
    };

    initSession();
  }, []);

  const handleLogin = (student: Student) => {
    setUser(student);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (checkingSession) {
    return (
        <div className="min-h-screen bg-terminal-bg flex items-center justify-center text-terminal-green font-mono flex-col gap-2">
            <div className="w-12 h-12 border-4 border-terminal-green border-t-transparent rounded-full animate-spin"></div>
            <span className="animate-pulse mt-4">> Establishing Secure Connection...</span>
        </div>
    );
  }

  return (
    <>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard student={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
