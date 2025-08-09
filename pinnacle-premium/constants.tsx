
import React from 'react';
import { InvestmentOption, Section, InvestmentType, PortfolioHolding, Transaction, StakableAsset, BankAccount, DeFiProtocol } from './types';
import { BitcoinIcon, TrendingUpIcon, Building2Icon, GemIcon, NetworkIcon, PaletteIcon, MiningIcon } from './components/icons';
import type { IconProps } from './components/icons';

export const NAV_LINKS: { id: Section; label:string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'invest', label: 'Invest' },
  { id: 'trading', label: 'Analyze & Trade' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'banking', label: 'Banking' },
];

export const INVESTMENT_OPTIONS: InvestmentOption[] = [
  { 
    id: 'crypto', 
    title: 'Cryptocurrency', 
    description: 'Pioneer the future of decentralized finance. Steward the next generation of transparent, innovative digital value.',
    detailedDescription: (
      <>
        <h3 className="text-2xl font-bold text-indigo-600 mb-4">🌐 The New Digital Frontier</h3>
        <p className="mb-4 text-gray-700">Cryptocurrency represents a paradigm shift in how we perceive and interact with money. Built on blockchain technology, it offers a transparent, decentralized, and secure way to transact and store value, free from the control of any single entity. This is more than currency; it's a tool for economic empowerment and financial sovereignty.</p>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">Why It Matters:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Transparency:</strong> All transactions are recorded on a public ledger, fostering a new level of trust and accountability.</li>
          <li><strong>Stewardship:</strong> Investing in foundational cryptocurrencies is a way to support the infrastructure of a more equitable financial future.</li>
          <li><strong>Global Access:</strong> It provides financial services to the unbanked and empowers individuals in economies with unstable currencies.</li>
        </ul>
        <p className="mt-4 text-sm text-indigo-500 italic">"For where your treasure is, there your heart will be also." - Matthew 6:21. Invest in a future that reflects values of openness and integrity.</p>
      </>
    )
  },
  { 
    id: 'stocks', 
    title: 'Traditional Stocks', 
    description: 'Build a lasting legacy by investing in established, impactful companies. Champion businesses that align with your values and serve communities.',
    detailedDescription: (
       <>
        <h3 className="text-2xl font-bold text-indigo-600 mb-4">📈 Investing in Human Ingenuity</h3>
        <p className="mb-4 text-gray-700">Owning a stock means owning a piece of a company—a share in its vision, its challenges, and its triumphs. It is one of the most established ways to build long-term wealth by participating in the growth of the global economy. A discerning investor looks beyond the balance sheet to see the impact a company has on its community and the world.</p>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">A Values-Aligned Approach:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Ownership & Influence:</strong> As a shareholder, you have a voice in the company's direction, empowering you to advocate for ethical practices.</li>
          <li><strong>Legacy Building:</strong> Judicious stock investments can create generational wealth, providing a foundation for your family and philanthropic goals.</li>
          <li><strong>Economic Engine:</strong> Your capital fuels innovation, job creation, and the development of products and services that can solve real-world problems.</li>
        </ul>
        <p className="mt-4 text-sm text-indigo-500 italic">"A good man leaves an inheritance to his children’s children." - Proverbs 13:22. Choose companies that are building a better world for generations to come.</p>
      </>
    )
  },
  { 
    id: 'reits', 
    title: 'REITs', 
    description: 'Invest in the tangible foundations of our communities. Build your portfolio with real estate that provides homes, workplaces, and essential infrastructure.',
    detailedDescription: (
       <>
        <h3 className="text-2xl font-bold text-indigo-600 mb-4">🏗️ Building Foundations for Generations</h3>
        <p className="mb-4 text-gray-700">Real Estate Investment Trusts (REITs) allow you to invest in a portfolio of income-generating properties without having to buy or manage the real estate yourself. These are the tangible assets that form the backbone of our communities—from apartment buildings and hospitals to shopping centers and data centers.</p>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">The Merits of Tangible Investment:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Community Impact:</strong> Your investment directly supports the infrastructure that people rely on for living, working, and thriving.</li>
          <li><strong>Stable Income:</strong> REITs are required to pay out at least 90% of their taxable income as dividends, providing a potentially steady stream of income.</li>
          <li><strong>Inflation Hedge:</strong> Real estate values and rental income have historically tended to increase with inflation, helping to preserve the purchasing power of your wealth.</li>
        </ul>
        <p className="mt-4 text-sm text-indigo-500 italic">"By wisdom a house is built, and by understanding it is established." - Proverbs 24:3. Invest in the tangible assets that ground our communities.</p>
      </>
    )
  },
  { 
    id: 'commodities', 
    title: 'Commodities', 
    description: "Secure your wealth with the earth's foundational, God-given resources. Hedge against inflation with precious metals and ethically sourced goods.",
    detailedDescription: (
      <>
        <h3 className="text-2xl font-bold text-indigo-600 mb-4">🌍 Stewarding God-Given Resources</h3>
        <p className="mb-4 text-gray-700">Commodities are the raw materials that fuel the global economy—from precious metals like gold and silver to energy resources and agricultural products. They are the fundamental building blocks of industry and life. Investing in commodities can be a powerful way to diversify a portfolio and hedge against economic uncertainty and inflation.</p>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">The Wisdom of Raw Materials:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Store of Value:</strong> Precious metals like gold have been recognized as a reliable store of value for millennia, often performing well when other assets falter.</li>
          <li><strong>Inflation Protection:</strong> As the cost of goods and services rises, the price of the underlying commodities often rises as well, protecting your capital.</li>
          <li><strong>Ethical Sourcing:</strong> Our platform prioritizes ethically and sustainably sourced commodities, allowing you to invest with a clear conscience.</li>
        </ul>
        <p className="mt-4 text-sm text-indigo-500 italic">"The silver is mine, and the gold is mine, declares the Lord of hosts." - Haggai 2:8. Steward the foundational resources of the earth with wisdom.</p>
      </>
    )
  },
  { 
    id: 'defi', 
    title: 'DeFi Protocols', 
    description: 'Engage with a new, more equitable financial world. Support decentralized protocols designed for greater transparency and accessibility for all.',
    detailedDescription: (
       <>
        <h3 className="text-2xl font-bold text-indigo-600 mb-4">🤝 A More Equitable Financial System</h3>
        <p className="mb-4 text-gray-700">Decentralized Finance (DeFi) aims to rebuild the entire financial system on the principles of transparency, accessibility, and user control. Using smart contracts on blockchains, DeFi protocols offer services like lending, borrowing, and trading without traditional intermediaries like banks. It's finance by the people, for the people.</p>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">The Promise of Open Finance:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Financial Inclusion:</strong> DeFi opens up access to financial tools for anyone with an internet connection, breaking down barriers for the underserved.</li>
          <li><strong>Transparency and Efficiency:</strong> Operations are governed by code that is often open and verifiable, reducing the potential for corruption and inefficiency.</li>
          <li><strong>User Sovereignty:</strong> You remain in control of your assets, interacting directly with protocols without ceding custody to a third party.</li>
        </ul>
        <p className="mt-4 text-sm text-indigo-500 italic">"He has brought down the mighty from their thrones and exalted those of humble estate." - Luke 1:52. Participate in a movement that seeks to level the financial playing field.</p>
      </>
    )
  },
  { 
    id: 'nft', 
    title: 'NFT Marketplace', 
    description: 'Empower creators and invest in unique digital art. Steward a new generation of collectibles that champion beauty, truth, and innovation.',
    detailedDescription: (
       <>
        <h3 className="text-2xl font-bold text-indigo-600 mb-4">🎨 Championing Truth and Beauty</h3>
        <p className="mb-4 text-gray-700">Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of a specific item or piece of content, such as art, music, or collectibles. They provide a way to verify authenticity and ownership on the blockchain, creating new economies for creators and collectors alike. It's a powerful tool to support artists directly and invest in culture.</p>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">The Value of Digital Creation:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Empowering Creators:</strong> NFTs can be programmed to ensure artists receive royalties from secondary sales, providing them with a sustainable income stream.</li>
          <li><strong>Provable Scarcity:</strong> Ownership is transparently recorded on the blockchain, making digital items verifiably rare and collectible.</li>
          <li><strong>Cultural Stewardship:</strong> By collecting NFTs, you are curating and preserving culture, supporting works that reflect values of beauty, truth, and goodness.</li>
        </ul>
        <p className="mt-4 text-sm text-indigo-500 italic">"Finally, brothers, whatever is true, whatever is honorable... if there is any excellence... think about these things." - Philippians 4:8. Invest in and promote creativity that inspires.</p>
      </>
    )
  },
  { 
    id: 'mining', 
    title: 'Crypto Mining', 
    description: 'Actively secure networks via eco-friendly Proof-of-Stake, turning participation into rewards.',
    detailedDescription: (
       <>
        <h3 className="text-2xl font-bold text-indigo-600 mb-4">⛏️ Building and Securing the Digital Ledger</h3>
        <p className="mb-4 text-gray-700">Crypto mining is the engine of many blockchains, a process where participants contribute to a network's security and transaction validation. This is not passive investment; it is active participation in the digital economy's infrastructure, for which contributors are rewarded.</p>
        
        <h4 className="text-xl font-semibold text-gray-800 mb-2">Two Paths of Participation:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h5 className="font-bold mb-2">Proof-of-Work (PoW)</h5>
            <p className="text-sm text-gray-600">The original consensus mechanism, used by Bitcoin. Miners use powerful computers to solve complex mathematical problems. While incredibly secure, it is energy-intensive, representing a significant trade-off between security and environmental stewardship.</p>
          </div>
          <div className="p-4 border-2 border-indigo-500 rounded-lg bg-indigo-50">
            <h5 className="font-bold mb-2 text-indigo-700">Proof-of-Stake (PoS) - The Steward's Choice</h5>
            <p className="text-sm text-gray-600">An innovative and energy-efficient evolution. Instead of computational power, participants "stake" their own assets as collateral to validate transactions. This is our prioritized approach.</p>
          </div>
        </div>

        <h4 className="text-xl font-semibold text-gray-800 mb-2">Why We Champion Proof-of-Stake:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Creation Care:</strong> PoS is vastly more energy-efficient, aligning with a conviction to be good stewards of the resources we've been given.</li>
          <li><strong>Greater Accessibility:</strong> It removes the need for expensive, specialized hardware, opening the door for more people to participate and earn rewards.</li>
          <li><strong>Compounding Growth:</strong> Staking your assets generates rewards, creating a powerful opportunity for your wealth to grow through service to the network.</li>
        </ul>
        <p className="mt-4 text-sm text-indigo-500 italic">"The hand of the diligent makes rich." - Proverbs 10:4. Engage actively and wisely in building the new digital economy.</p>
      </>
    )
  },
];

