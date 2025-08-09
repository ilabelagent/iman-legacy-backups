
import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import { BriefcaseBusinessIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon, LightbulbIcon, LoaderCircle, CalculatorIcon, PaletteIcon } from './icons';
import { InvestmentType, PortfolioHolding, Sentiment } from '../types';
import StatItem from './StatItem';
import { usePlatform } from '../hooks/usePlatform';
import Modal from './Modal';
import { getInvestmentThesis, getMarketSentiment, parseScenarioQuery } from '../services/geminiService';
import InvestmentModelCard from './InvestmentModelCard';

interface PortfolioProps {
  onNavigateToAnalysis: (investment: InvestmentType, symbol: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onNavigateToAnalysis }) => {
  const { portfolio, nfts, setTradeModalDetails, investmentModels, showToast } = usePlatform();
  const [activeTab, setActiveTab] = useState<'holdings' | 'collectibles'>('holdings');
  
  const [thesisModal, setThesisModal] = useState<{isOpen: boolean, content: string, title: string}>({isOpen: false, content: '', title: ''});
  const [isLoadingThesis, setIsLoadingThesis] = useState(false);
  const [scenarioQuery, setScenarioQuery] = useState('');
  const [simulatedPortfolio, setSimulatedPortfolio] = useState<PortfolioHolding[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // This effect is removed because sentiments are now handled dynamically in context or would be fetched on-demand.
  // Re-introducing this effect would cause an infinite loop due to the removal of setPortfolio from context.

  const handleGenerateThesis = async (holding: PortfolioHolding) => {
    setIsLoadingThesis(true);
    setThesisModal({isOpen: true, content: '', title: `Generating Thesis for ${holding.name}...`});
    try {
        const thesis = await getInvestmentThesis(holding.symbol, holding.name);
        setThesisModal({isOpen: true, content: thesis, title: `Investment Thesis for ${holding.name}`});
    } catch (error) {
        console.error("Failed to generate thesis:", error);
        setThesisModal({isOpen: true, content: 'Could not generate thesis at this time.', title: 'Error'});
    } finally {
        setIsLoadingThesis(false);
    }
  };

  const handleSimulate = async () => {
    if(!scenarioQuery) return;
    setIsSimulating(true);
    try {
        const changes = await parseScenarioQuery(scenarioQuery);
        const newPortfolio = portfolio.map(holding => {
            const change = changes.find(c => c.symbol.toUpperCase() === holding.symbol.toUpperCase());
            if (change) {
                const newPrice = holding.price * (1 + change.changePercent / 100);
                return { ...holding, price: newPrice, value: newPrice * holding.quantity };
            }
            return holding;
        });
        setSimulatedPortfolio(newPortfolio);
    } catch(e) {
        console.error("Simulation failed:", e);
        showToast("Could not parse your scenario. Please try a simpler query, e.g., 'what if BTC goes up 10%'.", "error");
    } finally {
        setIsSimulating(false);
    }
  }

  const renderSentimentIcon = (sentiment?: Sentiment) => {
    switch (sentiment) {
      case 'Bullish': return <TrendingUpIcon className="w-5 h-5 text-green-500" />;
      case 'Bearish': return <TrendingDownIcon className="w-5 h-5 text-red-500" />;
      case 'Neutral': return <MinusIcon className="w-5 h-5 text-gray-500" />;
      default: return <LoaderCircle className="w-5 h-5 animate-spin text-gray-400" />;
    }
  }

  const totalValue = portfolio.reduce((sum, holding) => sum + holding.value, 0);
  const totalCostBasis = portfolio.reduce((sum, holding) => sum + holding.costBasis, 0);
  const total24hChangeValue = portfolio.reduce((sum, holding) => sum + (holding.value * holding.change24h_percent / 100), 0);
  const total24hChangePercent = ((totalValue - total24hChangeValue) !== 0) ? (total24hChangeValue / (totalValue - total24hChangeValue)) * 100 : 0;
  const portfolioROI = totalCostBasis > 0 ? ((totalValue - totalCostBasis) / totalCostBasis) * 100 : 0;
  
  const simulatedTotalValue = simulatedPortfolio?.reduce((sum, holding) => sum + holding.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  const tabs = [
    { id: 'holdings', label: 'Holdings' },
    { id: 'collectibles', label: `Collectibles (${nfts.length})` },
  ];

  return (
    <div className="space-y-6">
      <DashboardCard>
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 mb-6">
              <BriefcaseBusinessIcon className="w-8 h-8 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-800">📊 Portfolio Management</h2>
            </div>
            <div className="flex border-b border-gray-200/50">
                {tabs.map(tab => (
                     <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 text-sm font-bold transition-colors duration-300 ${activeTab === tab.id ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50 rounded-t-lg' : 'text-gray-500 hover:text-indigo-500'}`}
                     >{tab.label}</button>
                ))}
            </div>
        </div>
        
        {activeTab === 'holdings' && (
            <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-xl">
              <StatItem value={formatCurrency(totalValue)} label="Total Value" />
              <StatItem value={`${portfolioROI.toFixed(2)}%`} label="Total ROI" positive={portfolioROI >= 0} />
              <StatItem value={formatCurrency(totalValue - totalCostBasis)} label="Total P/L" positive={totalValue >= totalCostBasis}/>
              <StatItem value={portfolio.length.toString()} label="Total Assets" />
            </div>
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 font-bold text-gray-500 text-sm">
                <span className="col-span-3">Asset</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">Holdings</span>
                <span className="col-span-1 text-center">24h %</span>
                <span className="col-span-1 text-center">Sentiment</span>
                <span className="col-span-3 text-center">Actions</span>
              </div>
              {portfolio.map(holding => {
                const isPositive = holding.change24h_percent >= 0;
                const HoldingIcon = holding.icon;
                return (
                  <div key={holding.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white hover:bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 transition-colors duration-200">
                    <div className="md:col-span-3 flex items-center gap-4">
                      <HoldingIcon className="w-10 h-10 text-indigo-500 bg-indigo-100 p-2 rounded-full" />
                      <div>
                        <div className="font-bold text-gray-800">{holding.name}</div>
                        <div className="text-sm text-gray-500">{holding.symbol}</div>
                      </div>
                    </div>
                    <div className="md:col-span-2 text-left md:text-right font-mono text-gray-800">
                      <span className="md:hidden font-semibold text-gray-500">Price: </span>{formatCurrency(holding.price)}
                    </div>
                    <div className="md:col-span-2 text-left md:text-right text-gray-600">
                      <div className="font-bold text-gray-800"><span className="md:hidden font-semibold text-gray-500">Value: </span>{formatCurrency(holding.value)}</div>
                      <div className="text-sm"><span className="md:hidden font-semibold">Qty: </span>{holding.quantity.toFixed(4)} {holding.symbol}</div>
                    </div>
                    <div className={`md:col-span-1 text-left md:text-center font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      <span className="md:hidden text-gray-500">24h %: </span>{isPositive ? '+' : ''}{holding.change24h_percent.toFixed(2)}%
                    </div>
                    <div className="md:col-span-1 flex justify-center items-center" title={holding.sentiment || 'Loading...'}>{renderSentimentIcon(holding.sentiment)}</div>
                    <div className="md:col-span-3 flex items-center justify-start md:justify-center gap-2 flex-wrap">
                      <button onClick={() => setTradeModalDetails({ action: 'buy', holding })} className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-all">Trade</button>
                      <button onClick={() => onNavigateToAnalysis(holding.type, holding.symbol)} className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-all">Analyze</button>
                      <button onClick={() => handleGenerateThesis(holding)} className="text-xs font-semibold bg-indigo-100 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-200 transition-all flex items-center gap-1"><LightbulbIcon className="w-4 h-4"/> Thesis</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
        
        {activeTab === 'collectibles' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {nfts.length > 0 ? nfts.map(nft => (
                    <div key={nft.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                        <img src={nft.imageUrl} alt={nft.name} className="w-full h-48 object-cover" />
                        <div className="p-3">
                            <p className="font-bold text-sm">{nft.name}</p>
                            <p className="text-xs text-gray-500">{nft.collection}</p>
                            <p className="text-xs mt-2">Paid: {nft.purchasePrice} ETH</p>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-16 text-gray-500">
                        <PaletteIcon className="w-12 h-12 mx-auto mb-4 text-gray-300"/>
                        <p className="font-semibold">No collectibles yet.</p>
                        <p className="text-sm">Visit the Invest hub to explore NFT marketplaces.</p>
                    </div>
                )}
            </div>
        )}
      </DashboardCard>

      <DashboardCard>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2"><CalculatorIcon className="w-7 h-7 text-indigo-500" /> "What-If" Scenario Simulator</h2>
          <p className="text-gray-600 mb-4">Use natural language to see how market changes could affect your portfolio. Try: "What if BTC goes up 10% and NVDA drops 5%?"</p>
          <div className="flex flex-col sm:flex-row gap-4">
              <input
                  type="text"
                  value={scenarioQuery}
                  onChange={(e) => setScenarioQuery(e.target.value)}
                  placeholder="Enter your scenario here..."
                  className="flex-grow w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button onClick={handleSimulate} disabled={isSimulating} className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:shadow-lg disabled:opacity-50">
                  {isSimulating ? <LoaderCircle className="animate-spin w-5 h-5"/> : 'Simulate'}
              </button>
          </div>
          {simulatedPortfolio && simulatedTotalValue !== undefined && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-fade-in-up">
                  <h3 className="text-lg font-bold mb-4">Simulation Results:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <StatItem label="Original Value" value={formatCurrency(totalValue)} />
                      <StatItem label="Simulated Value" value={formatCurrency(simulatedTotalValue)} />
                      <StatItem label="Net Change" value={formatCurrency(simulatedTotalValue - totalValue)} positive={simulatedTotalValue >= totalValue} />
                  </div>
                  <button onClick={() => setSimulatedPortfolio(null)} className="text-sm font-semibold mt-4 text-indigo-600 hover:text-indigo-800">Clear Simulation</button>
              </div>
          )}
      </DashboardCard>
      
      <DashboardCard>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">✨ Featured Investment Models</h2>
        <p className="text-gray-600 mb-6">Explore curated portfolios designed for different goals and risk appetites.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentModels.map((model) => (
                <InvestmentModelCard key={model.id} model={model} />
            ))}
         </div>
      </DashboardCard>

      <Modal isVisible={thesisModal.isOpen} onClose={() => setThesisModal({isOpen: false, content: '', title: ''})}>
        <h2 className="text-2xl font-bold mb-4">{thesisModal.title}</h2>
        {isLoadingThesis ? (
            <div className="flex justify-center items-center h-24">
                <LoaderCircle className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        ) : (
            <div className="text-gray-700 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                {thesisModal.content}
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Portfolio;
