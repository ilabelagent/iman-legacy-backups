
import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { LandmarkIcon, DollarSignIcon, ArrowUpFromLineIcon, ArrowDownToLineIcon, BitcoinIcon, TrendingUpIcon, WalletIcon, GiftIcon } from './icons';
import StatItem from './StatItem';
import { Transaction, BankAccount } from '../types';
import { usePlatform } from '../hooks/usePlatform';
import Modal from './Modal';

const Banking: React.FC = () => {
    const { cashBalance, transactions, bankAccounts, depositFunds, withdrawFunds, addBankAccount, showToast } = usePlatform();
    const [modal, setModal] = useState<'deposit' | 'withdraw' | 'connect' | null>(null);
    const [amount, setAmount] = useState(0);
    const [selectedBank, setSelectedBank] = useState(bankAccounts[0]?.id || '');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    const handleDeposit = () => {
        if(amount <= 0 || !selectedBank) {
            showToast("Please enter a valid amount and select a bank account.", "error");
            return;
        }
        depositFunds(amount, selectedBank);
        showToast(`Successfully deposited ${formatCurrency(amount)}`, "success");
        setModal(null);
        setAmount(0);
    }
    
    const handleWithdraw = () => {
        if(amount <= 0 || !selectedBank) {
            showToast("Please enter a valid amount and select a bank account.", "error");
            return;
        }
        if(amount > cashBalance) {
            showToast("Withdrawal amount exceeds available balance.", "error");
            return;
        }
        withdrawFunds(amount, selectedBank);
        showToast(`Successfully withdrew ${formatCurrency(amount)}`, "success");
        setModal(null);
        setAmount(0);
    }
    
    const handleConnectBank = () => {
        // This is a simulation
        const newAccount: BankAccount = { id: `b${Date.now()}`, name: 'New Connected Bank', last4: '9876', type: 'Checking' };
        addBankAccount(newAccount);
        setModal(null);
    }

    const getTransactionIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'deposit': return <ArrowDownToLineIcon className="text-green-500" />;
            case 'withdrawal': return <ArrowUpFromLineIcon className="text-red-500" />;
            case 'stake-start': return <WalletIcon className="text-purple-500" />;
            case 'stake-end': return <WalletIcon className="text-gray-500" />;
            case 'staking-reward': return <DollarSignIcon className="text-yellow-500" />;
            case 'admin-credit': return <GiftIcon className="text-blue-500" />;
            case 'trade-buy': return <TrendingUpIcon className="text-blue-500" />;
            case 'trade-sell': return <TrendingUpIcon className="text-red-500" />;
            default: return <DollarSignIcon className="text-gray-500" />;
        }
    }

    return (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <DashboardCard>
                    <div className="flex items-center gap-3 mb-4">
                        <LandmarkIcon className="w-8 h-8 text-purple-500" />
                        <h2 className="text-2xl font-bold text-gray-800">Full Transaction History</h2>
                    </div>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {transactions.length > 0 ? transactions.map(tx => {
                            const isCredit = ['deposit', 'trade-sell', 'staking-reward', 'admin-credit', 'defi-invest'].includes(tx.type);
                            const icon = getTransactionIcon(tx.type);
                            return (
                                <div key={tx.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-200 rounded-full">{icon}</div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{tx.description}</p>
                                            <p className="text-sm text-gray-500">{tx.date}</p>
                                        </div>
                                    </div>
                                    <p className={`font-bold text-lg ${isCredit ? 'text-green-600' : 'text-gray-800'}`}>
                                        {isCredit ? '+' : ''}{formatCurrency(tx.amount)}
                                    </p>
                                </div>
                            )
                        }) : <p className="text-center text-gray-500 py-8">No transactions yet.</p>}
                    </div>
                </DashboardCard>
            </div>
            <div className="lg:col-span-1">
                 <DashboardCard>
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSignIcon className="w-8 h-8 text-green-500" />
                        <h2 className="text-2xl font-bold text-gray-800">Platform Balance</h2>
                    </div>
                    <div className="text-center p-4 bg-indigo-50/50 rounded-xl mb-6">
                        <div className="text-4xl font-bold text-indigo-600 mb-1">{formatCurrency(cashBalance)}</div>
                        <div className="text-sm text-gray-500 font-medium">Available to Trade & Withdraw</div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button onClick={() => setModal('deposit')} className="w-full flex items-center justify-center gap-2 font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:-translate-y-0.5">
                            <ArrowDownToLineIcon className="w-5 h-5" />
                            Deposit Funds
                        </button>
                        <button onClick={() => setModal('withdraw')} className="w-full flex items-center justify-center gap-2 font-semibold bg-transparent border-2 border-gray-500 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-500 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5">
                            <ArrowUpFromLineIcon className="w-5 h-5" />
                            Withdraw Funds
                        </button>
                        <button onClick={() => setModal('connect')} className="w-full text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Connect another bank</button>
                    </div>
                </DashboardCard>
            </div>
        </div>

        <Modal isVisible={!!modal} onClose={() => setModal(null)}>
            {modal === 'deposit' && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Deposit Funds</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Amount (USD)</label>
                        <input type="number" value={amount || ''} onChange={e => setAmount(parseFloat(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">From</label>
                        <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                           {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name} (...{b.last4})</option>)}
                        </select>
                    </div>
                    <button onClick={handleDeposit} className="w-full font-semibold bg-green-500 text-white px-6 py-3 rounded-xl">Confirm Deposit</button>
                </div>
            )}
            {modal === 'withdraw' && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Withdraw Funds</h2>
                     <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Amount (USD)</label>
                        <input type="number" value={amount || ''} onChange={e => setAmount(parseFloat(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">To</label>
                        <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                           {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name} (...{b.last4})</option>)}
                        </select>
                    </div>
                    <button onClick={handleWithdraw} className="w-full font-semibold bg-indigo-500 text-white px-6 py-3 rounded-xl">Confirm Withdrawal</button>
                </div>
            )}
            {modal === 'connect' && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Connect Bank Account</h2>
                    <p className="text-gray-600 mb-6">This is a simulation. In a real app, this would use a service like Plaid to securely connect your bank account.</p>
                    <button onClick={handleConnectBank} className="w-full font-semibold bg-indigo-500 text-white px-6 py-3 rounded-xl">Connect (Simulate)</button>
                </div>
            )}
        </Modal>
        </>
    );
};

export default Banking;
