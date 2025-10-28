/*
  # Add Blockchain Integration Fields
  
  ## Changes
  This migration adds blockchain-related fields to the intents and proposals tables
  to track on-chain transactions and IDs.
  
  ### Intents Table Updates
    - `blockchain_id` (text) - The intent ID from the smart contract
    - `tx_hash` (text) - Transaction hash when the intent was created on-chain
  
  ### Proposals Table Updates
    - `blockchain_id` (text) - The proposal ID from the smart contract
    - `tx_hash` (text) - Transaction hash when the proposal was created on-chain
*/

-- Add blockchain fields to intents table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'intents' AND column_name = 'blockchain_id'
  ) THEN
    ALTER TABLE intents ADD COLUMN blockchain_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'intents' AND column_name = 'tx_hash'
  ) THEN
    ALTER TABLE intents ADD COLUMN tx_hash text;
  END IF;
END $$;

-- Add blockchain fields to proposals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'proposals' AND column_name = 'blockchain_id'
  ) THEN
    ALTER TABLE proposals ADD COLUMN blockchain_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'proposals' AND column_name = 'tx_hash'
  ) THEN
    ALTER TABLE proposals ADD COLUMN tx_hash text;
  END IF;
END $$;

-- Create indexes for blockchain_id fields
CREATE INDEX IF NOT EXISTS idx_intents_blockchain_id ON intents(blockchain_id);
CREATE INDEX IF NOT EXISTS idx_proposals_blockchain_id ON proposals(blockchain_id);
