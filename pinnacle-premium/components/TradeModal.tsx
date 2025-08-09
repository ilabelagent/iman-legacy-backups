
import React, { useState, useEffect } from 'react';
import { usePlatform } from '../hooks/usePlatform';
import Modal from './Modal';
import { PortfolioHolding } from '../types';

const TradeModal: React.FC = () => {
    const { tradeModalDetails, setTradeModalDetails, executeTrade, cashBalance, portfolio, showToast } = usePlatform();
    const [tradeAmount, setTradeAmount] = useState('1');

    useEffect(() => {
        if (tradeModalDetails) {
            setTradeAmount('1'); // Reset amount when modal opens
        }
    }, [tradeModalDetails]);

    if (!tradeModalDetails) return null;

    const { action, holding } = tradeModalDetails;
    const isPortfolioHolding = 'id' in holding;
    const userHoldings = isPortfolioHolding ? holding as PortfolioHolding : portfolio.find(h => h.symbol === holding.symbol);

    const handleTradeConfirm = () => {
        const quantity = parseFloat(tradeAmount);
        if (isNaN(quantity) || quantity <= 0) {
            showToast("Invalid quantity", "error");
            return;
        }

        const success = executeTrade(holding.symbol, holding.name, quantity, holding.price, action, holding.type, holding.icon);
        if (success) {
            showToast(`${action === 'buy' ? 'Bought' : 'Sold'} ${quantity} of ${holding.symbol}`, "success");
            setTradeModalDetails(null);
            setTradeAmount('1');
        }
    }

    const maxBuy = cashBalance / holding.price;
    const maxSell = userHoldings?.quantity || 0;

    return (
        <Modal isVisible={!!tradeModalDetails} onClose={() => setTradeModalDetails(null)}>
            <h2 className="text-2xl font-bold mb-4 capitalize">{action} {holding.symbol}</h2>
            <div className="mb-4 bg-gray-50 p-3 rounded-lg text-sm">
                <p>Current Price: ~${holding.price.toFixed(2)}</p>
                {action === 'buy' ? 
                    <p>Available to spend: ${cashBalance.toFixed(2)}</p> :
                    <p>You own: {userHoldings?.quantity?.toFixed(6) || 0} {holding.symbol}</p>
                }
            </div>
            <div className="mb-4">
                <label htmlFor="tradeAmount" className="block text-gray-700 font-semibold mb-2">Quantity</label>
                <div className="relative">
                    <input 
                        type="number" id="tradeAmount" value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        min="0.000001" step="any"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button onClick={() => setTradeAmount((action === 'buy' ? maxBuy : maxSell).toString())} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded">
                        MAX
                    </button>
                </div>
            </div>
            <p className="text-center font-semibold my-2">Total: ~${(holding.price * parseFloat(tradeAmount || '0')).toFixed(2)}</p>
            <button onClick={handleTradeConfirm} className={`w-full font-semibold text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 ${action === 'buy' ? 'bg-green-500 hover:shadow-green-500/50' : 'bg-red-500 hover:shadow-red-500/50'}`}>
                Confirm {action}
            </button>
        </Modal>
    );
}

export default TradeModal;
