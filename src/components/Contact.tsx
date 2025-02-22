import React from 'react';
import { Send, Phone } from 'lucide-react';

export function Contact() {
  return (
    <section className="container mx-auto px-6 py-16 text-center">
      <h2 className="text-3xl font-bold text-white mb-8">Entre em Contato</h2>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Suporte via Telegram</h3>
          <a 
            href="https://t.me/telks13" 
            className="text-gray-300 hover:text-white transition flex items-center justify-center bg-purple-900/50 px-6 py-3 rounded-lg"
          >
            <Send className="h-6 w-6 mr-2" />
            @telks13
          </a>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Suporte via WhatsApp</h3>
          <a 
            href="tel:13997280020" 
            className="text-gray-300 hover:text-white transition flex items-center justify-center bg-purple-900/50 px-6 py-3 rounded-lg"
          >
            <Phone className="h-6 w-6 mr-2" />
            (13) 99728-0020
          </a>
        </div>
      </div>
      <div className="mt-12 bg-purple-900/30 p-6 rounded-xl max-w-2xl mx-auto">
        <p className="text-gray-300">
          Entre em contato conosco para:
          <br />• Contratar plano crédito
          <br />• Obter acesso ao bot de gerenciamento
          <br />• Tirar dúvidas sobre nossos serviços
        </p>
      </div>
    </section>
  );
}