
import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import { MOCK_STAKABLE_ASSETS } from '../constants';
import { usePlatform } from '../hooks/usePlatform';
import { StakableAsset, StakedAsset } from '../types';

const StakedPosition: React.FC<{ asset: StakedAsset; onUnstake: (asset: StakedAsset) => void }> = ({ asset, onUnstake }) => {
    const [timeRemaining, setTimeRemaining] = useState('');
    const [canUnstake, setCanUnstake] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const unlockDate = new Date(asset.unlockDate);
            const diff = unlockDate.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeRemaining('Ready to Unstake');
                setCanUnstake(true);
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                setCanUnstake(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [asset.unlockDate]);

    return (
         <div className="bg-white p-3 rounded-lg border flex justify-between items-center">
            <div>
                <p className="font-bold">{asset.symbol}</p>
                <p className="text-sm text-gray-500">Staked: {asset.quantity.toFixed(4)}</p>
                <p className="text-xs text-indigo-600 font-medium">Locked for {asset.lockupPeriodDays} days</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-green-600">{asset.apr}% APR</p>
                <p className="text-xs text-gray-500">{timeRemaining}</p>
            </div>
            <button 
                onClick={() => onUnstake(asset)} 
                disabled={!canUnstake}
                className="ml-4 px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
                Unstake
            </button>
        </div>
    )
}

const Mining: React.FC = () => {
    const { portfolio, stakedAssets, startStaking, endStaking, showToast } = usePlatform();
    const [selectedAsset, setSelectedAsset] = useState<StakableAsset | null>(MOCK_STAKABLE_ASSETS[0]);
    const [selectedLockup, setSelectedLockup] = useState<{days: number, apr: number} | null>(selectedAsset?.lockupOptions[0] || null);
    const [amount, setAmount] = useState('');

    const userOwnedAsset = portfolio.find(p => p.symbol === selectedAsset?.symbol);
    const availableToStake = userOwnedAsset?.quantity || 0;

    useEffect(() => {
        if(selectedAsset) {
            setSelectedLockup(selectedAsset.lockupOptions[0]);
        }
    }, [selectedAsset]);

    const handleStake = () => {
        const stakeAmount = parseFloat(amount);
        if(!selectedAsset || !userOwnedAsset || !selectedLockup || isNaN(stakeAmount) || stakeAmount <= 0) {
            showToast("Invalid selection, lock-up period, or amount.", "error");
            return;
        }

        const success = startStaking(userOwnedAsset, stakeAmount, selectedLockup);
        if(success) {
            showToast(`Successfully staked ${stakeAmount} ${selectedAsset.symbol}!`, "success");
            setAmount('');
        }
    }

    const handleUnstake = (asset: StakedAsset) => {
        endStaking(asset);
    }

    return (
        <>
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Proof-of-Stake (PoS) Mining</h2>
                <p className="text-gray-600">Secure the network and earn rewards by staking your assets. Your contribution adds to the platform's liquidity pool, strengthening the entire ecosystem.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">1. Choose Asset to Stake</label>
                        <div className="flex gap-2 flex-wrap">
                            {MOCK_STAKABLE_ASSETS.map(asset => {
                                 const AssetIcon = asset.icon;
                                 return (
                                    <button 
                                        key={asset.id} 
                                        onClick={() => setSelectedAsset(asset)}
                                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${selectedAsset?.id === asset.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}
                                    >
                                        <AssetIcon className="w-6 h-6"/>
                                        <span className="font-semibold">{asset.name}</span>
                                    </button>
                                 )
                            })}
                        </div>
                    </div>

                    {selectedAsset && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                             <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">2. Select Lock-up Period</label>
                                <div className="flex gap-2">
                                    {selectedAsset.lockupOptions.map(opt => (
                                        <button key={opt.days} onClick={() => setSelectedLockup(opt)}
                                            className={`p-3 rounded-lg border-2 text-center w-full ${selectedLockup?.days === opt.days ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}>
                                            <p className="font-bold">{opt.days} Days</p>
                                            <p className="text-sm text-green-600 font-bold">{opt.apr}% APR</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">3. Amount to Stake ({selectedAsset.symbol})</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <p className="text-sm text-gray-500 mt-1">Available to stake: {availableToStake.toFixed(4)} {selectedAsset.symbol}</p>
                            </div>
                            <button onClick={handleStake} disabled={!userOwnedAsset || availableToStake <= 0} className="w-full font-semibold bg-indigo-600 text-white py-3 rounded-lg disabled:bg-gray-400">
                                Stake Now
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Your Staked Positions</h2>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto">
                        {stakedAssets.length > 0 ? stakedAssets.map(asset => (
                           <StakedPosition key={asset.id} asset={asset} onUnstake={handleUnstake} />
                        )) : (
                            <p className="text-center text-gray-500 py-10">You have no active staking positions.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Mining;
