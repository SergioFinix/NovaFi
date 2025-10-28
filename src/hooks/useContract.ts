import { useState } from 'react';
import { BrowserProvider, Contract, parseEther } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';

export function useContract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContract = async (needsSigner = false) => {
    try {
      const { modal } = await import('../lib/reown');
      const provider = modal.getWalletProvider();

      if (!provider) {
        throw new Error('No wallet connected');
      }

      const ethProvider = new BrowserProvider(provider as any);

      if (needsSigner) {
        const signer = await ethProvider.getSigner();
        return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      }

      return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ethProvider);
    } catch (err) {
      console.error('Error getting contract:', err);
      throw err;
    }
  };

  const createIntent = async (description: string) => {
    setLoading(true);
    setError(null);

    try {
      const contract = await getContract(true);
      const tx = await contract.createIntent(description);
      const receipt = await tx.wait();

      const event = receipt.logs
        .map((log: any) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e: any) => e?.name === 'IntentCreated');

      const intentId = event?.args?.intentId?.toString();

      setLoading(false);
      return { success: true, intentId, txHash: receipt.hash };
    } catch (err: any) {
      console.error('Error creating intent:', err);
      setError(err.message || 'Failed to create intent');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const createProposal = async (intentId: number, amount: string, message: string) => {
    setLoading(true);
    setError(null);

    try {
      const contract = await getContract(true);
      const tx = await contract.createProposal(intentId, parseEther(amount), message);
      const receipt = await tx.wait();

      const event = receipt.logs
        .map((log: any) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e: any) => e?.name === 'ProposalCreated');

      const proposalId = event?.args?.proposalId?.toString();

      setLoading(false);
      return { success: true, proposalId, txHash: receipt.hash };
    } catch (err: any) {
      console.error('Error creating proposal:', err);
      setError(err.message || 'Failed to create proposal');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const acceptProposal = async (proposalId: number, amount: string) => {
    setLoading(true);
    setError(null);

    try {
      const contract = await getContract(true);
      const tx = await contract.acceptProposal(proposalId, {
        value: parseEther(amount),
      });
      const receipt = await tx.wait();

      setLoading(false);
      return { success: true, txHash: receipt.hash };
    } catch (err: any) {
      console.error('Error accepting proposal:', err);
      setError(err.message || 'Failed to accept proposal');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const rejectProposal = async (proposalId: number) => {
    setLoading(true);
    setError(null);

    try {
      const contract = await getContract(true);
      const tx = await contract.rejectProposal(proposalId);
      await tx.wait();

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('Error rejecting proposal:', err);
      setError(err.message || 'Failed to reject proposal');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const cancelIntent = async (intentId: number) => {
    setLoading(true);
    setError(null);

    try {
      const contract = await getContract(true);
      const tx = await contract.cancelIntent(intentId);
      await tx.wait();

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('Error cancelling intent:', err);
      setError(err.message || 'Failed to cancel intent');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const getIntentBasicInfo = async (intentId: number) => {
    try {
      const contract = await getContract(false);
      const result = await contract.getIntentBasicInfo(intentId);
      return {
        id: result[0].toString(),
        creator: result[1],
        description: result[2],
        createdAt: Number(result[3]),
      };
    } catch (err) {
      console.error('Error getting intent info:', err);
      return null;
    }
  };

  const getIntentStatus = async (intentId: number) => {
    try {
      const contract = await getContract(false);
      const result = await contract.getIntentStatus(intentId);
      return {
        status: Number(result[0]),
        acceptedProposalId: result[1].toString(),
        proposalCount: Number(result[2]),
      };
    } catch (err) {
      console.error('Error getting intent status:', err);
      return null;
    }
  };

  const getIntentProposals = async (intentId: number) => {
    try {
      const contract = await getContract(false);
      const proposalIds = await contract.getIntentProposals(intentId);
      return proposalIds.map((id: any) => id.toString());
    } catch (err) {
      console.error('Error getting intent proposals:', err);
      return [];
    }
  };

  const getProposal = async (proposalId: number) => {
    try {
      const contract = await getContract(false);
      const result = await contract.getProposal(proposalId);
      return {
        id: result[0].toString(),
        intentId: result[1].toString(),
        solver: result[2],
        amount: result[3].toString(),
        message: result[4],
        createdAt: Number(result[5]),
        status: Number(result[6]),
      };
    } catch (err) {
      console.error('Error getting proposal:', err);
      return null;
    }
  };

  const getUserIntents = async (userAddress: string) => {
    try {
      const contract = await getContract(false);
      const intentIds = await contract.getUserIntents(userAddress);
      return intentIds.map((id: any) => id.toString());
    } catch (err) {
      console.error('Error getting user intents:', err);
      return [];
    }
  };

  const getCounters = async () => {
    try {
      const contract = await getContract(false);
      const result = await contract.getCounters();
      return {
        totalIntents: Number(result[0]),
        totalProposals: Number(result[1]),
      };
    } catch (err) {
      console.error('Error getting counters:', err);
      return { totalIntents: 0, totalProposals: 0 };
    }
  };

  const getAllIntents = async (limit = 50) => {
    try {
      const contract = await getContract(false);
      const { totalIntents } = await getCounters();

      if (totalIntents === 0) {
        return [];
      }

      const startId = Math.max(1, totalIntents - limit + 1);
      const intents = [];

      for (let i = totalIntents; i >= startId; i--) {
        try {
          const [basicInfo, statusInfo] = await Promise.all([
            contract.getIntentBasicInfo(i),
            contract.getIntentStatus(i)
          ]);

          intents.push({
            id: basicInfo[0].toString(),
            creator: basicInfo[1],
            description: basicInfo[2],
            createdAt: Number(basicInfo[3]),
            status: Number(statusInfo[0]),
            acceptedProposalId: statusInfo[1].toString(),
            proposalCount: Number(statusInfo[2]),
          });
        } catch (err) {
          console.error(`Error loading intent ${i}:`, err);
        }
      }

      return intents;
    } catch (err) {
      console.error('Error getting all intents:', err);
      return [];
    }
  };

  const getUserIntentsWithProposals = async (userAddress: string) => {
    try {
      const contract = await getContract(false);
      const intentIds = await contract.getUserIntents(userAddress);
      const intents = [];

      for (const id of intentIds) {
        try {
          const intentId = Number(id);
          const [basicInfo, statusInfo, proposalIds] = await Promise.all([
            contract.getIntentBasicInfo(intentId),
            contract.getIntentStatus(intentId),
            contract.getIntentProposals(intentId)
          ]);

          const proposals = [];
          for (const proposalId of proposalIds) {
            try {
              const proposal = await contract.getProposal(Number(proposalId));
              proposals.push({
                id: proposal[0].toString(),
                intentId: proposal[1].toString(),
                solver: proposal[2],
                amount: proposal[3].toString(),
                message: proposal[4],
                createdAt: Number(proposal[5]),
                status: Number(proposal[6]),
              });
            } catch (err) {
              console.error(`Error loading proposal ${proposalId}:`, err);
            }
          }

          intents.push({
            id: basicInfo[0].toString(),
            creator: basicInfo[1],
            description: basicInfo[2],
            createdAt: Number(basicInfo[3]),
            status: Number(statusInfo[0]),
            acceptedProposalId: statusInfo[1].toString(),
            proposalCount: Number(statusInfo[2]),
            proposals,
          });
        } catch (err) {
          console.error(`Error loading intent ${id}:`, err);
        }
      }

      return intents;
    } catch (err) {
      console.error('Error getting user intents with proposals:', err);
      return [];
    }
  };

  return {
    loading,
    error,
    createIntent,
    createProposal,
    acceptProposal,
    rejectProposal,
    cancelIntent,
    getIntentBasicInfo,
    getIntentStatus,
    getIntentProposals,
    getProposal,
    getUserIntents,
    getCounters,
    getAllIntents,
    getUserIntentsWithProposals,
  };
}
