
import React, { useState, useEffect } from 'react';
import { InvestmentType } from '../types';
import DashboardCard from './DashboardCard';
import { getInvestmentAnalysis } from '../services/geminiService';
import { SparklesIcon, ZapIcon, LoaderCircle } from './icons';
import AnalysisDisplay from './AnalysisDisplay';
import { usePlatform } from '../hooks/usePlatform';
import { INVESTMENT_ICONS } from '../constants';

interface TradingProps {
  selectedAsset: { investmentType: InvestmentType, symbol: string } | null;
}

const Trading: React.FC<TradingProps> = ({ selectedAsset }) => {
  const { setTradeModalDetails, portfolio } = usePlatform();
  
  const [assetSymbol, setAssetSymbol] = useState('');
  const [investmentType, setInvestmentType] = useState<InvestmentType>('stocks');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedAsset) {
      setAssetSymbol(selectedAsset.symbol);
      setInvestmentType(selectedAsset.investmentType);
      setAnalysis('');
      setError(null);
    }
  }, [selectedAsset]);

  const handleAnalyze = async () => {
    if (!assetSymbol) {
      setError('Please enter an asset symbol or name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const result = await getInvestmentAnalysis(assetSymbol, investmentType);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to get analysis. Please check the asset symbol or try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenTradeModal = (action: 'buy' | 'sell') => {
    const currentAssetInPortfolio = portfolio.find(h => h.symbol.toUpperCase() === assetSymbol.toUpperCase());
    
    setTradeModalDetails({
        action: action,
        holding: currentAssetInPortfolio || {
            symbol: assetSymbol.toUpperCase(),
            name: assetSymbol,
            price: 0, // Will be fetched or simulated
            type: investmentType,
            icon: INVESTMENT_ICONS[investmentType] || INVESTMENT_ICONS.stocks
        },
    });
  }

  return (
    <DashboardCard>
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon className="w-8 h-8 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-800">AI Investment Analysis</h2>
      </div>
      <p className="mb-6 text-gray-600">
        Enter a stock ticker, crypto symbol, or asset name to get an instant analysis powered by Gemini.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text" value={assetSymbol}
          onChange={(e) => setAssetSymbol(e.target.value.toUpperCase())}
          placeholder="e.g., AAPL, ETH, GOLD"
          className="flex-grow w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        />
        <button onClick={handleAnalyze} disabled={isLoading} className="flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? <LoaderCircle className="animate-spin w-6 h-6" /> : <ZapIcon className="w-6 h-6" />}
          <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
        </button>
      </div>

      {error && <div className="p-4 mb-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">{error}</div>}

      {analysis && (
        <>
          <AnalysisDisplay analysis={analysis} assetSymbol={assetSymbol} />
          <div className="mt-6 flex gap-4 justify-end">
            <button onClick={() => handleOpenTradeModal('buy')} className="px-6 py-3 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all">Buy {assetSymbol}</button>
            <button onClick={() => handleOpenTradeModal('sell')} className="px-6 py-3 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all">Sell {assetSymbol}</button>
          </div>
        </>
      )}
    </DashboardCard>
  );
};

export default Trading;
