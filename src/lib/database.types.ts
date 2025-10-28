export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          user_type: 'creator' | 'solver' | 'both'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          user_type?: 'creator' | 'solver' | 'both'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          user_type?: 'creator' | 'solver' | 'both'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      intents: {
        Row: {
          id: string
          creator_id: string
          description: string
          status: 'open' | 'accepted' | 'closed'
          created_at: string
          updated_at: string
          blockchain_id: string | null
          tx_hash: string | null
        }
        Insert: {
          id?: string
          creator_id: string
          description: string
          status?: 'open' | 'accepted' | 'closed'
          created_at?: string
          updated_at?: string
          blockchain_id?: string | null
          tx_hash?: string | null
        }
        Update: {
          id?: string
          creator_id?: string
          description?: string
          status?: 'open' | 'accepted' | 'closed'
          created_at?: string
          updated_at?: string
          blockchain_id?: string | null
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'intents_creator_id_fkey'
            columns: ['creator_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      proposals: {
        Row: {
          id: string
          intent_id: string
          solver_id: string
          amount: number
          message: string | null
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
          blockchain_id: string | null
          tx_hash: string | null
        }
        Insert: {
          id?: string
          intent_id: string
          solver_id: string
          amount: number
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
          blockchain_id?: string | null
          tx_hash?: string | null
        }
        Update: {
          id?: string
          intent_id?: string
          solver_id?: string
          amount?: number
          message?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
          blockchain_id?: string | null
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'proposals_intent_id_fkey'
            columns: ['intent_id']
            referencedRelation: 'intents'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'proposals_solver_id_fkey'
            columns: ['solver_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
