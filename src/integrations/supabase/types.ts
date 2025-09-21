export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export const Constants = {
  public: {
    Enums: {
      order_status: ["pending", "preparing", "ready", "delivered", "cancelled"],
      reservation_status: [
        "pending",
        "confirmed",
        "seated",
        "completed",
        "cancelled",
      ],
      staff_status: ["active", "inactive", "on_break"],
      table_status: ["available", "occupied", "reserved", "maintenance"],
      user_role: [
        "super_admin",
        "admin",
        "manager",
        "staff",
        "customer",
        "system_super_admin",
        "owner",
        "front_staff",
        "kitchen_staff",
        "cashier",
      ],
    },
  },
} as const

type StaffStatus = typeof Constants.public.Enums.staff_status[number]

export type UserRole = typeof Constants.public.Enums.user_role[number]

export type Profile = Tables<"profiles">

export type Staff = Tables<"staff">

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          loyalty_points: number | null
          phone: string | null
          profile_id: string | null
          restaurant_id: string | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          loyalty_points?: number | null
          phone?: string | null
          profile_id?: string | null
          restaurant_id?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          loyalty_points?: number | null
          phone?: string | null
          profile_id?: string | null
          restaurant_id?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string
          current_stock: number
          expiry_date: string | null
          id: string
          item_name: string
          last_restocked: string | null
          max_stock: number | null
          min_stock: number
          restaurant_id: string | null
          supplier: string | null
          unit: string
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_stock?: number
          expiry_date?: string | null
          id?: string
          item_name: string
          last_restocked?: string | null
          max_stock?: number | null
          min_stock?: number
          restaurant_id?: string | null
          supplier?: string | null
          unit: string
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          current_stock?: number
          expiry_date?: string | null
          id?: string
          item_name?: string
          last_restocked?: string | null
          max_stock?: number | null
          min_stock?: number
          restaurant_id?: string | null
          supplier?: string | null
          unit?: string
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          restaurant_id: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          restaurant_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          restaurant_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          calories: number | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          is_available: boolean
          name: string
          prep_time: number | null
          price: number
          restaurant_id: string | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          calories?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean
          name: string
          prep_time?: number | null
          price: number
          restaurant_id?: string | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          calories?: number | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean
          name?: string
          prep_time?: number | null
          price?: number
          restaurant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          order_id: string
          quantity: number
          special_instructions: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          order_id: string
          quantity?: number
          special_instructions?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          order_id?: string
          quantity?: number
          special_instructions?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string | null
          discount_amount: number
          estimated_prep_time: number | null
          id: string
          order_number: string
          order_type: string | null
          payment_method: string | null
          payment_status: string | null
          restaurant_id: string | null
          special_instructions: string | null
          staff_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          table_id: string | null
          tax_amount: number
          tip_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number
          estimated_prep_time?: number | null
          id?: string
          order_number: string
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          restaurant_id?: string | null
          special_instructions?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          table_id?: string | null
          tax_amount?: number
          tip_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number
          estimated_prep_time?: number | null
          id?: string
          order_number?: string
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          restaurant_id?: string | null
          special_instructions?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          table_id?: string | null
          tax_amount?: number
          tip_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          restaurant_id: string | null
          role: UserRole
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          restaurant_id?: string | null
          role?: UserRole
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          restaurant_id?: string | null
          role?: UserRole
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          contact_email: string | null
          contact_name: string
          contact_phone: string
          created_at: string
          customer_id: string | null
          id: string
          party_size: number
          reservation_date: string
          reservation_time: string
          restaurant_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["reservation_status"]
          table_id: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string
          customer_id?: string | null
          id?: string
          party_size: number
          reservation_date: string
          reservation_time: string
          restaurant_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["reservation_status"]
          table_id?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          party_size?: number
          reservation_date?: string
          reservation_time?: string
          restaurant_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["reservation_status"]
          table_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_packages: {
        Row: {
          activated_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          package_id: string
          restaurant_id: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id: string
          restaurant_id: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          package_id?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_packages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_packages_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          location: string | null
          qr_code: string | null
          restaurant_id: string | null
          status: Database["public"]["Enums"]["table_status"]
          table_number: string
          updated_at: string
        }
        Insert: {
          capacity: number
          created_at?: string
          id?: string
          location?: string | null
          qr_code?: string | null
          restaurant_id?: string | null
          status?: Database["public"]["Enums"]["table_status"]
          table_number: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          location?: string | null
          qr_code?: string | null
          restaurant_id?: string | null
          status?: Database["public"]["Enums"]["table_status"]
          table_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          slug: string
          subscription_status: string | null
          timezone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          slug: string
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          slug?: string
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission: string
          role: UserRole
        }
        Insert: {
          created_at?: string
          id?: string
          permission: string
          role: UserRole
        }
        Update: {
          created_at?: string
          id?: string
          permission?: string
          role?: UserRole
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          department: string | null
          email: string | null
          employee_id: string | null
          first_name: string
          hire_date: string | null
          hourly_rate: number | null
          id: string
          last_name: string
          permissions: string[] | null
          phone: string | null
          position: string
          profile_id: string | null
          restaurant_id: string | null
          shift_end: string | null
          shift_start: string | null
          status: StaffStatus
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email?: string | null
          employee_id?: string | null
          first_name: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_name: string
          permissions?: string[] | null
          phone?: string | null
          position: string
          profile_id?: string | null
          restaurant_id?: string | null
          shift_end?: string | null
          shift_start?: string | null
          status?: StaffStatus
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string | null
          employee_id?: string | null
          first_name?: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_name?: string
          permissions?: string[] | null
          phone?: string | null
          position?: string
          profile_id?: string | null
          restaurant_id?: string | null
          shift_end?: string | null
          shift_start?: string | null
          status?: StaffStatus
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      make_first_system_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      user_has_role: {
        Args: { _roles: string[]; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "preparing"
        | "ready"
        | "delivered"
        | "cancelled"
      reservation_status:
        | "pending"
        | "confirmed"
        | "seated"
        | "completed"
        | "cancelled"
      staff_status: "active" | "inactive" | "on_break"
      table_status: "available" | "occupied" | "reserved" | "maintenance"
      user_role: UserRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never