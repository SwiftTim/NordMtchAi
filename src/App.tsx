import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { AuthModal } from './components/Auth/AuthModal';
import { HomePage } from './components/Home/HomePage';
import { WatchlistPage } from './components/Watchlist/WatchlistPage';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header onAuthClick={() => setShowAuthModal(true)} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/insights" element={<div className="py-12 text-center">Insights page coming soon!</div>} />
            <Route path="/settings" element={<div className="py-12 text-center">Settings page coming soon!</div>} />
          </Routes>
        </main>
        
        <Footer />
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;