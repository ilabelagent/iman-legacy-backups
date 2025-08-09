
import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PlatformProvider } from './context/PlatformContext';
import { useAuth } from './hooks/useAuth';
import { Section, InvestmentType, InvestmentModel } from './types';
import Header from './components/Header';
import PriceTicker from './components/PriceTicker';
import Dashboard from './components/Dashboard';
import Trading from './components/Trading';
import Portfolio from './components/Portfolio';
import Banking from './components/Banking';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Modal from './components/Modal';
import Login from './components/Login';
import Register from './components/Register';
import PublicHome from './components/PublicHome';
import Invest from './components/Invest';
import { GiftIcon, Settings2Icon, RocketIcon, LeafIcon, Building2Icon, TrendingUpIcon, BitcoinIcon, GemIcon } from './components/icons';
import { usePlatform } from './hooks/usePlatform';
import Toast from './components/Toast';
import TradeModal from './components/TradeModal';

function AdminModelEditor({ model, onSave, onCancel }: { model: Partial<InvestmentModel> | null, onSave: (model: InvestmentModel | Omit<InvestmentModel, 'id'>) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState<Partial<InvestmentModel>>(model || { riskLevel: 'Medium', constituents: [], roi: { quarterly: 0, yearly: 0 } });

    const handleConstituentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const parsed = e.target.value.split(',').map(s => {
            const [symbol, weightStr] = s.split(':');
            const weight = parseFloat(weightStr);
            return { symbol: symbol?.trim().toUpperCase(), weight: isNaN(weight) ? 0 : weight };
        }).filter(c => c.symbol && c.weight > 0);
        setFormData(prev => ({ ...prev, constituents: parsed }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.constituents || formData.constituents.length === 0 || !formData.roi) {
            alert("Please fill all fields"); // Temporary, ideally use toast
            return;
        }
        onSave(formData as InvestmentModel | Omit<InvestmentModel, 'id'>);
    }
    
    const totalWeight = formData.constituents?.reduce((sum, c) => sum + c.weight, 0) || 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="font-bold text-lg">{model?.id ? 'Edit' : 'Create'} Investment Model</h3>
            <input type="text" placeholder="Model Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            <input type="text" placeholder="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            <select value={formData.riskLevel || 'Medium'} onChange={e => setFormData({ ...formData, riskLevel: e.target.value as any })} className="w-full px-3 py-2 border rounded-md bg-white">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>
            <div>
                 <textarea placeholder="Constituents (e.g., AAPL:0.5, BTC:0.5)"
                    defaultValue={formData.constituents?.map(c => `${c.symbol}:${c.weight}`).join(', ')}
                    onChange={handleConstituentsChange} rows={3} className="w-full px-3 py-2 border rounded-md" />
                 <p className={`text-xs text-right ${totalWeight !== 1 ? 'text-red-500' : 'text-green-600'}`}>Total Weight: {(totalWeight * 100).toFixed(0)}%</p>
            </div>
            <div className="flex gap-2">
                <input type="number" placeholder="Quarterly ROI %" value={formData.roi?.quarterly || ''} onChange={e => setFormData({ ...formData, roi: { ...(formData.roi!), quarterly: parseFloat(e.target.value) } })} className="w-full px-3 py-2 border rounded-md" />
                <input type="number" placeholder="Yearly ROI %" value={formData.roi?.yearly || ''} onChange={e => setFormData({ ...formData, roi: { ...(formData.roi!), yearly: parseFloat(e.target.value) } })} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="flex gap-2">
                <button type="button" onClick={onCancel} className="w-full font-semibold bg-gray-200 text-gray-800 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="w-full font-semibold bg-indigo-600 text-white py-2 rounded-lg">Save Model</button>
            </div>
        </form>
    );
}


