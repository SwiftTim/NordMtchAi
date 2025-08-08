import { supabase } from '../lib/supabase';
import type { Country, Team, Match, Prediction } from '../types';

export class APIService {
  // Countries
  async getCountries(): Promise<Country[]> {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Teams
  async getTeamsByCountry(countryId: string): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('country_id', countryId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Matches
  async getUpcomingMatches(countryId?: string): Promise<Match[]> {
    let query = supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*),
        country:countries(*)
      `)
      .eq('status', 'scheduled')
      .gte('match_date', new Date().toISOString())
      .order('match_date');

    if (countryId) {
      query = query.eq('country_id', countryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getMatchById(matchId: string): Promise<Match | null> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*),
        country:countries(*)
      `)
      .eq('id', matchId)
      .single();

    if (error) throw error;
    return data;
  }

  // Predictions
  async getPredictionByMatchId(matchId: string): Promise<Prediction | null> {
    const { data, error } = await supabase
      .from('predictions')
      .select(`
        *,
        match:matches(
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*),
          country:countries(*)
        )
      `)
      .eq('match_id', matchId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async generatePrediction(matchId: string): Promise<Prediction> {
    // Simulate AI prediction generation with realistic data
    const match = await this.getMatchById(matchId);
    if (!match) throw new Error('Match not found');

    const mockPrediction = this.generateMockPrediction(match);

    const { data, error } = await supabase
      .from('predictions')
      .insert([mockPrediction])
      .select(`
        *,
        match:matches(
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*),
          country:countries(*)
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  private generateMockPrediction(match: Match) {
    // Generate realistic probabilities
    const homeAdvantage = 0.1;
    const baseProb = 0.33;
    
    const home_win_prob = Math.random() * 0.4 + baseProb + homeAdvantage;
    const away_win_prob = Math.random() * 0.4 + baseProb;
    const draw_prob = 1 - home_win_prob - away_win_prob;

    // Normalize probabilities
    const total = home_win_prob + draw_prob + away_win_prob;
    const normalized = {
      home_win_prob: parseFloat((home_win_prob / total).toFixed(3)),
      draw_prob: parseFloat((draw_prob / total).toFixed(3)),
      away_win_prob: parseFloat((away_win_prob / total).toFixed(3))
    };

    return {
      match_id: match.id,
      ...normalized,
      predicted_home_score: Math.round(Math.random() * 3),
      predicted_away_score: Math.round(Math.random() * 3),
      confidence_score: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
      model_version: 'v1.4',
      feature_importance: [
        { feature: 'home_form', impact: Math.random() * 0.2, description: 'Recent home performance' },
        { feature: 'away_form', impact: Math.random() * 0.15, description: 'Recent away performance' },
        { feature: 'head_to_head', impact: Math.random() * 0.12, description: 'Historical matchups' },
        { feature: 'injury_impact', impact: -Math.random() * 0.08, description: 'Key player unavailability' },
        { feature: 'odds_movement', impact: Math.random() * 0.1, description: 'Betting market sentiment' }
      ],
      evidence_snippets: [
        {
          source: 'Local Sport Media',
          timestamp: new Date().toISOString(),
          text: `Coach confirms starting XI - key players available for ${match.home_team?.name}.`,
          confidence: 0.85
        },
        {
          source: 'Team Official',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          text: `Recent form suggests strong performance expected at ${match.venue}.`,
          confidence: 0.78
        }
      ],
      reasoning: `Model estimates ${match.home_team?.name} has slight advantage due to home form and lineup certainty. ${match.away_team?.name} showing consistent away performance but recent injury concerns may impact result. Weather conditions favorable for attacking play.`
    };
  }

  // Watchlist
  async addToWatchlist(matchId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('watchlists')
      .insert([{ user_id: user.id, match_id: matchId }]);

    if (error) throw error;
  }

  async removeFromWatchlist(matchId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('user_id', user.id)
      .eq('match_id', matchId);

    if (error) throw error;
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('watchlists')
      .select(`
        *,
        match:matches(
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*),
          country:countries(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Authentication
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}

export const apiService = new APIService();