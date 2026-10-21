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
          category: string | null;
          is_archived: boolean;
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
          is_archived?: boolean;
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
          is_archived?: boolean;
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
          tracking_carrier: string | null;
          tracking_number: string | null;
          customs_declaration_number: string | null;
          dispatched_at: string | null;
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
          tracking_carrier?: string | null;
          tracking_number?: string | null;
          customs_declaration_number?: string | null;
          dispatched_at?: string | null;
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
          tracking_carrier?: string | null;
          tracking_number?: string | null;
          customs_declaration_number?: string | null;
          dispatched_at?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          created_at: string;
          order_id: string;
          gem_id: string;
          gem_name: string;
          variety: string;
          carat: number;
          price: number;
          currency: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          order_id: string;
          gem_id: string;
          gem_name: string;
          variety: string;
          carat: number;
          price: number;
          currency?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          order_id?: string;
          gem_id?: string;
          gem_name?: string;
          variety?: string;
          carat?: number;
          price?: number;
          currency?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_gem_id_fkey";
            columns: ["gem_id"];
            isOneToOne: false;
            referencedRelation: "gemstones";
            referencedColumns: ["id"];
          }
        ];
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
          reply_notes?: string | null;
          replied_at?: string | null;
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
          reply_notes?: string | null;
          replied_at?: string | null;
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
          reply_notes?: string | null;
          replied_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_inquiries_gem";
            columns: ["gem_id"];
            isOneToOne: false;
            referencedRelation: "gemstones";
            referencedColumns: ["id"];
          }
        ];
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
      categories: {
        Row: {
          id: string;
          created_at: string;
          slug: string;
          name: string;
          subtitle: string | null;
          tagline: string | null;
          description: string | null;
          image: string;
          variety_query: string | null;
          product_count: number;
          featured: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          slug: string;
          name: string;
          subtitle?: string | null;
          tagline?: string | null;
          description?: string | null;
          image: string;
          variety_query?: string | null;
          product_count?: number;
          featured?: boolean;
          sort_order?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          slug?: string;
          name?: string;
          subtitle?: string | null;
          tagline?: string | null;
          description?: string | null;
          image?: string;
          variety_query?: string | null;
          product_count?: number;
          featured?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          url: string;
          type: string;
          size: string | null;
          dimensions: string | null;
          format: string | null;
          associated_gem_slug: string | null;
          tag: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          url: string;
          type?: string;
          size?: string | null;
          dimensions?: string | null;
          format?: string | null;
          associated_gem_slug?: string | null;
          tag?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          url?: string;
          type?: string;
          size?: string | null;
          dimensions?: string | null;
          format?: string | null;
          associated_gem_slug?: string | null;
          tag?: string | null;
        };
        Relationships: [];
      };
      store_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      seo_records: {
        Row: {
          id: string;
          page_path: string;
          page_title: string;
          meta_title: string;
          meta_description: string;
          keywords: string[];
          og_title: string | null;
          og_description: string | null;
          og_image: string | null;
          canonical_url: string;
          schema_type: string;
          index_status: string;
          last_audited: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          page_path: string;
          page_title: string;
          meta_title: string;
          meta_description: string;
          keywords?: string[];
          og_title?: string | null;
          og_description?: string | null;
          og_image?: string | null;
          canonical_url: string;
          schema_type?: string;
          index_status?: string;
          last_audited?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_path?: string;
          page_title?: string;
          meta_title?: string;
          meta_description?: string;
          keywords?: string[];
          og_title?: string | null;
          og_description?: string | null;
          og_image?: string | null;
          canonical_url?: string;
          schema_type?: string;
          index_status?: string;
          last_audited?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      process_checkout_order: {
        Args: {
          p_order_id: string;
          p_user_id: string | null;
          p_customer_name: string;
          p_email: string;
          p_phone: string;
          p_shipping_address: string;
          p_city: string;
          p_country: string;
          p_notes: string;
          p_gem_ids: string[];
        };
        Returns: {
          success: boolean;
          order_id: string;
          total_amount: number;
        };
      };
      get_vault_metrics: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
