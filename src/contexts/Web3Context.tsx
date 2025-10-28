import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { BrowserProvider } from 'ethers';
import { supabase } from '../lib/supabase';

interface Web3ContextType {
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  loading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  userId: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const authenticatingRef = useRef(false);
  const authenticatedAddressRef = useRef<string | null>(null);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const { modal } = await import('../lib/reown');
      const state = modal.getState();

      if (state.open === false && state.selectedNetworkId) {
        const provider = modal.getWalletProvider();
        if (provider) {
          const ethProvider = new BrowserProvider(provider as any);
          const signer = await ethProvider.getSigner();
          const addr = await signer.getAddress();
          const network = await ethProvider.getNetwork();

          if (addr !== address) {
            setAddress(addr);
            setIsConnected(true);
            setChainId(Number(network.chainId));

            if (!authenticatingRef.current && authenticatedAddressRef.current !== addr) {
              handleWalletConnection(addr);
            }
          }
        }
      } else if (!state.selectedNetworkId && isConnected) {
        setAddress(undefined);
        setIsConnected(false);
        setChainId(undefined);
        setUserId(null);
        authenticatedAddressRef.current = null;
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Check connection error:', error);
    }
  };

  const handleWalletConnection = async (walletAddress: string) => {
    if (authenticatingRef.current) return;

    authenticatingRef.current = true;
    setLoading(true);

    try {
      const email = `${walletAddress.toLowerCase()}@wallet.novafi`;
      const password = walletAddress.toLowerCase();

      let authResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authResult.error) {
        if (authResult.error.message.includes('Invalid login credentials')) {
          const signUpResult = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                wallet_address: walletAddress,
                display_name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
              },
            },
          });

          if (signUpResult.error) {
            console.error('Sign up error:', signUpResult.error);
            throw signUpResult.error;
          }

          authResult = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authResult.error) throw authResult.error;
        } else {
          throw authResult.error;
        }
      }

      setUserId(authResult.data.user?.id || null);
      authenticatedAddressRef.current = walletAddress;
    } catch (error) {
      console.error('Wallet connection error:', error);
      await disconnectWallet();
    } finally {
      setLoading(false);
      authenticatingRef.current = false;
    }
  };

  const connectWallet = async () => {
    const { modal } = await import('../lib/reown');
    await modal.open();
  };

  const disconnectWallet = async () => {
    try {
      const { modal } = await import('../lib/reown');
      await modal.disconnect();
      setAddress(undefined);
      setIsConnected(false);
      setChainId(undefined);
      setUserId(null);
      authenticatedAddressRef.current = null;
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const value = {
    address,
    isConnected,
    chainId,
    loading,
    connectWallet,
    disconnectWallet,
    userId,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
