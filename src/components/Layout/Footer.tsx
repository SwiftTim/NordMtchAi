import React from 'react';
import { Brain, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">NordMatchAI</h3>
                <p className="text-xs text-gray-400">Powered by AI</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              AI-powered football match predictions for Nordic countries and Netherlands,
              backed by trusted local sports coverage.
            </p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Mail className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Countries</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>🇩🇰 Denmark</li>
              <li>🇸🇪 Sweden</li>
              <li>🇳🇴 Norway</li>
              <li>🇫🇮 Finland</li>
              <li>🇳🇱 Netherlands</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>AI Predictions</li>
              <li>Match Insights</li>
              <li>Real-time Updates</li>
              <li>Expert Analysis</li>
              <li>Mobile Alerts</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
              <li>Disclaimer</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            © 2025 NordMatchAI. All rights reserved. Predictions are for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}