
import React, { useState } from 'react';
import { InvestmentModel } from '../types';
import Modal from './Modal';
import { usePlatform } from '../hooks/usePlatform';

interface InvestmentModelCardProps {
    model: InvestmentModel;
}

const InvestmentModelCard: React.FC<InvestmentModelCardProps> = ({ model }) => {
    const [roiPeriod, setRoiPeriod] = useState<'quarterly' | 'yearly'>('yearly');
    const [isModalOpen, setModalOpen] = useState(false);
    const [investmentAmount, setInvestmentAmount] = useState('1000');
    const { investInModel, showToast } = usePlatform();
    
    const riskColorClasses = {
        Low: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        High: 'bg-red-100 text-red-800',
    };

    const ModelIcon = model.icon;
    const roi = roiPeriod === 'quarterly' ? model.roi.quarterly : model.roi.yearly;

    const handleInvest = () => {
      const amount = parseFloat(investmentAmount);
      if(isNaN(amount) || amount <= 0) {
        showToast("Please enter a valid investment amount.", "error");
        return;
      }
      const success = investInModel(model, amount);
      if (success) {
        setModalOpen(false);
      }
    }

    return (
        <>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:shadow-black/20 hover:-translate-y-2 flex flex-col text-left">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                    <ModelIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${riskColorClasses[model.riskLevel]}`}>
                    {model.riskLevel} Risk
                </div>
            </div>
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{model.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{model.description}</p>
            </div>
            <div className="mt-auto">
                <div className="flex justify-between items-center mb-4">
                     <div>
                        <p className="text-xs font-semibold text-gray-500">Projected ROI</p>
                        <p className="text-2xl font-bold text-indigo-600">{roi.toFixed(1)}%</p>
                     </div>
                     <div className="flex bg-gray-200 rounded-full p-1 text-xs font-semibold">
                        <button onClick={() => setRoiPeriod('quarterly')} className={`px-3 py-1 rounded-full transition-colors ${roiPeriod === 'quarterly' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}>Q</button>
                        <button onClick={() => setRoiPeriod('yearly')} className={`px-3 py-1 rounded-full transition-colors ${roiPeriod === 'yearly' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}>Y</button>
                     </div>
                </div>
                <button onClick={() => setModalOpen(true)} className="w-full font-semibold bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all">
                    Explore Model
                </button>
            </div>
        </div>
        <Modal isVisible={isModalOpen} onClose={() => setModalOpen(false)}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{model.title}</h2>
            <p className="text-gray-600 mb-4">{model.description}</p>
            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Asset Allocation:</h4>
                <ul className="space-y-2">
                    {model.constituents.map(c => (
                        <li key={c.symbol} className="flex justify-between items-center text-sm">
                            <span className="font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded">{c.symbol}</span>
                            <span>{c.weight * 100}%</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2">Investment Amount (USD)</label>
                <input 
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                />
            </div>
            <button onClick={handleInvest} className="w-full font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl">Invest in this Model</button>
        </Modal>
        </>
    );
}

export default InvestmentModelCard;
