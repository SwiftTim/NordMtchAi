import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string;
          name: string;
          code: string;
          flag_emoji: string;
          timezone: string;
          created_at: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          country_id: string;
          league: string;
          logo_url?: string;
          home_stadium?: string;
          founded_year?: number;
          created_at: string;
        };
      };
      matches: {
        Row: {
          id: string;
          home_team_id: string;
          away_team_id: string;
          country_id: string;
          match_date: string;
          league: string;
          venue?: string;
          status: string;
          home_score: number;
          away_score: number;
          weather?: any;
          odds?: any;
          created_at: string;
        };
      };
      predictions: {
        Row: {
          id: string;
          match_id: string;
          home_win_prob: number;
          draw_prob: number;
          away_win_prob: number;
          predicted_home_score: number;
          predicted_away_score: number;
          confidence_score: number;
          model_version: string;
          feature_importance: any;
          evidence_snippets: any;
          reasoning: string;
          created_at: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name?: string;
          preferred_countries: string[];
          notification_preferences: any;
          subscription_tier: string;
          created_at: string;
          updated_at: string;
        };
      };
      watchlists: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          alert_threshold: number;
          created_at: string;
        };
      };
    };
  };
};