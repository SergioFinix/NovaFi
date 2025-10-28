import { IntentStatus } from './contract';

export function formatWalletAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function mapContractStatusToLabel(status: number): string {
  switch (status) {
    case IntentStatus.Open:
      return 'open';
    case IntentStatus.Completed:
      return 'completed';
    case IntentStatus.Cancelled:
      return 'cancelled';
    default:
      return 'unknown';
  }
}

export function formatBlockchainTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
