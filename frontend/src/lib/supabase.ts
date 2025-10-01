import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (matching our Supabase schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar: string | null
          role: 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'USER'
          is_active: boolean
          is_verified: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar?: string | null
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'USER'
          is_active?: boolean
          is_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar?: string | null
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'USER'
          is_active?: boolean
          is_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          property_type: 'HOUSE' | 'APARTMENT' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'INDUSTRIAL' | 'OTHER'
          status: 'DRAFT' | 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED' | 'INACTIVE'
          address: string
          city: string
          province: string
          postal_code: string | null
          coordinates: any
          bedrooms: number | null
          bathrooms: number | null
          garages: number | null
          floor_size: number | null
          land_size: number | null
          year_built: number | null
          features: any
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          property_type: 'HOUSE' | 'APARTMENT' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'INDUSTRIAL' | 'OTHER'
          status?: 'DRAFT' | 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED' | 'INACTIVE'
          address: string
          city: string
          province: string
          postal_code?: string | null
          coordinates?: any
          bedrooms?: number | null
          bathrooms?: number | null
          garages?: number | null
          floor_size?: number | null
          land_size?: number | null
          year_built?: number | null
          features?: any
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          property_type?: 'HOUSE' | 'APARTMENT' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'INDUSTRIAL' | 'OTHER'
          status?: 'DRAFT' | 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED' | 'INACTIVE'
          address?: string
          city?: string
          province?: string
          postal_code?: string | null
          coordinates?: any
          bedrooms?: number | null
          bathrooms?: number | null
          garages?: number | null
          floor_size?: number | null
          land_size?: number | null
          year_built?: number | null
          features?: any
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          thumbnail: string | null
          data: any
          is_public: boolean
          tags: string[] | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          thumbnail?: string | null
          data: any
          is_public?: boolean
          tags?: string[] | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          thumbnail?: string | null
          data?: any
          is_public?: boolean
          tags?: string[] | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      credits: {
        Row: {
          id: string
          amount: number
          balance: number
          type: 'PURCHASE' | 'REFUND' | 'BONUS' | 'USAGE'
          description: string | null
          user_id: string
          transaction_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          amount: number
          balance?: number
          type: 'PURCHASE' | 'REFUND' | 'BONUS' | 'USAGE'
          description?: string | null
          user_id: string
          transaction_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          amount?: number
          balance?: number
          type?: 'PURCHASE' | 'REFUND' | 'BONUS' | 'USAGE'
          description?: string | null
          user_id?: string
          transaction_id?: string | null
          created_at?: string
        }
      }
      credit_packages: {
        Row: {
          id: string
          name: string
          description: string | null
          credits: number
          price: number
          currency: string
          is_active: boolean
          is_popular: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          credits: number
          price: number
          currency?: string
          is_active?: boolean
          is_popular?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          credits?: number
          price?: number
          currency?: string
          is_active?: boolean
          is_popular?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
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
      user_role: 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'USER'
      property_type: 'HOUSE' | 'APARTMENT' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'INDUSTRIAL' | 'OTHER'
      property_status: 'DRAFT' | 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED' | 'INACTIVE'
      credit_type: 'PURCHASE' | 'REFUND' | 'BONUS' | 'USAGE'
    }
  }
}