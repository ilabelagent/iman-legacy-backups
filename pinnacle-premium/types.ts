
import { ReactNode } from "react";
import { IconProps } from "./components/icons";

export type Section = 'dashboard' | 'invest' | 'trading' | 'portfolio' | 'banking';

export interface User {
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, name: string, role: 'user' | 'admin') => void;
  logout: () => void;
}

export type InvestmentType = 'crypto' | 'stocks' | 'reits' | 'commodities' | 'defi' | 'nft' | 'mining';

export interface InvestmentOption {
  id: InvestmentType;
  title: string;
  description: string;
  detailedDescription?: ReactNode;
}

export type Sentiment = 'Bullish' | 'Neutral' | 'Bearish';

export interface PortfolioHolding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  price: number;
  value: number;
  change24h_percent: number;
  type: InvestmentType;
  icon: React.FC<IconProps>;
  sentiment?: Sentiment;
  costBasis: number;
}

export interface NftHolding {
    id: string;
    name: string;
    collection: string;
    imageUrl: string;
    purchasePrice: number;
}

export interface DeFiProtocol {
    id: string;
    name: string;
    symbol: string;
    description: string;
    tvl: number; // Total Value Locked
    apr: number;
    icon: React.FC<IconProps>;
}

export interface InvestmentModel {
  id: string;
  title: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  constituents: {symbol: string, weight: number}[];
  icon: React.FC<IconProps>;
  roi: {
    quarterly: number;
    yearly: number;
  };
}

export type TransactionType = 'deposit' | 'withdrawal' | 'trade-buy' | 'trade-sell' | 'stake-start' | 'stake-end' | 'staking-reward' | 'dividend' | 'admin-credit' | 'nft-buy' | 'defi-invest';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
}

export interface StakedAsset {
    id: string;
    assetId: string;
    symbol: string;
    quantity: number;
    stakedDate: string;
    apr: number;
    lockupPeriodDays: number;
    unlockDate: string;
    costBasis: number;
}

export interface StakableAsset {
    id: string;
    symbol: string;
    name: string;
    icon: React.FC<IconProps>;
    lockupOptions: {days: number, apr: number}[];
    price: number;
}

export interface BankAccount {
    id: string;
    name: string;
    last4: string;
    type: 'Checking' | 'Savings';
}

export type ToastMessage = {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
} | null;

export type TradeModalDetails = {
    action: 'buy' | 'sell';
    holding: PortfolioHolding | { symbol: string, name: string, price: number, type: InvestmentType, icon: React.FC<IconProps> };
} | null;

export interface PlatformContextType {
  portfolio: PortfolioHolding[];
  transactions: Transaction[];
  cashBalance: number;
  stakedAssets: StakedAsset[];
  bankAccounts: BankAccount[];
  nfts: NftHolding[];
  defiPositions: any[]; // Simplified for now
  investmentModels: InvestmentModel[];
  executeTrade: (symbol: string, name: string, quantity: number, price: number, type: 'buy' | 'sell', investmentType: InvestmentType, icon: React.FC<IconProps>) => boolean;
  depositFunds: (amount: number, bankId: string) => void;
  withdrawFunds: (amount: number, bankId: string) => void;
  startStaking: (asset: PortfolioHolding, amount: number, lockupOption: {days: number, apr: number}) => boolean;
  endStaking: (stakedAsset: StakedAsset) => void;
  addBankAccount: (account: BankAccount) => void;
  investInModel: (model: InvestmentModel, investmentAmount: number) => boolean;
  buyNft: (nft: {id: string, name: string, collection: string, imageUrl: string, price: number}) => boolean;
  investInDeFi: (protocol: DeFiProtocol, amount: number) => boolean;
  creditUserAccount: (amount: number, reason: string, userEmail: string) => void;
  toast: ToastMessage;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  tradeModalDetails: TradeModalDetails;
  setTradeModalDetails: React.Dispatch<React.SetStateAction<TradeModalDetails>>;
  createInvestmentModel: (model: Omit<InvestmentModel, 'id'>) => void;
  updateInvestmentModel: (model: InvestmentModel) => void;
}