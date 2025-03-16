import React from 'react';
import { Shield } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-purple-800 mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold text-white">Resell T Project</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="text-gray-400">© {currentYear} Resell T Project. Todos os direitos reservados.</div>
            <div className="text-gray-500 text-sm mt-1">Criado e mantido por SSH T Project</div>
          </div>
        </div>
      </div>
    </footer>
  );
}