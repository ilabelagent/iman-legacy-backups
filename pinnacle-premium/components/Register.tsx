
import React, { useState } from 'react';

interface RegisterProps {
  onSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess }) => {
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo@pinnaclepremiumexchange.com');
  const [password, setPassword] = useState('Demo123!');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call.
    // For this demo, we just simulate success.
    console.log('Registering with:', { name, email, password });
    onSuccess();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="registerName">Full Name</label>
          <input
            type="text"
            id="registerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="registerEmail">Email</label>
          <input
            type="email"
            id="registerEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="registerPassword">Password</label>
          <input
            type="password"
            id="registerPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <button type="submit" className="w-full font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;
