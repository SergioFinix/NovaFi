import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { useContract } from '../hooks/useContract';
import { formatWalletAddress, formatBlockchainTimestamp } from '../lib/utils';
import { formatEther } from 'ethers';

interface Proposal {
  id: string;
  intentId: string;
  solver: string;
  amount: string;
  message: string;
  createdAt: number;
  status: number;
}

interface Intent {
  id: string;
  creator: string;
  description: string;
  createdAt: number;
  status: number;
  acceptedProposalId: string;
  proposalCount: number;
  proposals: Proposal[];
}

interface MyIntentsProps {
  refresh: number;
}

export function MyIntents({ refresh }: MyIntentsProps) {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { address } = useWeb3();
  const { acceptProposal, rejectProposal, getUserIntentsWithProposals } = useContract();

  useEffect(() => {
    if (address) {
      loadMyIntents();
    }
  }, [address, refresh]);

  const loadMyIntents = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const contractIntents = await getUserIntentsWithProposals(address);
      console.log('Loaded user intents from contract:', contractIntents);
      setIntents(contractIntents);
    } catch (err) {
      console.error('Error loading intents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposal: Proposal) => {
    setActionLoading(proposal.id);

    try {
      const amountInEth = formatEther(proposal.amount);
      const result = await acceptProposal(
        Number(proposal.id),
        amountInEth
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to accept proposal on blockchain');
      }

      alert('Proposal accepted successfully!');
      loadMyIntents();
    } catch (err: any) {
      console.error('Error accepting proposal:', err);
      alert(err.message || 'Failed to accept proposal');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectProposal = async (proposal: Proposal) => {
    setActionLoading(proposal.id);

    try {
      const result = await rejectProposal(Number(proposal.id));

      if (!result.success) {
        throw new Error(result.error || 'Failed to reject proposal on blockchain');
      }

      alert('Proposal rejected successfully!');
      loadMyIntents();
    } catch (err: any) {
      console.error('Error rejecting proposal:', err);
      alert(err.message || 'Failed to reject proposal');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return 'Open';
      case 1: return 'Completed';
      case 2: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getProposalStatusLabel = (status: number) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Accepted';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-pulse">Loading your intents...</div>
      </div>
    );
  }

  if (intents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        You haven't created any intents yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Intents</h2>
      {intents.map((intent) => (
        <div key={intent.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-gray-900 font-medium mb-2">{intent.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatBlockchainTimestamp(intent.createdAt)}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  intent.status === 0 ? 'bg-green-100 text-green-700' :
                  intent.status === 1 ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {getStatusLabel(intent.status)}
                </span>
              </div>
            </div>
          </div>

          {intent.proposals.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Proposals ({intent.proposals.length})
              </h4>
              <div className="space-y-3">
                {intent.proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 font-mono">
                          {formatWalletAddress(proposal.solver)}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {parseFloat(formatEther(proposal.amount)).toFixed(4)} ETH
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        proposal.status === 0 ? 'bg-yellow-100 text-yellow-700' :
                        proposal.status === 1 ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {getProposalStatusLabel(proposal.status)}
                      </span>
                    </div>

                    {proposal.message && (
                      <p className="text-sm text-gray-600 mb-3">{proposal.message}</p>
                    )}

                    {proposal.status === 0 && intent.status === 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptProposal(proposal)}
                          disabled={actionLoading === proposal.id}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {actionLoading === proposal.id ? 'Processing...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleRejectProposal(proposal)}
                          disabled={actionLoading === proposal.id}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-4 h-4" />
                          {actionLoading === proposal.id ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {intent.proposals.length === 0 && (
            <div className="mt-4 text-center text-sm text-gray-500 py-2">
              No proposals yet
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
