import React from 'react';
import { InvestmentOption } from '../types';
import { INVESTMENT_ICONS } from '../constants';

interface InvestmentCardProps {
  option: InvestmentOption;
  onClick: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ option, onClick }) => {
  const Icon = INVESTMENT_ICONS[option.id];
  return (
    <div
      onClick={onClick}
      className="bg-white/95 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg shadow-black/5 cursor-pointer transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1.5 border-2 border-transparent hover:border-indigo-400 h-full flex flex-col justify-center"
    >
      <Icon className="w-10 h-10 mx-auto mb-3 text-indigo-500" />
      <h3 className="text-md font-bold text-gray-800">{option.title}</h3>
    </div>
  );
};

export default InvestmentCard;
