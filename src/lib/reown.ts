import { createAppKit } from '@reown/appkit';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { scroll, scrollSepolia } from '@reown/appkit/networks';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('VITE_REOWN_PROJECT_ID is not set in .env file');
}

const metadata = {
  name: 'NovaFi',
  description: 'Intent-based marketplace connecting creators with solvers',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [scroll, scrollSepolia],
  defaultNetwork: scrollSepolia,
  metadata,
  projectId,
  features: {
    analytics: false,
  },
  enableCoinbase: false,
});
