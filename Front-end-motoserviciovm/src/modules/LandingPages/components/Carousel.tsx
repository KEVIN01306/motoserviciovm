import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useGoTo } from '../../../hooks/useGoTo';

type Slide = { id: number; headline: string; subtitle: string; promo?: string; imgUrl: string };

const Carousel: React.FC<{ slides: Slide[] }> = ({ slides }) => {
    const goto = useGoTo();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4500);
    return () => clearInterval(iv);
  }, [slides.length]);

  const prev = () => setCurrent(c => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent(c => (c === slides.length - 1 ? 0 : c + 1));

  const s = slides[current];

const handleClick = (href: string) => {
    if (href.startsWith('/')) goto(href);
    else document.querySelector(href as any)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="banner" className="relative text-white flex items-center justify-center p-8 md:p-16 text-center overflow-hidden h-[70vh]">
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out" style={{ backgroundImage: `url('${s.imgUrl}')` }} />
      <div className="absolute inset-0 bg-black opacity-60" />

      <div className="relative max-w-4xl space-y-6 z-10 p-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">{s.headline}</h1>
        <p className="text-xl sm:text-2xl font-light">{s.subtitle}</p>
        <a onClick={() => handleClick('#contacto')} className="inline-block px-10 py-3 mt-6 text-lg font-bold rounded-lg shadow-xl text-white" style={{ backgroundColor: 'var(--accent-red, #c62828)' }}>Agenda tu Servicio Ahora</a>
        {
            s.promo && (
            <div className="mt-8 text-sm font-medium p-3 rounded-lg border-l-4" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'var(--accent-red, #c62828)' }}>{s.promo}</div>
            )
        }
      </div>

      <IconButton onClick={prev} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'white', display: { xs: 'none', md: 'inline-flex' } }}>
        <ChevronLeft />
      </IconButton>
      <IconButton onClick={next} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'white', display: { xs: 'none', md: 'inline-flex' } }}>
        <ChevronRight />
      </IconButton>

      <div className="absolute bottom-6 flex space-x-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full ${i === current ? 'scale-110' : ''}`} style={{ backgroundColor: i === current ? 'var(--accent-red, #c62828)' : 'rgba(255,255,255,0.5)' }} aria-label={`Ir a la diapositiva ${i + 1}`} />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
