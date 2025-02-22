import React from 'react';

export function CallToAction() {
  return (
    <section className="container mx-auto px-6 py-16 text-center">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-white mb-6">Faça seu Teste Agora!</h2>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Experimente nosso serviço e descubra por que somos a escolha ideal para revendedores de VPN.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a href="painel.reselltproject.store/criarteste.php?token=157487657359" className="bg-white text-purple-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-bold">
            Criar Teste Grátis
          </a>
          <a href="painel.reselltproject.store/revenda.php?token=157487657359" className="bg-purple-900 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition font-bold">
            Assinar Agora
          </a>
        </div>
      </div>
    </section>
  );
}