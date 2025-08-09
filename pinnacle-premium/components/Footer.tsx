
import React, { useState } from 'react';
import { TwitterIcon, LinkedinIcon, TelegramIcon } from './icons';
import Modal from './Modal';

const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const legalContent = {
    disclaimer: {
      title: 'Disclaimer',
      content: 'All information on this platform is for educational and informational purposes only. It does not constitute financial advice. Investing involves risk, including the possible loss of principal. Please consult with a qualified financial professional before making any investment decisions.'
    },
    terms: {
      title: 'Terms of Service',
      content: 'By using Pinnacle Premium Exchange, you agree to our terms and conditions. These include limitations on liability, arbitration of disputes, and your responsibilities as a user. Full terms are available upon request.'
    },
    privacy: {
      title: 'Privacy Policy',
      content: 'We are committed to protecting your privacy. We do not sell your personal data. This policy outlines what data we collect and how it is used to provide our services and secure your account. Full policy is available upon request.'
    }
  }

  const showModal = (type: 'disclaimer' | 'terms' | 'privacy') => {
    setModalContent(legalContent[type]);
  }

  return (
    <>
      <footer className="bg-gray-800/50 backdrop-blur-md text-white">
        <div className="container mx-auto py-8 px-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                📈 Pinnacle Premium Exchange
              </div>
              <p className="text-sm text-gray-400 mt-1">Building a legacy of wealth and purpose.</p>
            </div>
            <div className="flex gap-6">
              <a href="#!" aria-label="Twitter" className="text-gray-500 cursor-not-allowed"><TwitterIcon className="w-6 h-6" /></a>
              <a href="#!" aria-label="LinkedIn" className="text-gray-500 cursor-not-allowed"><LinkedinIcon className="w-6 h-6" /></a>
              <a href="#!" aria-label="Telegram" className="text-gray-500 cursor-not-allowed"><TelegramIcon className="w-6 h-6" /></a>
            </div>
          </div>
          <hr className="my-6 border-gray-700" />
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Pinnacle Premium Exchange. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <button onClick={() => showModal('disclaimer')} className="hover:text-white transition-colors">Disclaimer</button>
              <button onClick={() => showModal('terms')} className="hover:text-white transition-colors">Terms of Service</button>
              <button onClick={() => showModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            </div>
          </div>
        </div>
      </footer>
      <Modal isVisible={!!modalContent} onClose={() => setModalContent(null)}>
        <h2 className="text-2xl font-bold mb-4">{modalContent?.title}</h2>
        <p className="text-gray-600">{modalContent?.content}</p>
      </Modal>
    </>
  );
};

export default Footer;
