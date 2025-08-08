# NordMatchAI

NordMatchAI is an AI-powered football match prediction app focused on Nordic countries and the Netherlands. It provides expert insights, match predictions, and personalized watchlists, leveraging trusted local sports coverage.

## Features

- AI-generated match predictions for Denmark, Sweden, Norway, Finland, and Netherlands
- Country and league filtering
- Match search and filtering
- Detailed prediction analysis with feature importance and evidence
- Personalized watchlist with alerts
- Authentication (sign up/sign in)
- Responsive, production-ready UI built with React, Tailwind CSS, and Lucide icons

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
     ```

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

- Supabase schema and sample data are in [`supabase/migrations`](supabase/migrations/).
- Tables: `countries`, `teams`, `matches`, `profiles`, `predictions`, `watchlists`, etc.

## License

MIT

---

**Predictions are for informational purposes only.**