export const INVESTMENT_ICONS: { [key in InvestmentType]: React.FC<IconProps> } = {
  crypto: BitcoinIcon,
  stocks: TrendingUpIcon,
  reits: Building2Icon,
  commodities: GemIcon,
  defi: NetworkIcon,
  nft: PaletteIcon,
  mining: MiningIcon,
};

export const MOCK_PORTFOLIO: PortfolioHolding[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', quantity: 0.5, price: 63000, value: 31500, change24h_percent: 2.5, type: 'crypto', icon: BitcoinIcon, costBasis: 30000 },
  { id: '2', name: 'NVIDIA Corp', symbol: 'NVDA', quantity: 15, price: 880, value: 13200, change24h_percent: -1.2, type: 'stocks', icon: TrendingUpIcon, costBasis: 13500 },
  { id: '3', name: 'Realty Income', symbol: 'O', quantity: 100, price: 52, value: 5200, change24h_percent: 0.8, type: 'reits', icon: Building2Icon, costBasis: 5000 },
  { id: '4', name: 'Ethereum', symbol: 'ETH', quantity: 3, price: 3700, value: 11100, change24h_percent: 5.1, type: 'crypto', icon: BitcoinIcon, costBasis: 10000 },
  { id: '5', name: 'Gold Spot', symbol: 'XAU', quantity: 5, price: 2340, value: 11700, change24h_percent: 0.3, type: 'commodities', icon: GemIcon, costBasis: 11500 },
  { id: '6', name: 'Tesla', symbol: 'TSLA', quantity: 2, price: 180, value: 360, change24h_percent: 1.3, type: 'stocks', icon: TrendingUpIcon, costBasis: 400 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', date: '2024-05-20', description: 'Deposit from Bank Account', amount: 50000, type: 'deposit' },
    { id: 't2', date: '2024-05-20', description: 'Buy NVDA Stock', amount: -13500, type: 'trade-buy' },
    { id: 't3', date: '2024-05-18', description: 'Sell AAPL Stock', amount: 2300, type: 'trade-sell' },
    { id: 't4', date: '2024-05-17', description: 'Withdrawal to Bank Account', amount: -5000, type: 'withdrawal' },
    { id: 't5', date: '2024-05-15', description: 'Buy BTC', amount: -34000, type: 'trade-buy' },
];

export const MOCK_STAKABLE_ASSETS: StakableAsset[] = [
    { id: 's1', symbol: 'ETH', name: 'Ethereum', icon: BitcoinIcon, lockupOptions: [{days: 30, apr: 4.0}, {days: 90, apr: 4.5}, {days: 180, apr: 5.2}], price: 3700 },
    { id: 's2', symbol: 'SOL', name: 'Solana', icon: BitcoinIcon, lockupOptions: [{days: 30, apr: 6.5}, {days: 90, apr: 7.2}, {days: 180, apr: 8.0}], price: 170 },
    { id: 's3', symbol: 'ADA', name: 'Cardano', icon: BitcoinIcon, lockupOptions: [{days: 30, apr: 3.2}, {days: 90, apr: 3.8}, {days: 180, apr: 4.5}], price: 0.45 },
    { id: 's4', symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: BitcoinIcon, lockupOptions: [{days: 30, apr: 1.8}, {days: 90, apr: 2.1}, {days: 180, apr: 2.5}], price: 63000 },
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  { id: 'b1', name: 'Kingdom Trust Bank', last4: '1234', type: 'Checking' },
  { id: 'b2', name: 'Stewardship Financial', last4: '5678', type: 'Savings' },
];

export const MOCK_DEFI_PROTOCOLS: DeFiProtocol[] = [
    { id: 'd1', name: 'Aave', symbol: 'AAVE', description: 'A decentralized non-custodial liquidity protocol.', tvl: 11.2, apr: 3.5, icon: NetworkIcon },
    { id: 'd2', name: 'Lido', symbol: 'LDO', description: 'Liquid staking solution for Ethereum and other PoS chains.', tvl: 29.8, apr: 4.2, icon: NetworkIcon },
    { id: 'd3', name: 'Uniswap', symbol: 'UNI', description: 'A decentralized exchange (DEX) that facilitates automated transactions.', tvl: 7.8, apr: 0.3, icon: NetworkIcon },
];

export const MOCK_NFT_COLLECTIONS: {id: string, name: string, collection: string, imageUrl: string, price: number}[] = [
    {id: 'nft1', name: 'Ether Automaton #302', collection: 'Ether Automata', imageUrl: 'https://images.unsplash.com/photo-1678644837330-22c62333ab16?q=80&w=600', price: 1.5},
    {id: 'nft2', name: 'Chrono-Shard #88', collection: 'Chrono-Shards', imageUrl: 'https://images.unsplash.com/photo-1673893699144-885dba45c21f?q=80&w=600', price: 0.8},
    {id: 'nft3', name: 'Pixel Patriot #1776', collection: 'Pixel Patriots', imageUrl: 'https://images.unsplash.com/photo-1676056242358-e48d374465a3?q=80&w=600', price: 2.1},
    {id: 'nft4', name: 'Geometria #42', collection: 'Geometria', imageUrl: 'https://images.unsplash.com/photo-1679083216882-d25a07c392a8?q=80&w=600', price: 5.5},
];