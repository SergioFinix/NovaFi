import { useState } from 'react';
import { Lightbulb, LogOut, Wallet } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Web3Provider, useWeb3 } from './contexts/Web3Context';
import { CreateIntent } from './components/CreateIntent';
import { IntentsList } from './components/IntentsList';
import { ProposalModal } from './components/ProposalModal';
import { MyIntents } from './components/MyIntents';

function AppContent() {
  const { loading: authLoading } = useAuth();
  const { address, isConnected, connectWallet, disconnectWallet, loading: web3Loading } = useWeb3();
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'browse' | 'my-intents'>('browse');
  const [refreshIntents, setRefreshIntents] = useState(0);

  const handleSelectIntent = (intent: any) => {
    setSelectedIntent(intent);
    setShowProposalModal(true);
  };

  const handleIntentCreated = () => {
    setRefreshIntents(prev => prev + 1);
    setActiveTab('my-intents');
  };

  const handleProposalCreated = () => {
    setRefreshIntents(prev => prev + 1);
  };

  if (authLoading || web3Loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">NovaFi</h1>
            </div>

            <div className="flex items-center gap-4">
              {isConnected && address ? (
                <>
                  <span className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded-lg">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={connectWallet}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Lightbulb className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to NovaFi
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Connect intention creators with expert solvers. Post what you need done,
              or help others by making proposals to solve their intents.
            </p>
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet to Start
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-6 bg-white rounded-lg shadow-md p-2">
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'browse'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Browse Intents
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'create'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Create Intent
              </button>
              <button
                onClick={() => setActiveTab('my-intents')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'my-intents'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Intents
              </button>
            </div>

            {activeTab === 'create' && <CreateIntent onIntentCreated={handleIntentCreated} />}
            {activeTab === 'browse' && (
              <IntentsList onSelectIntent={handleSelectIntent} refresh={refreshIntents} />
            )}
            {activeTab === 'my-intents' && <MyIntents refresh={refreshIntents} />}
          </>
        )}
      </main>


      {selectedIntent && (
        <ProposalModal
          isOpen={showProposalModal}
          onClose={() => {
            setShowProposalModal(false);
            setSelectedIntent(null);
          }}
          intentDescription={selectedIntent.description}
          intentBlockchainId={selectedIntent.id}
          onProposalCreated={handleProposalCreated}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <AppContent />
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
