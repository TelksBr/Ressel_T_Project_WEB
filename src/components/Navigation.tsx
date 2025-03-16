import React, { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToPlans = () => {
    const plansSection = document.getElementById('planos');
    plansSection?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-purple-900/80 border-b border-purple-800/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold text-white">Resell T Project</span>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-purple-400 transition"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={scrollToPlans}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
            >
              Começar Agora
            </button>
            <a 
              href="https://painel.reselltproject.store"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
            >
              Painel de Login
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <button 
              onClick={scrollToPlans}
              className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center"
            >
              Começar Agora
            </button>
            <a 
              href="https://painel.reselltproject.store"
              className="block w-full mt-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center"
            >
              Painel de Login
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}