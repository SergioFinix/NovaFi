import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { useContract } from '../hooks/useContract';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  intentDescription: string;
  intentBlockchainId: string | null;
  onProposalCreated: () => void;
}

export function ProposalModal({
  isOpen,
  onClose,
  intentDescription,
  intentBlockchainId,
  onProposalCreated,
}: ProposalModalProps) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createProposal } = useContract();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!intentBlockchainId) {
      setError('Intent blockchain ID is required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('Creating proposal on blockchain...');
      console.log('Intent ID:', Number(intentBlockchainId));
      console.log('Amount:', amount);
      console.log('Message:', message);

      const result = await createProposal(
        Number(intentBlockchainId),
        amount,
        message.trim() || ''
      );

      console.log('Blockchain result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create proposal on blockchain');
      }

      console.log('Proposal created successfully on blockchain!');
      onProposalCreated();
      onClose();
      setAmount('');
      setMessage('');
    } catch (err: any) {
      console.error('Error creating proposal:', err);
      setError(err.message || 'Failed to create proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Make a Proposal</h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Intent:</p>
          <p className="text-gray-900">{intentDescription}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm mb-4">
          <p className="font-medium mb-1">Blockchain Proposal</p>
          <p>Your proposal will be created on the blockchain. Make sure your wallet is connected.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Amount (ETH)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your approach, timeline, or any other relevant details..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Send Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
