import axios from 'axios';

interface ApiFootballMatch {
  fixture: {
    id: number;
    date: string;
    venue: {
      name: string;
      city: string;
    };
    status: {
      short: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    flag: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

interface TeamStatistics {
  team: {
    id: number;
    name: string;
  };
  fixtures: {
    played: { total: number; home: number; away: number };
    wins: { total: number; home: number; away: number };
    draws: { total: number; home: number; away: number };
    loses: { total: number; home: number; away: number };
  };
  goals: {
    for: { total: { total: number; home: number; away: number } };
    against: { total: { total: number; home: number; away: number } };
  };
  biggest: {
    streak: { wins: number; draws: number; loses: number };
    wins: { home: string; away: string };
    loses: { home: string; away: string };
  };
  clean_sheet: { total: number; home: number; away: number };
  failed_to_score: { total: number; home: number; away: number };
  penalty: {
    scored: { total: number; percentage: string };
    missed: { total: number; percentage: string };
  };
  lineups: Array<{
    formation: string;
    played: number;
  }>;
  cards: {
    yellow: { total: number };
    red: { total: number };
  };
}

interface PlayerStatistics {
  player: {
    id: number;
    name: string;
    age: number;
    nationality: string;
    height: string;
    weight: string;
  };
  statistics: Array<{
    team: { id: number; name: string };
    league: { id: number; name: string };
    games: { appearences: number; lineups: number; minutes: number };
    goals: { total: number; assists: number };
    cards: { yellow: number; red: number };
    penalty: { scored: number; missed: number };
  }>;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  condition: string;
}

export class FootballApiService {
  private readonly API_FOOTBALL_BASE = 'https://v3.football.api-sports.io';
  private readonly WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
  private readonly NEWS_API_BASE = 'https://newsapi.org/v2';
  
  private readonly LEAGUE_IDS = {
    'DK': 119, // Danish Superliga
    'SE': 113, // Swedish Allsvenskan
    'NO': 103, // Norwegian Eliteserien
    'FI': 244, // Finnish Veikkausliiga
    'NL': 88   // Dutch Eredivisie
  };

  private readonly headers = {
    'X-RapidAPI-Key': import.meta.env.VITE_FOOTBALL_DATA_API_KEY || 'demo-key',
    'X-RapidAPI-Host': 'v3.football.api-sports.io'
  };

  async getUpcomingMatches(countryCode?: string): Promise<ApiFootballMatch[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      let matches: ApiFootballMatch[] = [];
      
      if (countryCode && this.LEAGUE_IDS[countryCode as keyof typeof this.LEAGUE_IDS]) {
        const leagueId = this.LEAGUE_IDS[countryCode as keyof typeof this.LEAGUE_IDS];
        const response = await axios.get(`${this.API_FOOTBALL_BASE}/fixtures`, {
          headers: this.headers,
          params: {
            league: leagueId,
            from: today,
            to: nextWeek,
            status: 'NS'
          }
        });
        matches = response.data.response || [];
      } else {
        // Get matches from all supported leagues
        for (const leagueId of Object.values(this.LEAGUE_IDS)) {
          try {
            const response = await axios.get(`${this.API_FOOTBALL_BASE}/fixtures`, {
              headers: this.headers,
              params: {
                league: leagueId,
                from: today,
                to: nextWeek,
                status: 'NS'
              }
            });
            matches.push(...(response.data.response || []));
          } catch (error) {
            console.warn(`Failed to fetch matches for league ${leagueId}:`, error);
          }
        }
      }
      
      return matches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  }

  async getTeamStatistics(teamId: number, season: number = 2024): Promise<TeamStatistics | null> {
    try {
      const response = await axios.get(`${this.API_FOOTBALL_BASE}/teams/statistics`, {
        headers: this.headers,
        params: {
          team: teamId,
          season: season,
          league: this.getLeagueIdForTeam(teamId)
        }
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching team statistics:', error);
      return null;
    }
  }

  async getPlayerStatistics(playerId: number, season: number = 2024): Promise<PlayerStatistics | null> {
    try {
      const response = await axios.get(`${this.API_FOOTBALL_BASE}/players`, {
        headers: this.headers,
        params: {
          id: playerId,
          season: season
        }
      });
      return response.data.response?.[0];
    } catch (error) {
      console.error('Error fetching player statistics:', error);
      return null;
    }
  }

  async getTeamForm(teamId: number, last: number = 10): Promise<string[]> {
    try {
      const response = await axios.get(`${this.API_FOOTBALL_BASE}/fixtures`, {
        headers: this.headers,
        params: {
          team: teamId,
          last: last,
          status: 'FT'
        }
      });
      
      const fixtures = response.data.response || [];
      return fixtures.map((fixture: any) => {
        const homeGoals = fixture.goals.home;
        const awayGoals = fixture.goals.away;
        const isHome = fixture.teams.home.id === teamId;
        
        if (homeGoals > awayGoals) {
          return isHome ? 'W' : 'L';
        } else if (homeGoals < awayGoals) {
          return isHome ? 'L' : 'W';
        } else {
          return 'D';
        }
      });
    } catch (error) {
      console.error('Error fetching team form:', error);
      return [];
    }
  }

  async getHeadToHead(team1Id: number, team2Id: number, last: number = 10): Promise<any[]> {
    try {
      const response = await axios.get(`${this.API_FOOTBALL_BASE}/fixtures/headtohead`, {
        headers: this.headers,
        params: {
          h2h: `${team1Id}-${team2Id}`,
          last: last
        }
      });
      return response.data.response || [];
    } catch (error) {
      console.error('Error fetching head-to-head:', error);
      return [];
    }
  }

  async getWeatherData(city: string): Promise<WeatherData | null> {
    try {
      const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
      if (!weatherApiKey) return null;

      const response = await axios.get(`${this.WEATHER_API_BASE}/weather`, {
        params: {
          q: city,
          appid: weatherApiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        precipitation: data.rain?.['1h'] || 0,
        condition: data.weather[0].main
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  async getTeamNews(teamName: string): Promise<any[]> {
    try {
      const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
      if (!newsApiKey) return [];

      const response = await axios.get(`${this.NEWS_API_BASE}/everything`, {
        params: {
          q: teamName,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 5,
          apiKey: newsApiKey
        }
      });

      return response.data.articles || [];
    } catch (error) {
      console.error('Error fetching team news:', error);
      return [];
    }
  }

  async getInjuries(teamId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.API_FOOTBALL_BASE}/injuries`, {
        headers: this.headers,
        params: {
          team: teamId,
          season: 2024
        }
      });
      return response.data.response || [];
    } catch (error) {
      console.error('Error fetching injuries:', error);
      return [];
    }
  }

  async getOdds(fixtureId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.API_FOOTBALL_BASE}/odds`, {
        headers: this.headers,
        params: {
          fixture: fixtureId
        }
      });
      return response.data.response || [];
    } catch (error) {
      console.error('Error fetching odds:', error);
      return [];
    }
  }

  private getLeagueIdForTeam(teamId: number): number {
    // This would need a mapping of team IDs to league IDs
    // For now, return a default league ID
    return 88; // Eredivisie as default
  }
}

export const footballApiService = new FootballApiService();