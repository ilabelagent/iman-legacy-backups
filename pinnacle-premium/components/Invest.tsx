
import React, { useState } from 'react';
import { InvestmentType } from '../types';
import DashboardCard from './DashboardCard';
import { MOCK_DEFI_PROTOCOLS, MOCK_NFT_COLLECTIONS, MOCK_PORTFOLIO, INVESTMENT_ICONS } from '../constants';
import Mining from './Mining';
import { usePlatform } from '../hooks/usePlatform';
import Modal from './Modal';
import { DeFiProtocol } from '../types';

interface InvestProps {
  onNavigateToAnalysis: (investment: InvestmentType, symbol: string) => void;
  activeTab: InvestmentType;
  setActiveTab: (tab: InvestmentType) => void;
}

const Invest: React.FC<InvestProps> = ({ onNavigateToAnalysis, activeTab, setActiveTab }) => {
    const { buyNft, investInDeFi, cashBalance, showToast, setTradeModalDetails } = usePlatform();
    const [defiModal, setDefiModal] = useState<DeFiProtocol | null>(null);
    const [defiAmount, setDefiAmount] = useState('');

    const tabs: {id: InvestmentType, label: string}[] = [
        { id: 'stocks', label: 'Stocks' },
        { id: 'crypto', label: 'Crypto' },
        { id: 'reits', label: 'REITs' },
        { id: 'commodities', label: 'Commodities' },
        { id: 'defi', label: 'DeFi Protocols' },
        { id: 'nft', label: 'NFT Marketplace' },
        { id: 'mining', label: 'Crypto Mining' },
    ];
    
    const popularAssets: {[key in Exclude<InvestmentType, 'defi' | 'nft' | 'mining'>]?: {name: string, symbol: string, price: number}[]} = {
        stocks: MOCK_PORTFOLIO.filter(p => p.type === 'stocks').map(p => ({name: p.name, symbol: p.symbol, price: p.price})),
        crypto: MOCK_PORTFOLIO.filter(p => p.type === 'crypto').map(p => ({name: p.name, symbol: p.symbol, price: p.price})),
        reits: MOCK_PORTFOLIO.filter(p => p.type === 'reits').map(p => ({name: p.name, symbol: p.symbol, price: p.price})),
        commodities: MOCK_PORTFOLIO.filter(p => p.type === 'commodities').map(p => ({name: p.name, symbol: p.symbol, price: p.price})),
    };

    const handleBuyNft = (nft: typeof MOCK_NFT_COLLECTIONS[0]) => {
        buyNft(nft);
    }

    const handleInvestInDeFi = () => {
        if(!defiModal) return;
        const amount = parseFloat(defiAmount);
        if(isNaN(amount) || amount <= 0) {
            showToast("Please enter a valid amount.", "error");
            return;
        }
        const success = investInDeFi(defiModal, amount);
        if (success) {
            setDefiModal(null);
            setDefiAmount('');
        }
    }

    const handleOpenTradeModal = (asset: {name: string, symbol: string, price: number}, type: InvestmentType) => {
        setTradeModalDetails({
            action: 'buy',
            holding: { ...asset, type, icon: INVESTMENT_ICONS[type] || INVESTMENT_ICONS.stocks }
        })
    }

    const renderTabContent = () => {
        if (activeTab === 'defi' || activeTab === 'nft' || activeTab === 'mining') {
            // Handled separately below
        } else {
            const assets = popularAssets[activeTab];
            if (assets) {
                return (
                    <div>
                         <h2 className="text-2xl font-bold mb-2">Popular {tabs.find(t=>t.id === activeTab)?.label}</h2>
                         <p className="text-gray-600 mb-6">Select an asset to analyze or invest in directly.</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {assets.map(asset => {
                                const AssetIcon = INVESTMENT_ICONS[activeTab];
                                return(
                                    <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md hover:bg-white transition-all">
                                        <div className="flex items-center gap-3">
                                            <AssetIcon className="w-8 h-8 text-indigo-500" />
                                            <div>
                                                <p className="font-bold">{asset.name}</p>
                                                <p className="text-sm font-mono text-gray-500">{asset.symbol}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenTradeModal(asset, activeTab)} className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">Invest</button>
                                            <button onClick={() => onNavigateToAnalysis(activeTab, asset.symbol)} className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">Analyze</button>
                                        </div>
                                    </div>
                                )
                            })}
                         </div>
                    </div>
                )
            }
        }
        
        if (activeTab === 'defi') {
            return (
                <div>
                    <h2 className="text-2xl font-bold mb-2">DeFi Protocols</h2>
                    <p className="text-gray-600 mb-6">Invest directly into decentralized protocols to earn yield.</p>
                    <div className="space-y-4">
                        {MOCK_DEFI_PROTOCOLS.map(proto => (
                            <div key={proto.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <proto.icon className="w-10 h-10 text-indigo-500"/>
                                    <div>
                                        <p className="font-bold">{proto.name} ({proto.symbol})</p>
                                        <p className="text-sm text-gray-500">{proto.description}</p>
                                    </div>
                                </div>
                                <div className="text-center px-4">
                                    <p className="font-bold text-green-600">{proto.apr.toFixed(1)}% APR</p>
                                    <p className="text-xs text-gray-500">Yield</p>
                                </div>
                                <div className="text-center px-4">
                                    <p className="font-bold text-gray-700">${proto.tvl}B</p>
                                    <p className="text-xs text-gray-500">TVL</p>
                                </div>
                                <button onClick={() => setDefiModal(proto)} className="font-semibold bg-indigo-500 text-white px-6 py-2 rounded-lg">Invest</button>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
        
        if (activeTab === 'nft') {
            return (
                <div>
                    <h2 className="text-2xl font-bold mb-2">NFT Marketplace</h2>
                    <p className="text-gray-600 mb-6">Explore and collect unique digital art from various collections.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {MOCK_NFT_COLLECTIONS.map(nft => (
                            <div key={nft.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md group transition-all hover:shadow-xl hover:-translate-y-1">
                                <img src={nft.imageUrl} alt={nft.name} className="w-full h-48 object-cover"/>
                                <div className="p-4">
                                    <p className="font-bold truncate">{nft.name}</p>
                                    <p className="text-sm text-gray-500">{nft.collection}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Price</p>
                                            <p className="font-bold text-indigo-600">{nft.price} ETH</p>
                                        </div>
                                        <button onClick={() => handleBuyNft(nft)} className="text-xs font-semibold bg-indigo-500 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Buy</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        if (activeTab === 'mining') {
            return <Mining />;
        }

        return null;
    }

    return (
        <DashboardCard>
            <div className="flex border-b border-gray-200/80 mb-6 overflow-x-auto">
                {tabs.map(tab => (
                     <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-3 text-sm font-bold transition-colors duration-300 whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50/50 rounded-t-lg' : 'text-gray-500 hover:text-indigo-500'}`}
                     >{tab.label}</button>
                ))}
            </div>
            {renderTabContent()}

            <Modal isVisible={!!defiModal} onClose={() => setDefiModal(null)}>
                <h2 className="text-2xl font-bold">Invest in {defiModal?.name}</h2>
                <p className="text-gray-600 my-2">{defiModal?.description}</p>
                <div className="p-4 bg-gray-100 rounded-lg my-4 flex justify-around text-center">
                    <div>
                        <p className="text-xs text-gray-500">Est. APR</p>
                        <p className="text-xl font-bold text-green-600">{defiModal?.apr.toFixed(1)}%</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Total Value Locked</p>
                        <p className="text-xl font-bold">${defiModal?.tvl}B</p>
                    </div>
                </div>
                 <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Amount to Invest (USD)</label>
                    <input 
                        type="number"
                        value={defiAmount}
                        onChange={e => setDefiAmount(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="0.00"
                    />
                    <p className="text-sm text-gray-500 mt-1">Available: ${cashBalance.toFixed(2)}</p>
                </div>
                <button onClick={handleInvestInDeFi} className="w-full font-semibold bg-indigo-600 text-white py-3 rounded-lg">Confirm Investment</button>
            </Modal>
        </DashboardCard>
    );
};

export default Invest;
