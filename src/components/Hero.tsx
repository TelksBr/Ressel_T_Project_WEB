import React from 'react';
import { ChevronRight, PlayCircle, DollarSign, Shield, Lock, LogIn } from 'lucide-react';

export function Hero() {
  const scrollToPlans = () => {
    const plansSection = document.getElementById('planos');
    plansSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Aplicativo para quem deseja ser <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">revendedor VPN</span> com qualidade elevada e preço acessível!
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Painel web fluido e otimizado, perfeito para gerenciar seus clientes. App leve e fluido, com suporte a SSH e V2Ray!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={scrollToPlans}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition transform hover:scale-105 flex items-center justify-center"
              aria-label="Ver planos disponíveis"
            >
              Começar Agora <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
            <a 
              href="https://play.google.com/store/apps/details?id=app.reselltproject" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-900/50 transition transform hover:scale-105 flex items-center justify-center"
              aria-label="Baixar aplicativo na Play Store"
            >
              <PlayCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              Download App
            </a>
            <a 
              href="painel.reselltproject.store" 
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition transform hover:scale-105 flex items-center justify-center"
              aria-label="Ir para o painel de login"
            >
              <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
              Login
            </a>
          </div>
        </div>
        <div className="relative mt-8 lg:mt-0" aria-hidden="true">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-6 sm:p-8 rounded-2xl border border-purple-700/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-purple-800/50 p-6 rounded-xl transform hover:scale-105 transition">
                <Shield className="h-12 w-12 text-purple-400 mb-4" />
                <h2 className="text-white font-bold mb-2">Sempre Atualizado</h2>
                <p className="text-gray-300 text-sm">Estamos sempre trabalhando para incluir os métodos mais recentes!</p>
              </div>
              <div className="bg-purple-800/50 p-6 rounded-xl transform hover:scale-105 transition">
                <Lock className="h-12 w-12 text-purple-400 mb-4" />
                <h2 className="text-white font-bold mb-2">Privacidade</h2>
                <p className="text-gray-300 text-sm">Navegação anônima garantida</p>
              </div>
            </div>
            <div className="mt-6 bg-purple-800/50 p-6 rounded-xl transform hover:scale-105 transition">
              <div className="flex items-center space-x-4">
                <DollarSign className="h-12 w-12 text-purple-400" />
                <div>
                  <p className="text-white font-bold text-2xl">Preços Acessíveis</p>
                  <p className="text-gray-300">A partir de R$ 3,00</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-600/20 blur-[100px] rounded-full"></div>
        </div>
      </div>
    </header>
  );
}