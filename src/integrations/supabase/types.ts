export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      access_logs: {
        Row: {
          accessed_at: string
          data_accessed: string
          id: string
          patient_id: string
          professional_id: string
        }
        Insert: {
          accessed_at?: string
          data_accessed: string
          id?: string
          patient_id: string
          professional_id: string
        }
        Update: {
          accessed_at?: string
          data_accessed?: string
          id?: string
          patient_id?: string
          professional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_logs_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          patient_name: string
          price: number | null
          procedure: string
          professional_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          patient_name?: string
          price?: number | null
          procedure: string
          professional_id: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          patient_name?: string
          price?: number | null
          procedure?: string
          professional_id?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          granted_at: string
          id: string
          level: Database["public"]["Enums"]["consent_level"]
          patient_id: string
          professional_id: string
          revoked_at: string | null
        }
        Insert: {
          granted_at?: string
          id?: string
          level?: Database["public"]["Enums"]["consent_level"]
          patient_id: string
          professional_id: string
          revoked_at?: string | null
        }
        Update: {
          granted_at?: string
          id?: string
          level?: Database["public"]["Enums"]["consent_level"]
          patient_id?: string
          professional_id?: string
          revoked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consents_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_entries: {
        Row: {
          after_url: string | null
          before_url: string | null
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          professional_id: string | null
          taken_at: string
          title: string
        }
        Insert: {
          after_url?: string | null
          before_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          professional_id?: string | null
          taken_at?: string
          title: string
        }
        Update: {
          after_url?: string | null
          before_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          professional_id?: string | null
          taken_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "evolution_entries_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          body: string
          created_at: string
          id: string
          patient_id: string
          professional_id: string
          sender_id: string
        }
        Insert: {
          attachment_url?: string | null
          body: string
          created_at?: string
          id?: string
          patient_id: string
          professional_id: string
          sender_id: string
        }
        Update: {
          attachment_url?: string | null
          body?: string
          created_at?: string
          id?: string
          patient_id?: string
          professional_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      professionals: {
        Row: {
          availability: string[]
          avatar_url: string | null
          bio: string | null
          city: string
          created_at: string
          full_name: string
          gallery: string[]
          id: string
          instagram: string | null
          price_from: number | null
          rating: number
          registry: string | null
          reviews_count: number
          services: string[]
          specialty: string
          state: string
          updated_at: string
          user_id: string | null
          verified: boolean
        }
        Insert: {
          availability?: string[]
          avatar_url?: string | null
          bio?: string | null
          city?: string
          created_at?: string
          full_name: string
          gallery?: string[]
          id?: string
          instagram?: string | null
          price_from?: number | null
          rating?: number
          registry?: string | null
          reviews_count?: number
          services?: string[]
          specialty: string
          state?: string
          updated_at?: string
          user_id?: string | null
          verified?: boolean
        }
        Update: {
          availability?: string[]
          avatar_url?: string | null
          bio?: string | null
          city?: string
          created_at?: string
          full_name?: string
          gallery?: string[]
          id?: string
          instagram?: string | null
          price_from?: number | null
          rating?: number
          registry?: string | null
          reviews_count?: number
          services?: string[]
          specialty?: string
          state?: string
          updated_at?: string
          user_id?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          city: string | null
          created_at: string
          full_name: string
          goals: string | null
          id: string
          interests: string[]
          phone: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          goals?: string | null
          id: string
          interests?: string[]
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          goals?: string | null
          id?: string
          interests?: string[]
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          comment: string | null
          created_at: string
          id: string
          patient_id: string | null
          professional_id: string
          rating_communication: number
          rating_experience: number
          rating_service: number
        }
        Insert: {
          author_name?: string
          comment?: string | null
          created_at?: string
          id?: string
          patient_id?: string | null
          professional_id: string
          rating_communication?: number
          rating_experience?: number
          rating_service?: number
        }
        Update: {
          author_name?: string
          comment?: string | null
          created_at?: string
          id?: string
          patient_id?: string | null
          professional_id?: string
          rating_communication?: number
          rating_experience?: number
          rating_service?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_consent: { Args: { _patient_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_professional: {
        Args: { _professional_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "professional" | "admin"
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled"
      consent_level: "full" | "partial" | "revoked"
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

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "professional", "admin"],
      appointment_status: ["pending", "confirmed", "completed", "cancelled"],
      consent_level: ["full", "partial", "revoked"],
    },
  },
} as const
