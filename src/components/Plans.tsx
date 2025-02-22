import React from 'react';
import { Info, Bot } from 'lucide-react';

export function Plans() {
  return (
    <section id="planos" className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Escolha seu Plano</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-purple-900/50 p-8 rounded-xl border border-purple-700/50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-white">Plano Mensal</h3>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Planos Pré-definidos</span>
          </div>
          <p className="text-gray-300 mb-6">
            Receba um limite para criar logins durante 30 dias. Maior flexibilidade para apagar e criar novos logins dentro do período contratado.
          </p>
          <div className="text-purple-400 font-bold text-xl mb-2">
            R$ 3,00 = 1 login
          </div>
          <div className="text-gray-300 text-sm mb-6">
            Mínimo de 2 logins por compra (R$ 6,00)
          </div>
          <div className="bg-purple-800/50 p-4 rounded-lg flex items-start space-x-3 mb-6">
            <Info className="h-5 w-5 text-purple-400 flex-shrink-0 mt-1" />
            <p className="text-gray-300 text-sm">
              Plano suportado apenas através do painel web
            </p>
          </div>
          <a 
            href="https://painel.reselltproject.store/revenda.php?token=157487657359"
            target="_blank"
            rel="noopener noreferrer" 
            className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center"
          >
            Ver Planos Mensais
          </a>
          <a 
            href="https://t.me/telks13"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center"
          >
            Entrar em Contato
          </a>
        </div>
        <div className="bg-purple-900/50 p-8 rounded-xl border border-purple-700/50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-white">Plano Crédito</h3>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Consulte-nos</span>
          </div>
          <p className="text-gray-300 mb-6">
            Receba créditos para criar logins. Cada crédito equivale a um login com limite específico. Créditos não são retornados ao apagar usuários.
          </p>
          <div className="text-purple-400 font-bold text-xl mb-2">
            R$ 5,00 = 1 crédito
          </div>
          <div className="text-gray-300 text-sm mb-6">
            Mínimo de 2 créditos por compra (R$ 10,00)
          </div>
          <div className="bg-purple-800/50 p-4 rounded-lg flex items-start space-x-3 mb-6">
            <Bot className="h-5 w-5 text-purple-400 flex-shrink-0 mt-1" />
            <p className="text-gray-300 text-sm">
              Plano suportado tanto no painel web quanto nos bots de gerenciamento
            </p>
          </div>
          <a 
            href="https://t.me/telks13"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center"
          >
            Entrar em Contato
          </a>
        </div>
      </div>
    </section>
  );
}