function AdminPanelContent() {
    const { creditUserAccount, showToast, investmentModels, createInvestmentModel, updateInvestmentModel } = usePlatform();
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [userEmail, setUserEmail] = useState('demo@pinnaclepremiumexchange.com');
    const [editingModel, setEditingModel] = useState<Partial<InvestmentModel> | null>(null);

    const handleCredit = () => {
        const creditAmount = parseFloat(amount);
        if (isNaN(creditAmount) || creditAmount <= 0 || !reason || !userEmail) {
            showToast("Please fill in all fields with valid data.", "error");
            return;
        }
        creditUserAccount(creditAmount, reason, userEmail);
        setAmount('');
        setReason('');
    };

    const handleSaveModel = (model: InvestmentModel | Omit<InvestmentModel, 'id'>) => {
        const totalWeight = model.constituents?.reduce((sum, c) => sum + c.weight, 0);
        if (totalWeight && Math.abs(totalWeight - 1) > 0.001) {
            showToast("Total constituent weight must be exactly 1 (100%).", "error");
            return;
        }
        
        // This is a hack for the demo to assign an icon. A real app would have a selector.
        const modelWithIcon = {...model, icon: RocketIcon}
        
        if ('id' in modelWithIcon) {
            updateInvestmentModel(modelWithIcon as InvestmentModel);
        } else {
            createInvestmentModel(modelWithIcon);
        }
        setEditingModel(null);
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            
            {editingModel ? (
                <AdminModelEditor model={editingModel} onSave={handleSaveModel} onCancel={() => setEditingModel(null)} />
            ) : (
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="font-bold text-lg flex items-center gap-2"><GiftIcon /> Credit User Account</h3>
                        <p className="text-sm text-gray-600">Manually credit a user's platform balance for offline deposits (e.g., wire transfer).</p>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">User Email</label>
                            <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-gray-700">Credit Amount (USD)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="e.g., 1000" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Reason / Reference</label>
                            <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md" placeholder="e.g., Wire Transfer #12345" />
                        </div>
                        <button onClick={handleCredit} className="w-full mt-2 font-semibold bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Confirm Credit</button>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-lg">Manage Investment Models</h3>
                             <button onClick={() => setEditingModel({})} className="text-sm font-semibold bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">Create New</button>
                        </div>
                        <div className="space-y-2">
                            {investmentModels.map(model => (
                                <div key={model.id} className="flex items-center justify-between bg-white p-2 rounded-md border">
                                    <span>{model.title}</span>
                                    <button onClick={() => setEditingModel(model)} className="text-xs font-semibold text-indigo-600 hover:underline">Edit</button>
                                </div>
                            ))}
                        </div>
                    </div>

                     <div className="flex flex-col gap-3 mt-4">
                      <button className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 cursor-not-allowed">Manage Users (Soon)</button>
                      <button className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 cursor-not-allowed">View System Logs (Soon)</button>
                    </div>
                </div>
            )}
        </div>
    );
}


function AppContent() {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [modal, setModal] = useState<'login' | 'register' | 'admin' | null>(null);
  
  const [selectedAssetForAnalysis, setSelectedAssetForAnalysis] = useState<{investmentType: InvestmentType, symbol: string} | null>(null);
  const [activeInvestTab, setActiveInvestTab] = useState<InvestmentType>('stocks');

  const handleNavigate = (section: Section, tab?: InvestmentType) => {
      setActiveSection(section);
      if(section === 'invest' && tab) {
        setActiveInvestTab(tab);
      }
  }

  const handleSelectForAnalysis = useCallback((investmentType: InvestmentType, symbol: string) => {
    setSelectedAssetForAnalysis({ investmentType, symbol });
    setActiveSection('trading');
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'invest':
        return <Invest onNavigateToAnalysis={handleSelectForAnalysis} activeTab={activeInvestTab} setActiveTab={setActiveInvestTab}/>;
      case 'trading':
        return <Trading selectedAsset={selectedAssetForAnalysis} />;
      case 'portfolio':
        return <Portfolio onNavigateToAnalysis={handleSelectForAnalysis} />;
      case 'banking':
        return <Banking />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-5 py-5">
          <Header 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            onLogin={() => setModal('login')} 
            onRegister={() => setModal('register')} 
          />
          {currentUser && <PriceTicker /> }
          <main>
            {currentUser ? renderSection() : <PublicHome onLogin={() => setModal('login')} onRegister={() => setModal('register')} />}
          </main>
        </div>
      </div>

      <Footer />
      <Toast />
      <TradeModal />

      {currentUser?.role === 'admin' ? (
         <button onClick={() => setModal('admin')} className="fixed bottom-5 right-5 bg-yellow-400 text-gray-800 py-3 px-5 rounded-full shadow-lg hover:bg-yellow-500 transition-all duration-300 transform hover:-translate-y-1 z-50 flex items-center gap-2 font-semibold">
          <Settings2Icon/>
          Admin Panel
        </button>
      ) : (
        currentUser && <Chatbot />
      )}

      <Modal isVisible={modal === 'login'} onClose={() => setModal(null)}>
        <Login onSuccess={() => setModal(null)} />
      </Modal>

      <Modal isVisible={modal === 'register'} onClose={() => setModal(null)}>
        <Register onSuccess={() => { setModal('login'); }} />
      </Modal>
      
      <Modal isVisible={modal === 'admin'} onClose={() => setModal(null)}>
        <AdminPanelContent />
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlatformProvider>
        <AppContent />
      </PlatformProvider>
    </AuthProvider>
  );
}
