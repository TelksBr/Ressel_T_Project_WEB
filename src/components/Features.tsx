import React from 'react';
import { Server, GamepadIcon, Globe, PlayCircle, Smartphone, Zap } from 'lucide-react';

export function Features() {
  return (
    <section className="container mx-auto px-6 py-16 bg-purple-900/30 rounded-3xl">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Recursos Inclusos</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex items-start space-x-4">
          <Server className="h-6 w-6 text-purple-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Servidor BR</h3>
            <p className="text-gray-300">Servidores de alta performance no Brasil</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <GamepadIcon className="h-6 w-6 text-purple-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Suporte Jogos</h3>
            <p className="text-gray-300">Otimizado para jogos online e chamadas</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <Globe className="h-6 w-6 text-purple-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">CloudFront</h3>
            <p className="text-gray-300">Suporte a CloudFront para melhor desempenho</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <PlayCircle className="h-6 w-6 text-purple-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Streaming</h3>
            <p className="text-gray-300">Perfeito para streaming de conteúdo</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <Smartphone className="h-6 w-6 text-purple-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">App na Play Store</h3>
            <p className="text-gray-300">Aplicativo oficial disponível para Android</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <Zap className="h-6 w-6 text-purple-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Sempre Atualizado</h3>
            <p className="text-gray-300">Métodos e sistemas sempre atualizados</p>
          </div>
        </div>
      </div>
    </section>
  );
}