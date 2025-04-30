export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          company_size: string | null
          company_type: string | null
          created_at: string
          crunchbase_url: string | null
          description: string | null
          facebook_url: string | null
          founded_year: number | null
          headquarters: string | null
          id: string
          industry: string | null
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          name: string
          twitter_url: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          company_size?: string | null
          company_type?: string | null
          created_at?: string
          crunchbase_url?: string | null
          description?: string | null
          facebook_url?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name: string
          twitter_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_size?: string | null
          company_type?: string | null
          created_at?: string
          crunchbase_url?: string | null
          description?: string | null
          facebook_url?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string
          twitter_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_audits: {
        Row: {
          audit_date: string
          audit_status: string
          audit_type: string
          company_id: string
          created_at: string
          findings: string | null
          id: string
          recommendations: string | null
        }
        Insert: {
          audit_date: string
          audit_status: string
          audit_type: string
          company_id: string
          created_at?: string
          findings?: string | null
          id?: string
          recommendations?: string | null
        }
        Update: {
          audit_date?: string
          audit_status?: string
          audit_type?: string
          company_id?: string
          created_at?: string
          findings?: string | null
          id?: string
          recommendations?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_audits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_executives: {
        Row: {
          company_id: string
          created_at: string
          id: string
          linkedin_url: string | null
          name: string
          position: string
          profile_image: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name: string
          position: string
          profile_image?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name?: string
          position?: string
          profile_image?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_executives_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_financials: {
        Row: {
          company_id: string
          created_at: string
          employees: number | null
          funding_amount: number | null
          funding_stage: string | null
          id: string
          investors: string[] | null
          profit: number | null
          revenue: number | null
          year: number
        }
        Insert: {
          company_id: string
          created_at?: string
          employees?: number | null
          funding_amount?: number | null
          funding_stage?: string | null
          id?: string
          investors?: string[] | null
          profit?: number | null
          revenue?: number | null
          year: number
        }
        Update: {
          company_id?: string
          created_at?: string
          employees?: number | null
          funding_amount?: number | null
          funding_stage?: string | null
          id?: string
          investors?: string[] | null
          profit?: number | null
          revenue?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_financials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_locations: {
        Row: {
          address: string | null
          city: string | null
          company_id: string
          country: string | null
          created_at: string
          id: string
          is_headquarters: boolean | null
          postal_code: string | null
          state: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id: string
          country?: string | null
          created_at?: string
          id?: string
          is_headquarters?: boolean | null
          postal_code?: string | null
          state?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string
          country?: string | null
          created_at?: string
          id?: string
          is_headquarters?: boolean | null
          postal_code?: string | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_news: {
        Row: {
          company_id: string
          created_at: string
          id: string
          image_url: string | null
          published_date: string
          source: string | null
          summary: string | null
          title: string
          url: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          published_date: string
          source?: string | null
          summary?: string | null
          title: string
          url?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published_date?: string
          source?: string | null
          summary?: string | null
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_news_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_reviews: {
        Row: {
          author: string | null
          company_id: string
          content: string
          created_at: string
          id: string
          rating: number
          review_date: string
          source: string | null
          title: string | null
        }
        Insert: {
          author?: string | null
          company_id: string
          content: string
          created_at?: string
          id?: string
          rating: number
          review_date: string
          source?: string | null
          title?: string | null
        }
        Update: {
          author?: string | null
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          rating?: number
          review_date?: string
          source?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_subsidiaries: {
        Row: {
          acquisition_date: string | null
          acquisition_price: number | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          ownership_percentage: number | null
          subsidiary_name: string
          website: string | null
        }
        Insert: {
          acquisition_date?: string | null
          acquisition_price?: number | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          ownership_percentage?: number | null
          subsidiary_name: string
          website?: string | null
        }
        Update: {
          acquisition_date?: string | null
          acquisition_price?: number | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          ownership_percentage?: number | null
          subsidiary_name?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_subsidiaries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      databases: {
        Row: {
          category: string
          cloud_offering: boolean | null
          cons: string[] | null
          created_at: string
          description: string
          documentation_url: string | null
          features: string[] | null
          github_url: string | null
          id: string
          languages: string[] | null
          license: string
          logo_url: string | null
          name: string
          popularity: number | null
          pros: string[] | null
          self_hosted: boolean | null
          short_description: string | null
          slug: string
          stars: number | null
          type: string
          updated_at: string
          use_cases: string[] | null
          website_url: string | null
        }
        Insert: {
          category: string
          cloud_offering?: boolean | null
          cons?: string[] | null
          created_at?: string
          description: string
          documentation_url?: string | null
          features?: string[] | null
          github_url?: string | null
          id?: string
          languages?: string[] | null
          license: string
          logo_url?: string | null
          name: string
          popularity?: number | null
          pros?: string[] | null
          self_hosted?: boolean | null
          short_description?: string | null
          slug: string
          stars?: number | null
          type: string
          updated_at?: string
          use_cases?: string[] | null
          website_url?: string | null
        }
        Update: {
          category?: string
          cloud_offering?: boolean | null
          cons?: string[] | null
          created_at?: string
          description?: string
          documentation_url?: string | null
          features?: string[] | null
          github_url?: string | null
          id?: string
          languages?: string[] | null
          license?: string
          logo_url?: string | null
          name?: string
          popularity?: number | null
          pros?: string[] | null
          self_hosted?: boolean | null
          short_description?: string | null
          slug?: string
          stars?: number | null
          type?: string
          updated_at?: string
          use_cases?: string[] | null
          website_url?: string | null
        }
        Relationships: []
      }
      newsletter: {
        Row: {
          created_at: string
          email: string | null
          id: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
        }
        Relationships: []
      }
      nomore_newsletter: {
        Row: {
          created_at: string
          email: string | null
          id: number
          position: number | null
          total_count: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          position?: number | null
          total_count?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          position?: number | null
          total_count?: number | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          email: string | null
          id: number
          phone: string | null
          signup_date: string | null
          status: string | null
          zipcode: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          phone?: string | null
          signup_date?: string | null
          status?: string | null
          zipcode?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          phone?: string | null
          signup_date?: string | null
          status?: string | null
          zipcode?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
