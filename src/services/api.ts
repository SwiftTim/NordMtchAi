import { supabase } from '../lib/supabase';
import { footballApiService } from './footballApiService';
import { aiPredictionService } from './aiPredictionService';
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
    // Get real matches from API
    const country = countryId ? await this.getCountryById(countryId) : null;
    const apiMatches = await footballApiService.getUpcomingMatches(country?.code);
    
    // Sync with database
    await this.syncApiMatchesToDatabase(apiMatches, countryId);

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

  private async getCountryById(countryId: string) {
    const { data } = await supabase
      .from('countries')
      .select('*')
      .eq('id', countryId)
      .single();
    return data;
  }

  private async syncApiMatchesToDatabase(apiMatches: any[], countryId?: string) {
    for (const apiMatch of apiMatches) {
      try {
        // Get or create country
        const countryCode = this.getCountryCodeFromLeague(apiMatch.league.country);
        const { data: country } = await supabase
          .from('countries')
          .select('id')
          .eq('code', countryCode)
          .single();

        if (!country) continue;

        // Get or create teams
        const homeTeam = await this.getOrCreateTeam(
          apiMatch.teams.home.name,
          country.id,
          apiMatch.league.name
        );
        const awayTeam = await this.getOrCreateTeam(
          apiMatch.teams.away.name,
          country.id,
          apiMatch.league.name
        );

        if (!homeTeam || !awayTeam) continue;

        // Check if match exists
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('id')
          .eq('home_team_id', homeTeam.id)
          .eq('away_team_id', awayTeam.id)
          .eq('match_date', apiMatch.fixture.date)
          .single();

        if (existingMatch) continue;

        // Insert new match
        await supabase
          .from('matches')
          .insert({
            home_team_id: homeTeam.id,
            away_team_id: awayTeam.id,
            country_id: country.id,
            match_date: apiMatch.fixture.date,
            league: apiMatch.league.name,
            venue: apiMatch.fixture.venue.name,
            status: 'scheduled'
          });
      } catch (error) {
        console.error('Error syncing match:', error);
      }
    }
  }

  private async getOrCreateTeam(teamName: string, countryId: string, league: string) {
    try {
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('*')
        .eq('name', teamName)
        .eq('country_id', countryId)
        .single();

      if (existingTeam) return existingTeam;

      const { data: newTeam } = await supabase
        .from('teams')
        .insert({
          name: teamName,
          country_id: countryId,
          league: league
        })
        .select('*')
        .single();

      return newTeam;
    } catch (error) {
      console.error('Error getting/creating team:', error);
      return null;
    }
  }

  private getCountryCodeFromLeague(country: string): string {
    const mapping: { [key: string]: string } = {
      'Denmark': 'DK',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Finland': 'FI',
      'Netherlands': 'NL'
    };
    return mapping[country] || 'DK';
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
    const match = await this.getMatchById(matchId);
    if (!match) throw new Error('Match not found');

    // Use comprehensive AI prediction service
    const prediction = await aiPredictionService.generateComprehensivePrediction(match);

    const { data, error } = await supabase
      .from('predictions')
      .insert([{
        match_id: prediction.match_id,
        home_win_prob: prediction.home_win_prob,
        draw_prob: prediction.draw_prob,
        away_win_prob: prediction.away_win_prob,
        predicted_home_score: prediction.predicted_home_score,
        predicted_away_score: prediction.predicted_away_score,
        confidence_score: prediction.confidence_score,
        model_version: prediction.model_version,
        feature_importance: prediction.feature_importance,
        evidence_snippets: prediction.evidence_snippets,
        reasoning: prediction.reasoning
      }])
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