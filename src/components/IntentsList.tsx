import { useEffect, useState } from 'react';
import { Clock, User } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { formatWalletAddress, formatBlockchainTimestamp } from '../lib/utils';

interface Intent {
  id: string;
  creator: string;
  description: string;
  createdAt: number;
  status: number;
  acceptedProposalId: string;
  proposalCount: number;
}

interface IntentsListProps {
  onSelectIntent: (intent: Intent) => void;
  refresh: number;
}

export function IntentsList({ onSelectIntent, refresh }: IntentsListProps) {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllIntents } = useContract();

  useEffect(() => {
    loadIntents();
  }, [refresh]);

  const loadIntents = async () => {
    setLoading(true);
    try {
      const contractIntents = await getAllIntents(50);
      console.log('Loaded intents from contract:', contractIntents);
      setIntents(contractIntents);
    } catch (err) {
      console.error('Error loading intents:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-pulse">Loading intents...</div>
      </div>
    );
  }

  if (intents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        No open intents available. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Available Intents</h2>
      <div className="grid gap-4">
        {intents.map((intent) => {
          const statusLabel = intent.status === 0 ? 'Open' : intent.status === 1 ? 'Completed' : 'Cancelled';
          const statusColor = intent.status === 0 ? 'bg-green-100 text-green-800' : intent.status === 1 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';

          return (
            <div
              key={intent.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              onClick={() => {
                onSelectIntent({
                  id: intent.id,
                  creator: intent.creator,
                  description: intent.description,
                  createdAt: intent.createdAt,
                  status: intent.status,
                  acceptedProposalId: intent.acceptedProposalId,
                  proposalCount: intent.proposalCount
                });
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-mono">{formatWalletAddress(intent.creator)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>
                    {statusLabel}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatBlockchainTimestamp(intent.createdAt)}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-900 leading-relaxed mb-3">{intent.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{intent.proposalCount} proposal{intent.proposalCount !== 1 ? 's' : ''}</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Make Proposal →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
