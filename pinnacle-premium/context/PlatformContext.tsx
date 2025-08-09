
import React, { createContext, useState, ReactNode } from 'react';
import { PlatformContextType, PortfolioHolding, Transaction, StakedAsset, BankAccount, InvestmentModel, InvestmentType, NftHolding, DeFiProtocol, ToastMessage, TradeModalDetails } from '../types';
import { MOCK_PORTFOLIO, MOCK_TRANSACTIONS, MOCK_BANK_ACCOUNTS, INVESTMENT_ICONS, MOCK_NFT_COLLECTIONS, MOCK_DEFI_PROTOCOLS, MOCK_STAKABLE_ASSETS } from '../constants';
import { getCategoryFromSymbol } from '../services/geminiService';
import { useInterval } from '../hooks/useInterval';
import { LeafIcon, RocketIcon } from '../components/icons';

export const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const initialInvestmentModels: InvestmentModel[] = [
    { id: 'model-1', title: 'Aggressive Growth', description: 'High-risk, high-reward portfolio focused on emerging tech and innovation.', riskLevel: 'High', constituents: [{symbol: 'NVDA', weight: 0.4}, {symbol: 'TSLA', weight: 0.3}, {symbol: 'COIN', weight: 0.2}, {symbol: 'BTC', weight: 0.1}], icon: RocketIcon, roi: { quarterly: 5.5, yearly: 22.0 } },
    { id: 'model-2', title: 'Sustainable Future', description: 'Invest in companies leading the charge in renewable energy and ethical practices.', riskLevel: 'Medium', constituents: [{symbol: 'NEE', weight: 0.3}, {symbol: 'ENPH', weight: 0.3}, {symbol: 'BEP', weight: 0.2}, {symbol: 'ICLN', weight: 0.2}], icon: LeafIcon, roi: { quarterly: 3.2, yearly: 13.5 } },
];

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>(MOCK_PORTFOLIO);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [cashBalance, setCashBalance] = useState<number>(10000);
  const [stakedAssets, setStakedAssets] = useState<StakedAsset[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [nfts, setNfts] = useState<NftHolding[]>([]);
  const [defiPositions, setDefiPositions] = useState<any[]>([]);
  const [investmentModels, setInvestmentModels] = useState<InvestmentModel[]>(initialInvestmentModels);
  
  const [toast, setToast] = useState<ToastMessage>(null);
  const [tradeModalDetails, setTradeModalDetails] = useState<TradeModalDetails>(null);

  useInterval(() => {
    setPortfolio(currentPortfolio => 
      currentPortfolio.map(holding => {
        const volatility = 0.02; 
        const drift = 0.0001; 
        const randomFactor = Math.random();
        let changePercent = (randomFactor - 0.5) * volatility + drift;
        const newPrice = holding.price * (1 + changePercent);
        return { ...holding, price: newPrice, value: newPrice * holding.quantity };
      })
    );
  }, 2000);

  useInterval(() => {
    if (stakedAssets.length > 0) {
        let totalReward = 0;
        stakedAssets.forEach(asset => {
            const portfolioAsset = portfolio.find(p => p.symbol === asset.symbol) || MOCK_STAKABLE_ASSETS.find(sa => sa.symbol === asset.symbol);
            const currentPrice = portfolioAsset?.price || 0;
            const reward = (asset.quantity * currentPrice * (asset.apr / 100)) / (365 * 24 * 60 * 6);
            totalReward += reward;
        });
        if (totalReward > 0.0001) {
            setCashBalance(prev => prev + totalReward);
            addTransaction('Staking Rewards', totalReward, 'staking-reward');
        }
    }
  }, 10000);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ id: Date.now(), message, type });
      setTimeout(() => setToast(null), 3000);
  };
  
  const addTransaction = (description: string, amount: number, type: Transaction['type']) => {
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description,
      amount,
      type,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const executeTrade = (symbol: string, name: string, quantity: number, price: number, type: 'buy' | 'sell', investmentType: InvestmentType, icon: React.FC<any>): boolean => {
    const cost = quantity * price;
    
    if (type === 'buy' && cost > cashBalance) {
        showToast("Insufficient funds to complete this purchase.", "error");
        return false;
    }
    
    const existingHolding = portfolio.find(h => h.symbol === symbol);
    if (type === 'sell' && (!existingHolding || existingHolding.quantity < quantity)) {
        showToast("Cannot sell more than you own.", "error");
        return false;
    }

    setPortfolio(prev => {
        if (type === 'buy') {
            if(existingHolding) {
                const newQuantity = existingHolding.quantity + quantity;
                const newCostBasis = existingHolding.costBasis + cost;
                return prev.map(h => h.symbol === symbol ? { ...h, quantity: newQuantity, costBasis: newCostBasis } : h);
            } else {
                return [...prev, { id: `p${Date.now()}`, symbol, name, quantity, price, value: cost, change24h_percent: (Math.random() - 0.5) * 5, type: investmentType, icon, costBasis: cost }];
            }
        } else { // sell
            const holdg = existingHolding!;
            const newQuantity = holdg.quantity - quantity;
            const costBasisReduction = (holdg.costBasis / holdg.quantity) * quantity;
            if (newQuantity < 0.00001) { 
                return prev.filter(h => h.symbol !== symbol);
            } else {
                return prev.map(h => h.symbol === symbol ? { ...h, quantity: newQuantity, costBasis: h.costBasis - costBasisReduction } : h);
            }
        }
    });

    const newBalance = type === 'buy' ? cashBalance - cost : cashBalance + cost;
    setCashBalance(newBalance);
    addTransaction(`${type === 'buy' ? 'Buy' : 'Sell'} ${quantity.toFixed(4)} ${symbol}`, type === 'buy' ? -cost : cost, type === 'buy' ? 'trade-buy' : 'trade-sell');
    return true;
  };

  const depositFunds = (amount: number, bankId: string) => {
    const bank = bankAccounts.find(b => b.id === bankId);
    setCashBalance(prev => prev + amount);
    addTransaction(`Deposit from ${bank?.name || 'Bank'}`, amount, 'deposit');
  };

  const withdrawFunds = (amount: number, bankId: string) => {
    if(amount > cashBalance){
        showToast("Withdrawal amount exceeds available balance.", "error");
        return;
    }
    const bank = bankAccounts.find(b => b.id === bankId);
    setCashBalance(prev => prev - amount);
    addTransaction(`Withdrawal to ${bank?.name || 'Bank'}`, -amount, 'withdrawal');
  };
  
  const creditUserAccount = (amount: number, reason: string, userEmail: string) => {
    setCashBalance(prev => prev + amount);
    addTransaction(`Admin Credit: ${reason} for ${userEmail}`, amount, 'admin-credit');
    showToast(`Successfully credited ${userEmail} with $${amount}.`, "success");
  }

  const addBankAccount = (account: BankAccount) => {
    setBankAccounts(prev => [...prev, account]);
    showToast(`Successfully connected ${account.name}`, "success");
  };

  const startStaking = (asset: PortfolioHolding, amount: number, lockupOption: {days: number, apr: number}): boolean => {
      if (asset.quantity < amount) {
          showToast("Cannot stake more than you own.", "error");
          return false;
      }
      
      const holdingCostBasisPerUnit = asset.costBasis / asset.quantity;
      const costBasisForStakedAmount = holdingCostBasisPerUnit * amount;

      setPortfolio(prev => {
          const newQuantity = asset.quantity - amount;
          if(newQuantity < 0.00001) {
              return prev.filter(p => p.id !== asset.id);
          }
          return prev.map(p => p.id === asset.id ? {...p, quantity: newQuantity, costBasis: p.costBasis - costBasisForStakedAmount} : p)
      });
      
      const now = new Date();
      const unlockDate = new Date(new Date().setDate(now.getDate() + lockupOption.days));
      
      const newStakedAsset: StakedAsset = {
          id: `s${Date.now()}`,
          assetId: asset.id,
          symbol: asset.symbol,
          quantity: amount,
          stakedDate: new Date().toISOString().split('T')[0],
          apr: lockupOption.apr,
          lockupPeriodDays: lockupOption.days,
          unlockDate: unlockDate.toISOString(),
          costBasis: costBasisForStakedAmount,
      };
      setStakedAssets(prev => [...prev, newStakedAsset]);
      addTransaction(`Stake ${amount} ${asset.symbol}`, amount * asset.price, 'stake-start');
      return true;
  };

  const endStaking = (stakedAsset: StakedAsset) => {
    const now = new Date();
    if(new Date(stakedAsset.unlockDate) > now) {
        showToast("This asset is still locked.", "error");
        return;
    }

    // Try to find asset info from either mock portfolio or stakable assets list
    const portfolioAssetInfo = MOCK_PORTFOLIO.find(p => p.symbol === stakedAsset.symbol);
    const stakableAssetInfo = MOCK_STAKABLE_ASSETS.find(p => p.symbol === stakedAsset.symbol);
    const assetInfo = portfolioAssetInfo || stakableAssetInfo;

    if (!assetInfo) {
        showToast(`Could not find asset information for ${stakedAsset.symbol}. Unstaking failed.`, "error");
        console.error("Could not find asset info for unstaking", stakedAsset.symbol);
        return;
    }

    setPortfolio(prevPortfolio => {
      const existingHolding = prevPortfolio.find(p => p.symbol === stakedAsset.symbol);
      if (existingHolding) {
          return prevPortfolio.map(p => p.symbol === stakedAsset.symbol ? { ...p, quantity: p.quantity + stakedAsset.quantity, costBasis: p.costBasis + stakedAsset.costBasis } : p);
      } else {
          // Recreate holding in portfolio
          const price = assetInfo.price;
          const newHolding: PortfolioHolding = {
              id: assetInfo.id,
              name: assetInfo.name,
              symbol: assetInfo.symbol,
              quantity: stakedAsset.quantity,
              price: price,
              value: stakedAsset.quantity * price,
              change24h_percent: portfolioAssetInfo?.change24h_percent || 0,
              type: portfolioAssetInfo?.type || getCategoryFromSymbol(assetInfo.symbol),
              icon: assetInfo.icon,
              costBasis: stakedAsset.costBasis,
          };
          return [...prevPortfolio, newHolding];
      }
    });
    
    setStakedAssets(prev => prev.filter(sa => sa.id !== stakedAsset.id));
    
    const latestPrice = portfolio.find(p=>p.symbol === stakedAsset.symbol)?.price ?? assetInfo.price;
    addTransaction(`Unstake ${stakedAsset.quantity} ${stakedAsset.symbol}`, stakedAsset.quantity * latestPrice, 'stake-end');
    showToast(`Successfully unstaked ${stakedAsset.quantity} ${stakedAsset.symbol}.`, "success");
  };
  
  const investInModel = (model: InvestmentModel, investmentAmount: number): boolean => {
      if (cashBalance < investmentAmount) {
          showToast("Insufficient funds to invest this amount.", "error");
          return false;
      }
      showToast(`Investing $${investmentAmount} into ${model.title}...`, "info");
      model.constituents.forEach(c => {
          const amountToInvest = investmentAmount * c.weight;
          const portfolioAsset = portfolio.find(p => p.symbol === c.symbol);
          const price = portfolioAsset?.price || 100;
          const quantity = amountToInvest / price;
          const type = getCategoryFromSymbol(c.symbol);
          const icon = portfolioAsset?.icon || INVESTMENT_ICONS[type];
          executeTrade(c.symbol, c.symbol, quantity, price, 'buy', type, icon);
      });
      return true;
  };

  const buyNft = (nft: {id: string, name: string, collection: string, imageUrl: string, price: number}) => {
    const ethPrice = portfolio.find(p => p.symbol === 'ETH')?.price || 3700;
    const costUsd = nft.price * ethPrice;
    if (costUsd > cashBalance) {
        showToast("Insufficient funds to purchase this NFT.", "error");
        return false;
    }
    setCashBalance(prev => prev - costUsd);
    const newNft: NftHolding = { ...nft, purchasePrice: nft.price };
    setNfts(prev => [...prev, newNft]);
    addTransaction(`Buy NFT: ${nft.name}`, -costUsd, 'nft-buy');
    showToast("NFT Purchase successful!", "success");
    return true;
  }
  
  const investInDeFi = (protocol: DeFiProtocol, amount: number) => {
    if (amount > cashBalance) {
        showToast("Insufficient funds to invest.", "error");
        return false;
    }
    setCashBalance(prev => prev - amount);
    const defiHolding: PortfolioHolding = {
        id: protocol.id,
        name: protocol.name,
        symbol: protocol.symbol,
        quantity: amount,
        price: 1,
        value: amount,
        change24h_percent: 0,
        type: 'defi',
        icon: protocol.icon,
        costBasis: amount,
    };
    setPortfolio(prev => [...prev, defiHolding]);
    addTransaction(`Invest in ${protocol.name}`, -amount, 'defi-invest');
    showToast(`Successfully invested in ${protocol.name}.`, "success");
    return true;
  }

  const createInvestmentModel = (model: Omit<InvestmentModel, 'id'>) => {
    const newModel = { ...model, id: `model-${Date.now()}` };
    setInvestmentModels(prev => [...prev, newModel]);
    showToast("Investment model created!", "success");
  }

  const updateInvestmentModel = (updatedModel: InvestmentModel) => {
    setInvestmentModels(prev => prev.map(m => m.id === updatedModel.id ? updatedModel : m));
    showToast("Investment model updated!", "success");
  }

  const value: PlatformContextType = {
    portfolio,
    transactions,
    cashBalance,
    stakedAssets,
    bankAccounts,
    nfts,
    defiPositions,
    investmentModels,
    executeTrade,
    depositFunds,
    withdrawFunds,
    startStaking,
    endStaking,
    addBankAccount,
    investInModel,
    buyNft,
    investInDeFi,
    creditUserAccount,
    toast,
    showToast,
    tradeModalDetails,
    setTradeModalDetails,
    createInvestmentModel,
    updateInvestmentModel,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};