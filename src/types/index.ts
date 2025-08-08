export interface Country {
  id: string;
  name: string;
  code: string;
  flag_emoji: string;
  timezone: string;
}

export interface Team {
  id: string;
  name: string;
  country_id: string;
  league: string;
  logo_url?: string;
  home_stadium?: string;
  founded_year?: number;
}

export interface Match {
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
  home_team?: Team;
  away_team?: Team;
  country?: Country;
}

export interface Prediction {
  id: string;
  match_id: string;
  home_win_prob: number;
  draw_prob: number;
  away_win_prob: number;
  predicted_home_score: number;
  predicted_away_score: number;
  confidence_score: number;
  model_version: string;
  feature_importance: FeatureImportance[];
  evidence_snippets: EvidenceSnippet[];
  reasoning: string;
  created_at: string;
  match?: Match;
}

export interface FeatureImportance {
  feature: string;
  impact: number;
  description: string;
}

export interface EvidenceSnippet {
  source: string;
  timestamp: string;
  text: string;
  confidence: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  preferred_countries: string[];
  notification_preferences: any;
  subscription_tier: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  match_id: string;
  alert_threshold: number;
  created_at: string;
  match?: Match;
}