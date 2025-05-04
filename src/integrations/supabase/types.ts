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
      "PDF Cards": {
        Row: {
          Cards: string
          "File Name": string
          User_ID: string
        }
        Insert: {
          Cards: string
          "File Name": string
          User_ID: string
        }
        Update: {
          Cards?: string
          "File Name"?: string
          User_ID?: string
        }
        Relationships: []
      }
      "PDF Quiz": {
        Row: {
          "File Name": string
          Quiz: string
          User_ID: string
        }
        Insert: {
          "File Name": string
          Quiz: string
          User_ID: string
        }
        Update: {
          "File Name"?: string
          Quiz?: string
          User_ID?: string
        }
        Relationships: []
      }
      "PDF Read": {
        Row: {
          "File Name": string
          Read: string
          User_ID: string
        }
        Insert: {
          "File Name": string
          Read: string
          User_ID: string
        }
        Update: {
          "File Name"?: string
          Read?: string
          User_ID?: string
        }
        Relationships: []
      }
      "PDF Summary": {
        Row: {
          "File Name": string
          Summary: string
          User_ID: string
        }
        Insert: {
          "File Name": string
          Summary: string
          User_ID: string
        }
        Update: {
          "File Name"?: string
          Summary?: string
          User_ID?: string
        }
        Relationships: []
      }
      "PDF Video": {
        Row: {
          "File Name": string
          User_ID: string
          Video: string
        }
        Insert: {
          "File Name": string
          User_ID: string
          Video: string
        }
        Update: {
          "File Name"?: string
          User_ID?: string
          Video?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      "URL Cards": {
        Row: {
          Cards: string
          "File Name": string
          User_ID: string
        }
        Insert: {
          Cards: string
          "File Name": string
          User_ID: string
        }
        Update: {
          Cards?: string
          "File Name"?: string
          User_ID?: string
        }
        Relationships: []
      }
      "URL Quiz": {
        Row: {
          "File Name": string
          Quiz: string
          User_ID: string
        }
        Insert: {
          "File Name": string
          Quiz: string
          User_ID: string
        }
        Update: {
          "File Name"?: string
          Quiz?: string
          User_ID?: string
        }
        Relationships: []
      }
      "URL Read": {
        Row: {
          "File Name": string
          Read: string
          User_ID: string
        }
        Insert: {
          "File Name": string
          Read: string
          User_ID: string
        }
        Update: {
          "File Name"?: string
          Read?: string
          User_ID?: string
        }
        Relationships: []
      }
      "URL Summary": {
        Row: {
          "File Name": string
          Summary: string
          User_ID: string
        }
        Insert: {
          "File Name": string
          Summary: string
          User_ID: string
        }
        Update: {
          "File Name"?: string
          Summary?: string
          User_ID?: string
        }
        Relationships: []
      }
      "URL Video": {
        Row: {
          "File Name": string
          User_ID: string
          Video: string
        }
        Insert: {
          "File Name": string
          User_ID: string
          Video: string
        }
        Update: {
          "File Name"?: string
          User_ID?: string
          Video?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_pdf_upload_data: {
        Args: {
          p_id: string
          p_summary: string
          p_cards: string
          p_quiz: string
          p_watch: string
          p_read: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
