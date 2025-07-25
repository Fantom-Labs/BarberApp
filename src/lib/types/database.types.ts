/**
 * Tipos para o Supabase
 * 
 * Este arquivo define os tipos para as tabelas do Supabase.
 * Estes tipos são gerados automaticamente pelo CLI do Supabase,
 * mas aqui estamos definindo manualmente para fins de demonstração.
 */

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
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          type: 'client' | 'professional'
          birth_date: string | null
          created_at: string
          last_login: string | null
          preferences: Json | null
        }
        Insert: {
          id: string
          name: string
          email: string
          phone: string
          type: 'client' | 'professional'
          birth_date?: string | null
          created_at?: string
          last_login?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          type?: 'client' | 'professional'
          birth_date?: string | null
          created_at?: string
          last_login?: string | null
          preferences?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          client_id: string
          barber_id: string
          service_id: string
          date: string
          time: string
          duration: number
          status: 'scheduled' | 'completed' | 'cancelled'
          price: number
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          client_id: string
          barber_id: string
          service_id: string
          date: string
          time: string
          duration: number
          status: 'scheduled' | 'completed' | 'cancelled'
          price: number
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          barber_id?: string
          service_id?: string
          date?: string
          time?: string
          duration?: number
          status?: 'scheduled' | 'completed' | 'cancelled'
          price?: number
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_barber_id_fkey"
            columns: ["barber_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          duration: number
          category: string
          image: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          name: string
          description: string
          price: number
          duration: number
          category: string
          image?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          duration?: number
          category?: string
          image?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          stock: number
          category: string
          image: string | null
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          description: string
          price: number
          stock: number
          category: string
          image?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          stock?: number
          category?: string
          image?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          client_id: string
          items: Json
          total: number
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          client_id: string
          items: Json
          total: number
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          items?: Json
          total?: number
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      client_interactions: {
        Row: {
          id: string
          client_id: string
          type: 'appointment' | 'purchase' | 'course' | 'website_visit' | 'message'
          date: string
          value: number | null
          details: string
          source: string | null
        }
        Insert: {
          id: string
          client_id: string
          type: 'appointment' | 'purchase' | 'course' | 'website_visit' | 'message'
          date: string
          value?: number | null
          details: string
          source?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          type?: 'appointment' | 'purchase' | 'course' | 'website_visit' | 'message'
          date?: string
          value?: number | null
          details?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_interactions_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      client_segments: {
        Row: {
          id: string
          name: string
          description: string
          criteria: Json
          color: string
        }
        Insert: {
          id: string
          name: string
          description: string
          criteria: Json
          color: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          criteria?: Json
          color?: string
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
