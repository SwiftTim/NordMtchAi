# NordMatchAI

NordMatchAI is an advanced AI-powered football match prediction app focused on Nordic countries and the Netherlands. It provides expert insights using 50+ prediction criteria, real-time match data, and comprehensive analysis from multiple data sources.

## Features

- **Advanced AI Predictions**: 50+ criteria analysis including form, injuries, weather, tactics, and more
- **Real-time Data**: Live match data from multiple football APIs
- **Comprehensive Analysis**: Team statistics, player data, head-to-head records, and expert insights
- Country and league filtering
- Match search and filtering
- Detailed prediction analysis with feature importance and supporting evidence
- Personalized watchlist with alerts
- Authentication (sign up/sign in)
- Responsive, production-ready UI

## AI Prediction Criteria (50+)

Our advanced AI model analyzes over 50 different factors:

### Team Performance (10 criteria)
- Recent form (home/away specific)
- Goal scoring trends
- Defensive solidity
- First/second half performance
- Comeback ability and lead protection

### Historical Data (5 criteria)
- Head-to-head records
- Previous meeting outcomes
- Scoring/conceding patterns
- Home advantage statistics

### Player & Team Condition (10 criteria)
- Injury impact analysis
- Key player availability
- Player fatigue levels
- Team chemistry indicators
- Disciplinary records

### Tactical Analysis (8 criteria)
- Formation effectiveness
- Playing style matchups
- Set piece efficiency
- Counter-attack threat
- Goalkeeping form

### External Factors (8 criteria)
- Weather conditions
- Venue characteristics
- Travel distance impact
- Rest days between matches
- Crowd support levels

### Market Intelligence (5 criteria)
- Betting odds analysis
- Expert predictions consensus
- League position dynamics
- Media expectations

### Psychological Factors (4 criteria)
- Team morale assessment
- Pressure handling ability
- Motivation levels
- Mental strength indicators

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (database & authentication)
- [Lucide React](https://lucide.dev/)
- [react-hot-toast](https://react-hot-toast.com/)
- [date-fns](https://date-fns.org/)
- [Recharts](https://recharts.org/)
- [Axios](https://axios-http.com/) (API integration)
- Multiple Football APIs for real-time data

## Getting Started

1. **Clone the repository**

   ```sh
   git clone https://github.com/your-username/nordmatchai.git
   cd nordmatchai
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure Supabase**

   - Copy `.env.example` to `.env` and fill in your Supabase project URL and anon key:

     ```
     VITE_SUPABASE_URL=your_supabase_url_here
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     VITE_FOOTBALL_DATA_API_KEY=your_football_api_key_here
     VITE_WEATHER_API_KEY=your_openweather_api_key_here
     VITE_NEWS_API_KEY=your_news_api_key_here
     ```

4. **Get API Keys**

   - **Football Data**: Sign up at [API-Football](https://www.api-football.com/) for match data
   - **Weather Data**: Get a free key from [OpenWeatherMap](https://openweathermap.org/api)
   - **News Data**: Register at [NewsAPI](https://newsapi.org/) for team news

4. **Run the development server**

   ```sh
   npm run dev
   ```

5. **Build for production**

   ```sh
   npm run build
   ```

## Project Structure

See the [project structure](project/) for details.

## Database

- Supabase schema with comprehensive data structure
- Real-time match synchronization from external APIs
- Advanced prediction storage with detailed analysis
- User profiles and personalized watchlists

## API Integration

The app integrates with multiple data sources:

- **API-Football**: Live match data, team statistics, player information
- **OpenWeatherMap**: Weather conditions for match venues
- **NewsAPI**: Latest team news and expert analysis
- **Custom AI Engine**: 50+ criteria prediction analysis

## License

MIT

---

**Predictions are for informational purposes only.**