import { supabase } from '../lib/supabase';
import type { Match, Team, Country } from '../types';

interface ExternalMatch {
  homeTeam: string;
  awayTeam: string;
  date: string;
  league: string;
  venue?: string;
  country: string;
}

export class MatchDataService {
  private readonly API_ENDPOINTS = {
    // Using football-data.org API (free tier available)
    FOOTBALL_DATA: 'https://api.football-data.org/v4',
    // Alternative: API-FOOTBALL (RapidAPI)
    API_FOOTBALL: 'https://v3.football.api-sports.io'
  };

  private readonly LEAGUE_MAPPINGS = {
    'DK': { id: 'DK1', name: 'Superliga' },
    'SE': { id: 'SE1', name: 'Allsvenskan' },
    'NO': { id: 'NO1', name: 'Eliteserien' },
    'FI': { id: 'FI1', name: 'Veikkausliiga' },
    'NL': { id: 'ED', name: 'Eredivisie' }
  };

  async fetchTodaysMatches(): Promise<ExternalMatch[]> {
    const today = new Date().toISOString().split('T')[0];
    const matches: ExternalMatch[] = [];

    try {
      // Fetch matches for each country
      for (const [countryCode, league] of Object.entries(this.LEAGUE_MAPPINGS)) {
        const countryMatches = await this.fetchMatchesForCountry(countryCode, today);
        matches.push(...countryMatches);
      }

      return matches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      // Fallback to mock data if API fails
      return this.getMockTodaysMatches();
    }
  }

  private async fetchMatchesForCountry(countryCode: string, date: string): Promise<ExternalMatch[]> {
    // This would use a real sports API
    // For now, returning mock data as a placeholder
    return this.getMockMatchesForCountry(countryCode, date);
  }

  private getMockTodaysMatches(): ExternalMatch[] {
    const today = new Date();
    const matches: ExternalMatch[] = [];

    // Denmark matches
    matches.push({
      homeTeam: 'FC Copenhagen',
      awayTeam: 'Brøndby IF',
      date: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      league: 'Superliga',
      venue: 'Parken Stadium',
      country: 'DK'
    });

    matches.push({
      homeTeam: 'FC Midtjylland',
      awayTeam: 'AGF Aarhus',
      date: new Date(today.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      league: 'Superliga',
      venue: 'MCH Arena',
      country: 'DK'
    });

    // Sweden matches
    matches.push({
      homeTeam: 'AIK Stockholm',
      awayTeam: 'IFK Göteborg',
      date: new Date(today.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      league: 'Allsvenskan',
      venue: 'Friends Arena',
      country: 'SE'
    });

    matches.push({
      homeTeam: 'Malmö FF',
      awayTeam: 'Hammarby IF',
      date: new Date(today.getTime() + 5 * 60 * 60 * 1000).toISOString(),
      league: 'Allsvenskan',
      venue: 'Eleda Stadion',
      country: 'SE'
    });

    // Norway matches
    matches.push({
      homeTeam: 'Rosenborg BK',
      awayTeam: 'Molde FK',
      date: new Date(today.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      league: 'Eliteserien',
      venue: 'Lerkendal Stadion',
      country: 'NO'
    });

    // Finland matches
    matches.push({
      homeTeam: 'HJK Helsinki',
      awayTeam: 'KuPS Kuopio',
      date: new Date(today.getTime() + 1 * 60 * 60 * 1000).toISOString(),
      league: 'Veikkausliiga',
      venue: 'Bolt Arena',
      country: 'FI'
    });

    // Netherlands matches
    matches.push({
      homeTeam: 'Ajax Amsterdam',
      awayTeam: 'PSV Eindhoven',
      date: new Date(today.getTime() + 7 * 60 * 60 * 1000).toISOString(),
      league: 'Eredivisie',
      venue: 'Johan Cruyff Arena',
      country: 'NL'
    });

    matches.push({
      homeTeam: 'Feyenoord Rotterdam',
      awayTeam: 'FC Utrecht',
      date: new Date(today.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      league: 'Eredivisie',
      venue: 'De Kuip',
      country: 'NL'
    });

    return matches;
  }

  private getMockMatchesForCountry(countryCode: string, date: string): ExternalMatch[] {
    // This would be replaced with actual API calls
    return [];
  }

  async syncMatchesToDatabase(externalMatches: ExternalMatch[]): Promise<void> {
    for (const match of externalMatches) {
      try {
        // Get country
        const { data: country } = await supabase
          .from('countries')
          .select('id')
          .eq('code', match.country)
          .single();

        if (!country) continue;

        // Get or create teams
        const homeTeam = await this.getOrCreateTeam(match.homeTeam, country.id, match.league);
        const awayTeam = await this.getOrCreateTeam(match.awayTeam, country.id, match.league);

        if (!homeTeam || !awayTeam) continue;

        // Check if match already exists
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('id')
          .eq('home_team_id', homeTeam.id)
          .eq('away_team_id', awayTeam.id)
          .eq('match_date', match.date)
          .single();

        if (existingMatch) continue; // Skip if match already exists

        // Insert new match
        await supabase
          .from('matches')
          .insert({
            home_team_id: homeTeam.id,
            away_team_id: awayTeam.id,
            country_id: country.id,
            match_date: match.date,
            league: match.league,
            venue: match.venue,
            status: 'scheduled'
          });

      } catch (error) {
        console.error('Error syncing match:', match, error);
      }
    }
  }

  private async getOrCreateTeam(teamName: string, countryId: string, league: string): Promise<Team | null> {
    try {
      // Try to find existing team
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('*')
        .eq('name', teamName)
        .eq('country_id', countryId)
        .single();

      if (existingTeam) return existingTeam;

      // Create new team
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
      console.error('Error getting/creating team:', teamName, error);
      return null;
    }
  }

  async refreshTodaysMatches(): Promise<void> {
    try {
      const matches = await this.fetchTodaysMatches();
      await this.syncMatchesToDatabase(matches);
    } catch (error) {
      console.error('Error refreshing today\'s matches:', error);
      throw error;
    }
  }
}

export const matchDataService = new MatchDataService();