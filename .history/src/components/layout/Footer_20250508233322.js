import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto">
      <div className="max-w-5xl mx-auto text-center">
        <p> {new Date().getFullYear()} App de Academia. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">Desenvolvido para ajudar você a alcançar seus objetivos fitness</p>
      </div>
    </footer>
  );
};

export default Footer;
