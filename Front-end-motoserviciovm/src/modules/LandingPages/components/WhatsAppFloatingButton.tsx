import React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Tooltip from '@mui/material/Tooltip';

type Props = {
  phone?: string; // optional override
  message?: string; // optional override (raw text, will be encoded)
  className?: string;
};

const normalizePhone = (p?: string) => {
  if (!p) return '';
  return p.replace(/\D+/g, '').replace(/^\+/, '');
};

const WhatsAppFloatingButton: React.FC<Props> = ({ phone, message, className = '' }) => {
  // Prefer explicit prop, otherwise read from env vars
  const envPhone = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || '';
  const envMessage = (import.meta.env.VITE_WHATSAPP_MESSAGE as string) || 'Hola Motoservicio VM, quiero reservar una cita';

  const phoneValue = phone || envPhone || '50212345678';
  const messageValue = message || envMessage;

  const num = normalizePhone(phoneValue);
  const encoded = encodeURIComponent(messageValue);
  const href = num ? `https://wa.me/${num}?text=${encoded}` : `https://wa.me/?text=${encoded}`;

  return (
    <Tooltip title={'🏍️ Contáctanos'} arrow>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear por WhatsApp"
        className={`fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg transition-colors duration-150 ${className}`}
      >
        <WhatsAppIcon />
      </a>
    </Tooltip>
  );
};

export default WhatsAppFloatingButton;
