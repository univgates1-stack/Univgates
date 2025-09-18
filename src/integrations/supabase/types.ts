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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      administrators: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "administrators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          agency_license_number: string | null
          company_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          agency_license_number?: string | null
          company_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          agency_license_number?: string | null
          company_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          application_data: Json | null
          id: string
          program_id: string
          status: string
          student_id: string
          submitted_at: string | null
        }
        Insert: {
          application_data?: Json | null
          id?: string
          program_id: string
          status: string
          student_id: string
          submitted_at?: string | null
        }
        Update: {
          application_data?: Json | null
          id?: string
          program_id?: string
          status?: string
          student_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          application_id: string | null
          content: string
          conversation_id: string | null
          id: string
          receiver_user_id: string
          sender_user_id: string
          sent_at: string
        }
        Insert: {
          application_id?: string | null
          content: string
          conversation_id?: string | null
          id?: string
          receiver_user_id: string
          sender_user_id: string
          sent_at?: string
        }
        Update: {
          application_id?: string | null
          content?: string
          conversation_id?: string | null
          id?: string
          receiver_user_id?: string
          sender_user_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_receiver_user_id_fkey"
            columns: ["receiver_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_user_id_fkey"
            columns: ["sender_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_forms: {
        Row: {
          email: string
          full_name: string
          id: string
          interested_program: string | null
          phone_number: string | null
          submitted_at: string
        }
        Insert: {
          email: string
          full_name: string
          id?: string
          interested_program?: string | null
          phone_number?: string | null
          submitted_at?: string
        }
        Update: {
          email?: string
          full_name?: string
          id?: string
          interested_program?: string | null
          phone_number?: string | null
          submitted_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          last_message: string | null
          last_message_time: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_time?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          description_ar: string | null
          description_en: string | null
          description_tr: string | null
          id: string
          name: string
        }
        Insert: {
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          id?: string
          name: string
        }
        Update: {
          description_ar?: string | null
          description_en?: string | null
          description_tr?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      document_types: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          application_id: string
          doc_type_id: string
          file_name: string
          file_url: string
          id: string
          is_verified: boolean
          student_id: string
          uploaded_at: string
        }
        Insert: {
          application_id: string
          doc_type_id: string
          file_name: string
          file_url: string
          id?: string
          is_verified?: boolean
          student_id: string
          uploaded_at?: string
        }
        Update: {
          application_id?: string
          doc_type_id?: string
          file_name?: string
          file_url?: string
          id?: string
          is_verified?: boolean
          student_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_doc_type_id_fkey"
            columns: ["doc_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          description: string | null
          id: string
          permission_name: string
        }
        Insert: {
          description?: string | null
          id?: string
          permission_name: string
        }
        Update: {
          description?: string | null
          id?: string
          permission_name?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          application_deadline: string | null
          currency: string | null
          description_id: string | null
          id: string
          intake_dates: string[] | null
          is_active: boolean
          languages: string[] | null
          name_id: string | null
          study_levels: string[] | null
          tuition_fee: number | null
          university_id: string
        }
        Insert: {
          application_deadline?: string | null
          currency?: string | null
          description_id?: string | null
          id?: string
          intake_dates?: string[] | null
          is_active?: boolean
          languages?: string[] | null
          name_id?: string | null
          study_levels?: string[] | null
          tuition_fee?: number | null
          university_id: string
        }
        Update: {
          application_deadline?: string | null
          currency?: string | null
          description_id?: string | null
          id?: string
          intake_dates?: string[] | null
          is_active?: boolean
          languages?: string[] | null
          name_id?: string | null
          study_levels?: string[] | null
          tuition_fee?: number | null
          university_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_description_id_fkey"
            columns: ["description_id"]
            isOneToOne: false
            referencedRelation: "translatable_strings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_name_id_fkey"
            columns: ["name_id"]
            isOneToOne: false
            referencedRelation: "translatable_strings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: string
          role_name: string
        }
        Insert: {
          description?: string | null
          id?: string
          role_name: string
        }
        Update: {
          description?: string | null
          id?: string
          role_name?: string
        }
        Relationships: []
      }
      student_addresses: {
        Row: {
          city: string | null
          country: string | null
          id: string
          postal_code: string | null
          state: string | null
          street: string | null
          student_id: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          id?: string
          postal_code?: string | null
          state?: string | null
          street?: string | null
          student_id: string
        }
        Update: {
          city?: string | null
          country?: string | null
          id?: string
          postal_code?: string | null
          state?: string | null
          street?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_addresses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_exam_documents: {
        Row: {
          created_at: string | null
          exam_date: string | null
          exam_name: string
          exam_score: string | null
          file_url: string | null
          id: string
          is_verified: boolean | null
          student_id: string
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          exam_date?: string | null
          exam_name: string
          exam_score?: string | null
          file_url?: string | null
          id?: string
          is_verified?: boolean | null
          student_id: string
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          exam_date?: string | null
          exam_name?: string
          exam_score?: string | null
          file_url?: string | null
          id?: string
          is_verified?: boolean | null
          student_id?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_exam_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_exam_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "university_officials"
            referencedColumns: ["user_id"]
          },
        ]
      }
      student_phones: {
        Row: {
          country_code: string | null
          id: string
          phone_number: string
          phone_type: string
          student_id: string
        }
        Insert: {
          country_code?: string | null
          id?: string
          phone_number: string
          phone_type: string
          student_id: string
        }
        Update: {
          country_code?: string | null
          id?: string
          phone_number?: string
          phone_type?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_phones_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          country_of_birth: string | null
          country_of_origin: string | null
          created_at: string | null
          current_country: string | null
          current_study_level: string | null
          date_of_birth: string | null
          degree_grade: number | null
          graduated_school_name: string | null
          graduation_date: string | null
          has_dual_citizenship: boolean | null
          id: string
          passport_number: string | null
          profile_completion_status: string | null
          puan_or_average_grade: number | null
          user_id: string
        }
        Insert: {
          country_of_birth?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          current_country?: string | null
          current_study_level?: string | null
          date_of_birth?: string | null
          degree_grade?: number | null
          graduated_school_name?: string | null
          graduation_date?: string | null
          has_dual_citizenship?: boolean | null
          id?: string
          passport_number?: string | null
          profile_completion_status?: string | null
          puan_or_average_grade?: number | null
          user_id: string
        }
        Update: {
          country_of_birth?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          current_country?: string | null
          current_study_level?: string | null
          date_of_birth?: string | null
          degree_grade?: number | null
          graduated_school_name?: string | null
          graduation_date?: string | null
          has_dual_citizenship?: boolean | null
          id?: string
          passport_number?: string | null
          profile_completion_status?: string | null
          puan_or_average_grade?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      translatable_strings: {
        Row: {
          id: string
        }
        Insert: {
          id?: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          id: string
          language_code: string
          translatable_string_id: string
          translated_text: string
        }
        Insert: {
          id?: string
          language_code: string
          translatable_string_id: string
          translated_text: string
        }
        Update: {
          id?: string
          language_code?: string
          translatable_string_id?: string
          translated_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_translatable_string_id_fkey"
            columns: ["translatable_string_id"]
            isOneToOne: false
            referencedRelation: "translatable_strings"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          country_id: string | null
          description_id: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          country_id?: string | null
          description_id?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          country_id?: string | null
          description_id?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "universities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "universities_description_id_fkey"
            columns: ["description_id"]
            isOneToOne: false
            referencedRelation: "translatable_strings"
            referencedColumns: ["id"]
          },
        ]
      }
      university_officials: {
        Row: {
          contact_phone: string | null
          created_at: string | null
          department: string | null
          id: string
          university_id: string | null
          user_id: string
        }
        Insert: {
          contact_phone?: string | null
          created_at?: string | null
          department?: string | null
          id?: string
          university_id?: string | null
          user_id: string
        }
        Update: {
          contact_phone?: string | null
          created_at?: string | null
          department?: string | null
          id?: string
          university_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "university_officials_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "university_officials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          first_name: string | null
          id: string
          invited_by: string | null
          language_preference: string | null
          last_name: string | null
          profile_picture_url: string | null
          registration_token: string | null
          token_expiration: string | null
        }
        Insert: {
          email: string
          first_name?: string | null
          id?: string
          invited_by?: string | null
          language_preference?: string | null
          last_name?: string | null
          profile_picture_url?: string | null
          registration_token?: string | null
          token_expiration?: string | null
        }
        Update: {
          email?: string
          first_name?: string | null
          id?: string
          invited_by?: string | null
          language_preference?: string | null
          last_name?: string | null
          profile_picture_url?: string | null
          registration_token?: string | null
          token_expiration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
