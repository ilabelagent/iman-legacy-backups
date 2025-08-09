
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlatform } from '../hooks/usePlatform';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('demo@pinnaclepremiumexchange.com');
  const [password, setPassword] = useState('demo123');
  const { login } = useAuth();
  const { showToast } = usePlatform();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'demo@pinnaclepremiumexchange.com' && password === 'demo123') {
      login(email, 'Demo User', 'user');
      onSuccess();
    } else if (email === 'admin@pinnaclepremiumexchange.com' && password === 'admin123') {
      login(email, 'Admin', 'admin');
      onSuccess();
    }
    else {
      showToast('Login failed: Invalid credentials.', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <div className="mb-4 p-3 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800 rounded-r-lg text-sm">
        <strong>User:</strong> demo@pinnaclepremiumexchange.com / demo123<br/>
        <strong>Admin:</strong> admin@pinnaclepremiumexchange.com / admin123
      </div>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="loginPassword">Password</label>
          <input
            type="password"
            id="loginPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <button type="submit" className="w-full font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
