import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          birthday: string;
          service_type: 'Paid' | 'Free';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      flights: {
        Row: {
          id: string;
          client_id: string;
          flight_date: string;
          cost_type: 'Paid' | 'Free';
          charged_amount: number;
          currency: '₪' | '$';
          amount_due: number;
          payment_status: 'Paid' | 'Unpaid';
          flight_status: 'Upcoming' | 'Completed' | 'Canceled';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['flights']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['flights']['Insert']>;
      };
      activity_log: {
        Row: {
          id: string;
          client_id: string;
          action: string;
          timestamp: string;
        };
        Insert: Omit<Database['public']['Tables']['activity_log']['Row'], 'id' | 'timestamp'>;
        Update: Partial<Database['public']['Tables']['activity_log']['Insert']>;
      };
    };
  };
}; 