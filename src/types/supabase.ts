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
      comments: {
        Row: {
          id: string
          database_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          database_id: string
          user_id?: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          database_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          database_id: string
          user_id: string
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          database_id: string
          user_id?: string
          rating: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          database_id?: string
          user_id?: string
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_submitted_use_cases: {
        Row: {
          id: string
          database_id: string
          user_id: string
          title: string
          description: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          database_id: string
          user_id?: string
          title: string
          description: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          database_id?: string
          user_id?: string
          title?: string
          description?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      databases: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          short_description: string | null
          logo_url: string | null
          website_url: string | null
          documentation_url: string | null
          github_url: string | null
          category: string
          type: string
          license: string
          cloud_offering: boolean | null
          self_hosted: boolean | null
          features: string[] | null
          use_cases: string[] | null
          languages: string[] | null
          pros: string[] | null
          cons: string[] | null
          created_at: string
          updated_at: string
          popularity: number | null
          stars: number | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          short_description?: string | null
          logo_url?: string | null
          website_url?: string | null
          documentation_url?: string | null
          github_url?: string | null
          category: string
          type: string
          license: string
          cloud_offering?: boolean | null
          self_hosted?: boolean | null
          features?: string[] | null
          use_cases?: string[] | null
          languages?: string[] | null
          pros?: string[] | null
          cons?: string[] | null
          created_at?: string
          updated_at?: string
          popularity?: number | null
          stars?: number | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          short_description?: string | null
          logo_url?: string | null
          website_url?: string | null
          documentation_url?: string | null
          github_url?: string | null
          category?: string
          type?: string
          license?: string
          cloud_offering?: boolean | null
          self_hosted?: boolean | null
          features?: string[] | null
          use_cases?: string[] | null
          languages?: string[] | null
          pros?: string[] | null
          cons?: string[] | null
          created_at?: string
          updated_at?: string
          popularity?: number | null
          stars?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 