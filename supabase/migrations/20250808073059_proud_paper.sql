/*
  # NordMatchAI Initial Schema

  1. New Tables
    - `profiles` - User profiles with preferences and settings
    - `countries` - Supported countries (Denmark, Sweden, Norway, Finland, Netherlands)
    - `teams` - Football teams from supported countries
    - `matches` - Match fixtures with metadata
    - `articles` - Scraped news articles and press releases
    - `events` - Extracted events (injuries, lineups, etc.)
    - `predictions` - AI-generated match predictions
    - `watchlists` - User's watched matches for alerts
    - `feedback` - User feedback on prediction accuracy
    - `trusted_sources` - Verified media outlets and credibility scores

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only access for certain tables
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  flag_emoji text NOT NULL,
  timezone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_id uuid REFERENCES countries(id) ON DELETE CASCADE,
  league text NOT NULL,
  logo_url text,
  home_stadium text,
  founded_year integer,
  created_at timestamptz DEFAULT now()
);

-- Trusted sources table
CREATE TABLE IF NOT EXISTS trusted_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text UNIQUE NOT NULL,
  country_id uuid REFERENCES countries(id) ON DELETE CASCADE,
  credibility_score decimal(3,2) DEFAULT 0.75,
  language text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id) ON DELETE CASCADE,
  match_date timestamptz NOT NULL,
  league text NOT NULL,
  venue text,
  status text DEFAULT 'scheduled',
  home_score integer DEFAULT 0,
  away_score integer DEFAULT 0,
  weather jsonb,
  odds jsonb,
  created_at timestamptz DEFAULT now()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  preferred_countries text[] DEFAULT '{}',
  notification_preferences jsonb DEFAULT '{"email": true, "push": true}',
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  source_id uuid REFERENCES trusted_sources(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  url text NOT NULL,
  author text,
  language text DEFAULT 'en',
  sentiment_score decimal(3,2) DEFAULT 0.0,
  relevance_score decimal(3,2) DEFAULT 0.5,
  published_at timestamptz NOT NULL,
  scraped_at timestamptz DEFAULT now()
);

-- Events table (extracted from articles)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'injury', 'lineup', 'suspension', 'quote'
  player_name text,
  team_name text,
  description text NOT NULL,
  confidence_score decimal(3,2) DEFAULT 0.7,
  extracted_at timestamptz DEFAULT now()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  home_win_prob decimal(4,3) NOT NULL,
  draw_prob decimal(4,3) NOT NULL,
  away_win_prob decimal(4,3) NOT NULL,
  predicted_home_score integer DEFAULT 0,
  predicted_away_score integer DEFAULT 0,
  confidence_score decimal(3,2) NOT NULL,
  model_version text DEFAULT 'v1.0',
  feature_importance jsonb NOT NULL,
  evidence_snippets jsonb NOT NULL,
  reasoning text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  alert_threshold decimal(3,2) DEFAULT 0.1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, match_id)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prediction_id uuid REFERENCES predictions(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  was_accurate boolean,
  comments text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Public read access for reference data
CREATE POLICY "Countries are viewable by everyone"
  ON countries FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Matches are viewable by everyone"
  ON matches FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Trusted sources are viewable by everyone"
  ON trusted_sources FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Predictions are viewable by everyone"
  ON predictions FOR SELECT
  TO authenticated, anon
  USING (true);

-- User-specific data policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can manage own watchlist"
  ON watchlists FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own feedback"
  ON feedback FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert initial data
INSERT INTO countries (name, code, flag_emoji, timezone) VALUES
  ('Denmark', 'DK', '🇩🇰', 'Europe/Copenhagen'),
  ('Sweden', 'SE', '🇸🇪', 'Europe/Stockholm'),
  ('Norway', 'NO', '🇳🇴', 'Europe/Oslo'),
  ('Finland', 'FI', '🇫🇮', 'Europe/Helsinki'),
  ('Netherlands', 'NL', '🇳🇱', 'Europe/Amsterdam');