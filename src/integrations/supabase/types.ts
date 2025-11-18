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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      academic_resources: {
        Row: {
          college_id: string
          created_at: string
          description: string | null
          downloads: number | null
          file_url: string
          id: string
          resource_type: string
          subject_id: string
          title: string
          upload_date: string
          uploaded_by: string | null
        }
        Insert: {
          college_id: string
          created_at?: string
          description?: string | null
          downloads?: number | null
          file_url: string
          id?: string
          resource_type: string
          subject_id: string
          title: string
          upload_date?: string
          uploaded_by?: string | null
        }
        Update: {
          college_id?: string
          created_at?: string
          description?: string | null
          downloads?: number | null
          file_url?: string
          id?: string
          resource_type?: string
          subject_id?: string
          title?: string
          upload_date?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_resources_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_resources_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      college_programs: {
        Row: {
          college_id: string
          created_at: string
          fees_per_year: number | null
          id: string
          program_id: string
          seats_available: number | null
        }
        Insert: {
          college_id: string
          created_at?: string
          fees_per_year?: number | null
          id?: string
          program_id: string
          seats_available?: number | null
        }
        Update: {
          college_id?: string
          created_at?: string
          fees_per_year?: number | null
          id?: string
          program_id?: string
          seats_available?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "college_programs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          address: string
          affiliated_university_id: string
          city: string
          created_at: string
          description: string | null
          established_year: number | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address: string
          affiliated_university_id: string
          city?: string
          created_at?: string
          description?: string | null
          established_year?: number | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string
          affiliated_university_id?: string
          city?: string
          created_at?: string
          description?: string | null
          established_year?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colleges_affiliated_university_id_fkey"
            columns: ["affiliated_university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          attendance_status: string | null
          college_name: string
          created_at: string
          email: string
          event_id: string
          id: string
          phone: string
          program: string
          registration_date: string
          student_name: string
        }
        Insert: {
          attendance_status?: string | null
          college_name: string
          created_at?: string
          email: string
          event_id: string
          id?: string
          phone: string
          program: string
          registration_date?: string
          student_name: string
        }
        Update: {
          attendance_status?: string | null
          college_name?: string
          created_at?: string
          email?: string
          event_id?: string
          id?: string
          phone?: string
          program?: string
          registration_date?: string
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          current_registrations: number | null
          date_time: string
          description: string
          event_type: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          max_capacity: number | null
          registration_deadline: string | null
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          created_at?: string
          current_registrations?: number | null
          date_time: string
          description: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_capacity?: number | null
          registration_deadline?: string | null
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          created_at?: string
          current_registrations?: number | null
          date_time?: string
          description?: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_capacity?: number | null
          registration_deadline?: string | null
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      internship_applicants: {
        Row: {
          application_date: string
          college_name: string
          cover_letter: string | null
          created_at: string
          email: string
          id: string
          phone: string
          posting_id: string
          program: string
          resume_file_url: string
          status: string | null
          student_name: string
        }
        Insert: {
          application_date?: string
          college_name: string
          cover_letter?: string | null
          created_at?: string
          email: string
          id?: string
          phone: string
          posting_id: string
          program: string
          resume_file_url: string
          status?: string | null
          student_name: string
        }
        Update: {
          application_date?: string
          college_name?: string
          cover_letter?: string | null
          created_at?: string
          email?: string
          id?: string
          phone?: string
          posting_id?: string
          program?: string
          resume_file_url?: string
          status?: string | null
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_applicants_posting_id_fkey"
            columns: ["posting_id"]
            isOneToOne: false
            referencedRelation: "internship_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_postings: {
        Row: {
          application_type: string
          application_url: string | null
          company_logo_url: string | null
          company_name: string
          created_at: string
          deadline: string | null
          description: string
          duration: string | null
          id: string
          is_active: boolean | null
          location: string
          posted_date: string
          program_filter: string[] | null
          requirements: string | null
          role_title: string
          stipend: string | null
        }
        Insert: {
          application_type?: string
          application_url?: string | null
          company_logo_url?: string | null
          company_name: string
          created_at?: string
          deadline?: string | null
          description: string
          duration?: string | null
          id?: string
          is_active?: boolean | null
          location: string
          posted_date?: string
          program_filter?: string[] | null
          requirements?: string | null
          role_title: string
          stipend?: string | null
        }
        Update: {
          application_type?: string
          application_url?: string | null
          company_logo_url?: string | null
          company_name?: string
          created_at?: string
          deadline?: string | null
          description?: string
          duration?: string | null
          id?: string
          is_active?: boolean | null
          location?: string
          posted_date?: string
          program_filter?: string[] | null
          requirements?: string | null
          role_title?: string
          stipend?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          acronym: string
          created_at: string
          description: string | null
          duration: string
          id: string
          name: string
          program_type: string | null
          updated_at: string
        }
        Insert: {
          acronym: string
          created_at?: string
          description?: string | null
          duration: string
          id?: string
          name: string
          program_type?: string | null
          updated_at?: string
        }
        Update: {
          acronym?: string
          created_at?: string
          description?: string | null
          duration?: string
          id?: string
          name?: string
          program_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string | null
          created_at: string
          credits: number | null
          description: string | null
          id: string
          name: string
          program_id: string
          semester: number
        }
        Insert: {
          code?: string | null
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          name: string
          program_id: string
          semester: number
        }
        Update: {
          code?: string | null
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          name?: string
          program_id?: string
          semester?: number
        }
        Relationships: [
          {
            foreignKeyName: "subjects_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          acronym: string
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          acronym: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          acronym?: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
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
