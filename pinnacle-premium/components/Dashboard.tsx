
import React from 'react';
import { InvestmentType, Section } from '../types';
import { INVESTMENT_OPTIONS } from '../constants';
import DashboardCard from './DashboardCard';
import StatItem from './StatItem';
import InvestmentCard from './InvestmentCard';
import { BanknoteIcon, TrendingUpIcon, BriefcaseBusinessIcon } from './icons';
import { usePlatform } from '../hooks/usePlatform';

interface DashboardProps {
  onNavigate: (section: Section, tab?: InvestmentType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { portfolio, cashBalance, stakedAssets } = usePlatform();
  
  const portfolioValue = portfolio.reduce((sum, holding) => sum + holding.value, 0);
  const totalCostBasis = portfolio.reduce((sum, holding) => sum + holding.costBasis, 0);
  const portfolioROI = totalCostBasis > 0 ? ((portfolioValue - totalCostBasis) / totalCostBasis) * 100 : 0;
  
  const stakedValue = stakedAssets.reduce((sum, asset) => {
    const portfolioAsset = portfolio.find(p => p.symbol === asset.symbol);
    return sum + (asset.quantity * (portfolioAsset?.price || 0));
  }, 0);

  const netWorth = portfolioValue + cashBalance + stakedValue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  return (
    <div id="dashboard-section" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <DashboardCard className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2"><BriefcaseBusinessIcon className="w-7 h-7 text-indigo-500" /> Financial Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatItem value={formatCurrency(netWorth)} label="Net Worth" />
            <StatItem value={formatCurrency(portfolioValue)} label="Portfolio Value" />
            <StatItem value={`${portfolioROI.toFixed(2)}%`} label="Portfolio ROI" positive={portfolioROI >= 0} />
            <StatItem value={formatCurrency(cashBalance)} label="Platform Balance" />
          </div>
          <button onClick={() => onNavigate('portfolio')} className="w-full font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5">
            View Full Portfolio
          </button>
        </DashboardCard>
        
        <DashboardCard className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🚀 Quick Actions</h2>
          <div className="flex flex-col gap-4">
             <button onClick={() => onNavigate('invest')} className="w-full flex items-center justify-center gap-2 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5">
              <TrendingUpIcon className="w-5 h-5" />
              Start Investing
            </button>
            <button onClick={() => onNavigate('banking')} className="w-full flex items-center justify-center gap-2 font-semibold bg-transparent border-2 border-indigo-500 text-indigo-500 px-6 py-3 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5">
              <BanknoteIcon className="w-5 h-5" />
              Banking Services
            </button>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🏛️ Explore Investment Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {INVESTMENT_OPTIONS.map((option) => (
            <InvestmentCard
                key={option.id}
                option={option}
                onClick={() => onNavigate('invest', option.id)}
            />
            ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default Dashboard;
