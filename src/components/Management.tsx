import React from 'react';
import { Phone, Globe, Info, Send } from 'lucide-react';

export function Management() {
  return (
    <section className="container mx-auto px-6 py-16 bg-purple-900/30 rounded-3xl">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Gerenciamento Simplificado</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-purple-800/50 p-8 rounded-xl text-center">
          <Phone className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-4">WhatsApp Bot</h3>
          <p className="text-gray-300">Gerencie seus clientes diretamente pelo WhatsApp</p>
          <div className="mt-4 bg-purple-700/50 p-3 rounded-lg">
            <p className="text-sm text-purple-200">
              <Info className="h-4 w-4 inline mr-1" />
              Disponível apenas na modalidade crédito
            </p>
          </div>
        </div>
        <div className="bg-purple-800/50 p-8 rounded-xl text-center">
          <Send className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-4">Telegram Bot</h3>
          <p className="text-gray-300">Gerencie seus clientes diretamente pelo Telegram</p>
          <div className="mt-4 bg-purple-700/50 p-3 rounded-lg">
            <p className="text-sm text-purple-200">
              <Info className="h-4 w-4 inline mr-1" />
              Disponível apenas na modalidade crédito
            </p>
          </div>
        </div>
        <div className="bg-purple-800/50 p-8 rounded-xl text-center">
          <Globe className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-4">Painel Web</h3>
          <p className="text-gray-300">Interface web completa e intuitiva</p>
          <div className="mt-4 bg-purple-700/50 p-3 rounded-lg">
            <p className="text-sm text-purple-200">
              <Info className="h-4 w-4 inline mr-1" />
              Disponível em todas as modalidades
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}