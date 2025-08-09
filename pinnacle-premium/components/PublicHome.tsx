import React, { useState, ReactNode } from 'react';
import { INVESTMENT_OPTIONS } from '../constants';
import { INVESTMENT_ICONS } from '../constants';
import { ArrowRightIcon, SparklesIcon, BriefcaseBusinessIcon, ShieldCheckIcon, HeartHandshakeIcon } from './icons';
import Modal from './Modal';
import { InvestmentOption } from '../types';

interface PublicHomeProps {
  onLogin: () => void;
  onRegister: () => void;
}

const FeatureCard: React.FC<{ icon: ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 text-left">
    <div className="bg-white/20 text-white rounded-full h-12 w-12 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
    <p className="text-indigo-200 text-sm">{description}</p>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; role: string }> = ({ quote, name, role }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left h-full flex flex-col">
    <p className="text-indigo-100 flex-grow text-lg italic">"{quote}"</p>
    <div className="mt-4 pt-4 border-t border-white/20">
      <p className="font-bold text-white">{name}</p>
      <p className="text-sm text-indigo-300">{role}</p>
    </div>
  </div>
);


const PublicHome: React.FC<PublicHomeProps> = ({ onLogin, onRegister }) => {
  const [selectedOption, setSelectedOption] = useState(INVESTMENT_OPTIONS[0]);
  const [modalContent, setModalContent] = useState<InvestmentOption | null>(null);

  const handleAssetClick = (option: InvestmentOption) => {
    setSelectedOption(option);
    if(option.detailedDescription) {
        setModalContent(option);
    }
  };

  return (
    <>
      <div className="text-white text-center pt-10 sm:pt-20">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4" style={{textShadow: '0 2px 10px rgba(0,0,0,0.2)'}}>
          The Future of Investing is Here.
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-indigo-200" style={{textShadow: '0 1px 5px rgba(0,0,0,0.2)'}}>
          Intelligent, Intuitive, Instant. Leverage AI-powered insights to build your wealth across stocks, crypto, and more.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onRegister} className="flex items-center gap-2 text-base sm:text-lg font-bold bg-white text-indigo-600 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1">
            Get Started <ArrowRightIcon className="w-5 h-5" />
          </button>
          <button onClick={onLogin} className="text-base sm:text-lg font-bold bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl shadow-lg hover:bg-white hover:text-indigo-500 transition-all duration-300 transform hover:-translate-y-1">
            Login
          </button>
        </div>
      </div>

      <div className="text-white text-center py-16 sm:py-24">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-2xl shadow-black/10 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">Explore a Universe of Assets</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 text-center mb-8">
              {INVESTMENT_OPTIONS.map((option) => {
                const Icon = INVESTMENT_ICONS[option.id];
                const isSelected = selectedOption.id === option.id;
                return (
                  <div
                      key={option.id}
                      onMouseEnter={() => setSelectedOption(option)}
                      onClick={() => handleAssetClick(option)}
                      className={`p-4 rounded-xl transition-all duration-300 cursor-pointer transform ${isSelected ? 'bg-white/25 scale-105' : 'hover:bg-white/20 hover:scale-105'}`}
                  >
                      <div className={`flex justify-center items-center h-16 w-16 mx-auto mb-3 rounded-full transition-colors duration-300 ${isSelected ? 'bg-white/30' : 'bg-white/20'}`}>
                          <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-white">{option.title}</h3>
                  </div>
                );
              })}
          </div>
          <div className="relative text-center text-indigo-100 min-h-[100px] flex items-center justify-center p-4 bg-black/10 rounded-lg transition-all duration-300">
            {selectedOption && (
              <p key={selectedOption.id} className="text-lg max-w-3xl mx-auto animate-fade-in-up">
                  {selectedOption.description}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Why Pinnacle Premium Exchange?</h2>
            <p className="text-lg text-indigo-200 mb-12 max-w-2xl mx-auto">A platform built on a foundation of integrity, innovation, and purpose-driven growth.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={<SparklesIcon className="w-6 h-6"/>} title="AI-Powered Insights" description="Leverage Gemini's advanced AI for objective market analysis and data-driven decisions." />
              <FeatureCard icon={<BriefcaseBusinessIcon className="w-6 h-6"/>} title="Diverse Asset Universe" description="From stocks to DeFi, access a curated universe of assets that align with a modern portfolio." />
              <FeatureCard icon={<ShieldCheckIcon className="w-6 h-6"/>} title="Secure & Transparent" description="Trade with confidence on a platform built with institutional-grade security and blockchain transparency." />
              <FeatureCard icon={<HeartHandshakeIcon className="w-6 h-6"/>} title="Values-Driven Investing" description="Align your investments with your convictions. Champion businesses and technologies that serve humanity." />
            </div>
          </div>
      </div>
      
      <div className="py-16 sm:py-24 bg-white/5">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-12">From Our Community of Stewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <TestimonialCard quote="This is more than a trading platform; it's a tool for building a multi-generational legacy. The focus on values and long-term impact is unparalleled." name="David L." role="Legacy Builder" />
             <TestimonialCard quote="Finally, a place that understands crypto is about more than just speculation. The emphasis on stewardship and supporting foundational protocols resonates deeply with me." name="Sarah M." role="Crypto Steward" />
             <TestimonialCard quote="The AI analysis helps me cut through the noise and make informed decisions. It feels like having a principled research assistant 24/7." name="Daniel T." role="Ethical Technologist" />
          </div>
        </div>
      </div>

      <div className="py-20 sm:py-32 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Build Your Legacy?</h2>
        <p className="text-lg text-indigo-200 mb-8 max-w-2xl mx-auto">Join a community of forward-thinking investors. The future of principled wealth creation starts now.</p>
        <button onClick={onRegister} className="flex items-center justify-center mx-auto gap-2 text-lg font-bold bg-white text-indigo-600 px-10 py-5 rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1">
            Get Started Now <ArrowRightIcon className="w-6 h-6" />
        </button>
      </div>


      <Modal isVisible={!!modalContent} onClose={() => setModalContent(null)}>
        {modalContent && (
          <div className="p-2 text-left">
            {modalContent.detailedDescription}
          </div>
        )}
      </Modal>
    </>
  );
}

export default PublicHome;