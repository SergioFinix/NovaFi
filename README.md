# NovaFi

A decentralized marketplace for intents and solutions built on blockchain technology. NovaFi connects creators who post intentions with solvers who propose solutions, all managed through smart contracts.

## Overview

NovaFi is a blockchain-based platform that enables users to:
- Create intents describing tasks, problems, or needs
- Browse available intents from other users
- Submit proposals to solve intents with custom amounts
- Accept or reject proposals through smart contract interactions
- Track all intents and proposals entirely on-chain

## Smart Contract

**Contract Address:** `0x9875a416E8C567938a19101Bb84001a27765C728`

All intents, proposals, and transactions are stored and executed on the blockchain through this smart contract. The contract manages:
- Intent creation and lifecycle
- Proposal submission and management
- Fund escrow and release
- Status tracking (Open, Completed, Cancelled)

## Features

### For Creators
- **Create Intents**: Post your needs or tasks with descriptions
- **Review Proposals**: View all proposals submitted by solvers
- **Accept/Reject**: Choose the best solution and manage proposals
- **Track Status**: Monitor your intents through their lifecycle

### For Solvers
- **Browse Intents**: Discover open intents from creators
- **Submit Proposals**: Propose solutions with ETH amounts
- **Add Context**: Include messages explaining your approach
- **Get Paid**: Receive payment when your proposal is accepted

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Web3 Integration**: Reown AppKit (formerly WalletConnect)
- **Blockchain Interaction**: ethers.js
- **Authentication**: Supabase Auth
- **Smart Contracts**: Ethereum-compatible networks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Web3 wallet (MetaMask, WalletConnect-compatible, etc.)
- ETH for gas fees

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd novafi
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_REOWN_PROJECT_ID=your_reown_project_id
```

4. Start the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## How It Works

### Creating an Intent

1. Connect your wallet
2. Navigate to "Create Intent" tab
3. Describe what you need
4. Submit transaction to create intent on blockchain
5. Your intent appears in the "Available Intents" list

### Making a Proposal

1. Browse available intents
2. Click on an intent you want to solve
3. Enter your proposed amount in ETH
4. Add an optional message
5. Submit transaction to create proposal on blockchain

### Managing Proposals

1. Go to "My Intents" tab
2. View all proposals for your intents
3. Review solver addresses, amounts, and messages
4. Accept a proposal to complete the intent
5. Funds are transferred to the solver automatically

## Smart Contract Details

**Network:** Ethereum-compatible (check your wallet network)

**Contract Address:** `0x9875a416E8C567938a19101Bb84001a27765C728`

### Intent States
- **0 (Open)**: Intent is active and accepting proposals
- **1 (Completed)**: Intent has been fulfilled
- **2 (Cancelled)**: Intent has been cancelled

### Proposal States
- **0 (Pending)**: Proposal awaiting creator's decision
- **1 (Accepted)**: Proposal has been accepted and paid
- **2 (Rejected)**: Proposal has been rejected

## Architecture

NovaFi operates as a fully decentralized application:

- **All data is on-chain**: Intents and proposals are stored in the smart contract
- **No centralized database**: The blockchain is the single source of truth
- **Wallet-based authentication**: Users are identified by their wallet addresses
- **Direct blockchain reads**: The UI queries the smart contract directly
- **Transaction-based writes**: All state changes happen through signed transactions

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

### Project Structure

```
src/
├── components/        # React components
│   ├── AuthModal.tsx
│   ├── CreateIntent.tsx
│   ├── IntentsList.tsx
│   ├── MyIntents.tsx
│   └── ProposalModal.tsx
├── contexts/          # React contexts
│   ├── AuthContext.tsx
│   └── Web3Context.tsx
├── hooks/             # Custom React hooks
│   └── useContract.ts
├── lib/               # Utilities and configuration
│   ├── contract.ts
│   ├── reown.ts
│   ├── supabase.ts
│   └── utils.ts
└── App.tsx            # Main application component
```

## Security Considerations

- Always verify transaction details before signing
- Only connect to trusted networks
- Keep your wallet private keys secure
- Double-check contract addresses
- Review proposal amounts carefully before accepting

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is open source and available under the MIT License.

## Support

For questions, issues, or feature requests, please open an issue on the repository.

---

**Smart Contract Address:** `0x9875a416E8C567938a19101Bb84001a27765C728`

Built with Web3 technology for a decentralized future.
