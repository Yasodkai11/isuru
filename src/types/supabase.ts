export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      gemstones: {
        Row: {
          id: string;
          created_at: string;
          slug: string;
          name: string;
          variety: string;
          carat: number;
          origin: string;
          cut: string;
          dimensions: string;
          color: string;
          treatment: string;
          clarity: string;
          price: number;
          currency: string;
          in_stock: boolean;
          featured: boolean;
          description: string;
          certificate_lab: string;
          certificate_number: string;
          certificate_pdf_url: string | null;
          images: Json;
          category?: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          slug: string;
          name: string;
          variety: string;
          carat: number;
          origin: string;
          cut: string;
          dimensions: string;
          color: string;
          treatment: string;
          clarity: string;
          price: number;
          currency?: string;
          in_stock?: boolean;
          featured?: boolean;
          description: string;
          certificate_lab: string;
          certificate_number: string;
          certificate_pdf_url?: string | null;
          images?: Json;
          category?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          slug?: string;
          name?: string;
          variety?: string;
          carat?: number;
          origin?: string;
          cut?: string;
          dimensions?: string;
          color?: string;
          treatment?: string;
          clarity?: string;
          price?: number;
          currency?: string;
          in_stock?: boolean;
          featured?: boolean;
          description?: string;
          certificate_lab?: string;
          certificate_number?: string;
          certificate_pdf_url?: string | null;
          images?: Json;
          category?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          shipping_address: string | null;
          postal_code: string | null;
          country: string | null;
          city: string | null;
          tier: string;
          total_spent: number;
          orders_count: number;
          first_acquisition_date: string | null;
          last_acquisition_date: string | null;
          preferred_varieties: Json;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          user_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          shipping_address?: string | null;
          postal_code?: string | null;
          country?: string | null;
          city?: string | null;
          tier?: string;
          total_spent?: number;
          orders_count?: number;
          first_acquisition_date?: string | null;
          last_acquisition_date?: string | null;
          preferred_varieties?: Json;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          user_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string | null;
          shipping_address?: string | null;
          postal_code?: string | null;
          country?: string | null;
          city?: string | null;
          tier?: string;
          total_spent?: number;
          orders_count?: number;
          first_acquisition_date?: string | null;
          last_acquisition_date?: string | null;
          preferred_varieties?: Json;
          notes?: string | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          user_id: string | null;
          customer_name: string;
          email: string;
          phone: string;
          shipping_address: string;
          city: string;
          country: string;
          total_amount: number;
          currency: string;
          status: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          customer_name: string;
          email: string;
          phone: string;
          shipping_address: string;
          city: string;
          country: string;
          total_amount: number;
          currency?: string;
          status?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          customer_name?: string;
          email?: string;
          phone?: string;
          shipping_address?: string;
          city?: string;
          country?: string;
          total_amount?: number;
          currency?: string;
          status?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          created_at: string;
          gem_id: string | null;
          gem_name: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          country: string;
          message: string;
          preferred_currency: string;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          gem_id?: string | null;
          gem_name?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          country: string;
          message: string;
          preferred_currency?: string;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          gem_id?: string | null;
          gem_name?: string | null;
          full_name?: string;
          email?: string;
          phone?: string | null;
          country?: string;
          message?: string;
          preferred_currency?: string;
          status?: string;
        };
        Relationships: [];
      };
      staff_members: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          auth_user_id: string | null;
          full_name: string;
          email: string;
          role: string;
          department: string;
          phone: string | null;
          status: string;
          can_manage_gems: boolean;
          can_manage_orders: boolean;
          can_manage_staff: boolean;
          can_export_data: boolean;
          last_login: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          auth_user_id?: string | null;
          full_name: string;
          email: string;
          role: string;
          department: string;
          phone?: string | null;
          status?: string;
          can_manage_gems?: boolean;
          can_manage_orders?: boolean;
          can_manage_staff?: boolean;
          can_export_data?: boolean;
          last_login?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          auth_user_id?: string | null;
          full_name?: string;
          email?: string;
          role?: string;
          department?: string;
          phone?: string | null;
          status?: string;
          can_manage_gems?: boolean;
          can_manage_orders?: boolean;
          can_manage_staff?: boolean;
          can_export_data?: boolean;
          last_login?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
