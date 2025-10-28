import { useState } from 'react';
import { Send } from 'lucide-react';
import { useContract } from '../hooks/useContract';

interface CreateIntentProps {
  onIntentCreated: () => void;
}

export function CreateIntent({ onIntentCreated }: CreateIntentProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createIntent } = useContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      console.log('Creating intent on blockchain...');
      const result = await createIntent(description.trim());
      console.log('Blockchain result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create intent on blockchain');
      }

      console.log('Intent created successfully on blockchain!');
      setDescription('');
      onIntentCreated();
    } catch (err: any) {
      console.error('Error creating intent:', err);
      setError(err.message || 'Failed to create intent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Intent</h2>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm mb-4">
        <p className="font-medium mb-1">💡 Blockchain Integration</p>
        <p>Your intent will be registered on the blockchain. Make sure your wallet is connected to receive proposals via smart contract.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your intention
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What would you like to accomplish? Be as detailed as possible..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={5}
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          {loading ? 'Creating...' : 'Send Intent'}
        </button>
      </form>
    </div>
  );
}
