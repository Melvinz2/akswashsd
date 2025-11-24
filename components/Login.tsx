
import React, { useState } from 'react';
import { login } from '../services/authService';
import { TerminalInput } from './TerminalInput';
import { Student } from '../types';

interface LoginProps {
  onLogin: (student: Student) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !accessKey) {
      setError('Username and Access Key required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(username, accessKey);
      onLogin(response.user);
    } catch (err) {
      setError('Access Denied: Invalid credentials.');
      setAccessKey('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg bg-terminal-header border border-terminal-border rounded-lg shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-2 bg-terminal-border border-b border-terminal-border">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-4 text-xs text-gray-400">user@codevault:~/login</div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 bg-terminal-bg min-h-[300px] flex flex-col">
          <div className="mb-6">
             <h1 className="text-2xl font-bold text-terminal-text mb-2">Welcome to CodeVault</h1>
             <p className="text-gray-500 text-sm">Restricted Access. Database Connection Established.</p>
          </div>

          <div className="flex-grow">
            <TerminalInput 
              label="username:" 
              value={username} 
              onChange={setUsername} 
              autoFocus 
            />
            <TerminalInput 
              label="access_key:" 
              value={accessKey} 
              onChange={setAccessKey} 
              type="password"
              onEnter={handleLogin}
            />
            
            {loading && (
              <div className="mt-4 text-terminal-blue animate-pulse">
                > Verifying credentials with server...
              </div>
            )}

            {error && (
              <div className="mt-4 text-red-500">
                > Error: {error}
              </div>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 w-full bg-terminal-border hover:bg-terminal-green text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSING' : 'ENTER SYSTEM'}
          </button>
        </div>
      </div>
    </div>
  );
};
