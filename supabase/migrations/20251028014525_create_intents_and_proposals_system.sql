/*
  # NovaFi - Intents and Solvers System

  ## Overview
  This migration creates the core database structure for NovaFi's intent-based marketplace
  where users can post intentions and solvers can make proposals to resolve them.

  ## New Tables
  
  ### 1. profiles
    - `id` (uuid, primary key) - Links to auth.users
    - `email` (text) - User email
    - `display_name` (text) - User's display name
    - `user_type` (text) - Either 'creator' or 'solver' or 'both'
    - `created_at` (timestamptz) - Account creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 2. intents
    - `id` (uuid, primary key) - Unique intent identifier
    - `creator_id` (uuid, foreign key) - References profiles(id)
    - `description` (text) - The intention description
    - `status` (text) - 'open', 'accepted', or 'closed'
    - `created_at` (timestamptz) - Intent creation time
    - `updated_at` (timestamptz) - Last update time

  ### 3. proposals
    - `id` (uuid, primary key) - Unique proposal identifier
    - `intent_id` (uuid, foreign key) - References intents(id)
    - `solver_id` (uuid, foreign key) - References profiles(id)
    - `amount` (numeric) - Proposed cost/amount
    - `message` (text) - Additional message from solver
    - `status` (text) - 'pending', 'accepted', or 'rejected'
    - `created_at` (timestamptz) - Proposal creation time
    - `updated_at` (timestamptz) - Last update time

  ## Security
    - Enable RLS on all tables
    - Profiles: Users can read all profiles, but only update their own
    - Intents: Anyone authenticated can read open intents, only creators can update their own
    - Proposals: Solvers can create proposals, intent creators can update proposal status
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text,
  user_type text DEFAULT 'both' CHECK (user_type IN ('creator', 'solver', 'both')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create intents table
CREATE TABLE IF NOT EXISTS intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id uuid NOT NULL REFERENCES intents(id) ON DELETE CASCADE,
  solver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount >= 0),
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_intents_creator_id ON intents(creator_id);
CREATE INDEX IF NOT EXISTS idx_intents_status ON intents(status);
CREATE INDEX IF NOT EXISTS idx_proposals_intent_id ON proposals(intent_id);
CREATE INDEX IF NOT EXISTS idx_proposals_solver_id ON proposals(solver_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for intents table
CREATE POLICY "Anyone authenticated can view open intents"
  ON intents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create intents"
  ON intents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Intent creators can update their own intents"
  ON intents FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- RLS Policies for proposals table
CREATE POLICY "Intent creators and proposal solvers can view proposals"
  ON proposals FOR SELECT
  TO authenticated
  USING (
    auth.uid() = solver_id OR 
    auth.uid() IN (
      SELECT creator_id FROM intents WHERE id = proposals.intent_id
    )
  );

CREATE POLICY "Authenticated users can create proposals"
  ON proposals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = solver_id);

CREATE POLICY "Intent creators can update proposal status"
  ON proposals FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT creator_id FROM intents WHERE id = proposals.intent_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT creator_id FROM intents WHERE id = proposals.intent_id
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intents_updated_at
  BEFORE UPDATE ON intents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();