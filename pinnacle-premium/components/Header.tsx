
import React from 'react';
import { Section } from '../types';
import { NAV_LINKS } from '../constants';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  onLogin: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, onLogin, onRegister }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-md rounded-2xl p-5 mb-6 shadow-2xl shadow-black/10">
      <nav className="flex justify-between items-center flex-wrap gap-4">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          📈 Pinnacle Premium Exchange
        </div>
        
        {currentUser && (
          <ul className="flex items-center gap-2 sm:gap-6 list-none flex-wrap">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(link.id);
                  }}
                  className={`text-sm sm:text-base font-medium p-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 ${
                    activeSection === link.id
                      ? 'text-indigo-600 bg-indigo-100'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="auth-buttons flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="text-sm text-gray-600 hidden md:inline">Welcome, {currentUser.name}!</span>
              <button onClick={logout} className="text-sm font-semibold bg-transparent border-2 border-indigo-500 text-indigo-500 px-4 py-2 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={onLogin} className="text-sm font-semibold bg-transparent border-2 border-white text-white px-4 py-2 rounded-xl hover:bg-white hover:text-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5">
                Login
              </button>
              <button onClick={onRegister} className="text-sm font-semibold bg-white text-indigo-600 px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5">
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
