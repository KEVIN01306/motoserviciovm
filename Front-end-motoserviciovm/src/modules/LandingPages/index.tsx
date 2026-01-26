import React, { useEffect, useState } from 'react';
import { 
  Wrench, 
  ChevronRight, 
  Calendar, 
  Cpu, 
  Sun, 
  Moon,
  Facebook,
  Instagram,
  MapPin,
  Phone,
  Send,
  Loader2,
  Settings,
  User,
  Hash,
  Bike,
  Smartphone,
  LogIn,
  Menu,
  X,
  Home,
  ShieldCheck,
  Zap,
  Target,
  ChevronLeft,
  Tag
} from 'lucide-react';
import { useGoTo } from '../../hooks/useGoTo';

import { postAIDiagnostic } from '../../services/ai.services';

/**
 * ICONO PERSONALIZADO: WhatsAppIcon
 */
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.439 5.662 1.439h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const NutDecoration = ({ size = 20, className = "" }) => (
  <Settings 
    size={size} 
    className={`inline-block text-yellow-500 dark:text-yellow-400 ${className}`} 
    style={{ strokeWidth: 3 }}
  />
);

const MotoServiceCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="max-w-sm w-full bg-white dark:bg-[#0a0a0a] border-2 border-zinc-200 dark:border-zinc-800 rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-xl dark:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-300 hover:border-red-600 group mx-auto h-full flex flex-col">
      <div className="flex h-1.5">
        <div className="w-2/3 bg-red-600"></div>
        <div className="w-1/3 bg-yellow-500"></div>
      </div>
      <div className="p-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-red-600 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
            <Wrench size={32} strokeWidth={2.5} />
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Categoría</span>
            <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded italic">
              {data.isMajor ? 'FULL TRACK' : 'CITY CHECK'}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">
            {data.name.split(' ')[0]} <span className="text-red-600">{data.name.split(' ')[1]}</span>
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed border-l-2 border-yellow-500 pl-4">
            {data.description}
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Inspección técnica:</p>
          <ul className="space-y-3">
            {data.items?.map((item, index) => (
              <li key={index} className="flex items-center space-x-3 group/item">
                <div className="h-1.5 w-1.5 bg-red-600 rounded-full group-hover/item:w-4 transition-all shrink-0"></div>
                <span className="text-sm text-zinc-700 dark:text-zinc-200 font-medium leading-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="p-8 pt-0">
        <a href="#contacto" className="block w-full text-center group/btn relative overflow-hidden bg-zinc-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-xl transition-transform active:scale-95">
          <span className="relative z-10 flex items-center justify-center space-x-2 uppercase italic tracking-tighter text-lg">
            <span>Agendar ahora</span>
            <ChevronRight className="h-5 w-5" />
          </span>
        </a>
      </div>
    </div>
  );
};

const DiagnosticAI = () => {
  const [query, setQuery] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setDiagnosis(null);
    
    let attempts = 0;
    while (attempts < 5) {
      try {
        const data = await postAIDiagnostic({ text: query });
        if (data && (data as any).diagnosis) {
          setDiagnosis((data as any).diagnosis);
          break;
        } else {
          setDiagnosis('Lo sentimos, la IA no pudo generar un diagnóstico. Por favor, sé más específico o contáctanos directamente.');
          break;
        }
      } catch (err) {
        attempts++;
        await new Promise(r => setTimeout(r, Math.pow(2, attempts) * 1000));
      }
    }
    setLoading(false);
  };

  return (
    <section id="diagnostico" className="py-24 bg-zinc-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white mb-4">
            DIAGNÓSTICO <span className="text-red-600 underline decoration-yellow-500">IA</span>
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Escaneo técnico asistido</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleDiagnose} className="space-y-6">
            <textarea 
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe el fallo de tu moto..."
              className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 text-zinc-900 dark:text-white outline-none focus:border-red-600 transition-all min-h-[120px]"
            />
            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase italic text-xl">
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              {loading ? 'Analizando...' : 'Diagnosticar'}
            </button>
          </form>
          {diagnosis && (
            <div className="mt-10 p-8 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h4 className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-black uppercase text-lg mb-4 italic"><Cpu size={24} /> Resultado</h4>
              <div className="text-zinc-700 dark:text-zinc-300 italic border-l-4 border-red-600 pl-6 whitespace-pre-line">{diagnosis}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const App = () => {
    // Inicialización del estado basado en preferencia o localStorage
    const [isDarkMode, setIsDarkMode] = useState(() => {
      try {
        const s = localStorage.getItem('landing:theme');
        if (s) return s === 'dark';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        return true;
      }
    });
    const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
      {
        image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070&auto=format&fit=crop",
        tag: "PROMOCIÓN DE MES",
        promo: "15% OFF EN SERVICIO MAYOR",
        subtitle: "Aplica para motores de 250cc en adelante"
      },
      {
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop",
        tag: "COMBO RACING",
        promo: "2X1 EN CAMBIO DE ACEITE FULL SINTÉTICO",
        subtitle: "Válido únicamente los días martes y jueves"
      },
      {
        image: "https://images.unsplash.com/photo-1591152844535-ed5fa346f8e5?q=80&w=2070&auto=format&fit=crop",
        tag: "CLIENTE NUEVO",
        promo: "REVISIÓN DE FRENOS GRATIS",
        subtitle: "En tu primera visita al taller"
      }
    ];

    // Aplicación del tema en el DOM y persistencia en localStorage
    useEffect(() => {
      const root = window.document.documentElement;
      if (isDarkMode) {
        root.classList.add('dark');
        try { localStorage.setItem('landing:theme', 'dark'); } catch {}
      } else {
        root.classList.remove('dark');
        try { localStorage.setItem('landing:theme', 'light'); } catch {}
      }
    }, [isDarkMode]);

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }, [slides.length]);

    const services = [
        { name: 'Servicio Menor', description: 'Mantenimiento preventivo esencial para el día a día.', isMajor: false, items: ['Cambio de aceite', 'Filtro de aceite', 'Ajuste de cadena'] },
        { name: 'Servicio Mayor', description: 'Revisión total para máximo rendimiento y seguridad.', isMajor: true, items: ['Todo el Servicio Menor', 'Bujías Iridium', 'Limpieza inyectores', 'Frenos'] }
    ];

    const menuLinks = [
      { name: 'Inicio', href: '#', icon: <Home size={18}/> },
      { name: 'Servicios', href: '#servicios', icon: <Wrench size={18}/> },
      { name: 'Nosotros', href: '#nosotros', icon: <User size={18}/> },
      { name: 'Diagnóstico IA', href: '#diagnostico', icon: <Cpu size={18}/> },
      { name: 'Reservar', href: '#contacto', icon: <Calendar size={18}/> }
    ];

    const values = [
      { title: "Precisión", desc: "Cada ajuste se realiza bajo estándares de fábrica.", icon: <Target className="text-red-600" /> },
      { title: "Rapidez", desc: "Entendemos que tu moto es tu herramienta de vida.", icon: <Zap className="text-yellow-500" /> },
      { title: "Confianza", desc: "Transparencia total en repuestos y procesos.", icon: <ShieldCheck className="text-green-500" /> }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-500">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 h-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
                
                {/* Logo */}
                <a href="#" className="text-2xl font-black italic tracking-tighter group">
                  MOTOSERVICIO<span className="text-red-600 transition-colors group-hover:text-zinc-900 dark:group-hover:text-white">VM</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-10">
                  <div className="flex gap-8">
                    {menuLinks.slice(1).map((link) => (
                      <a 
                        key={link.name}
                        href={link.href} 
                        className="relative text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-600 transition-colors py-2 group"
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    ))}
                  </div>
                  
                  <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>

                  <div className="flex items-center gap-4">
                    {/* Botón de Tema Desktop */}
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-yellow-400 transition-all hover:scale-110 border border-zinc-200 dark:border-zinc-800 active:rotate-12"
                      title="Cambiar Modo"
                    >
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button className="flex items-center gap-2 px-5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:border-red-600 hover:text-white transition-all active:scale-95" onClick={() => window.location.href = '/public/auth/login-clientes'}>
                      <LogIn size={14} />
                      Acceso
                    </button>
                  </div>
                </div>

                {/* Mobile Icons */}
                <div className="flex lg:hidden items-center gap-4">
                   <button 
                     onClick={() => setIsDarkMode(!isDarkMode)} 
                     className="p-2 text-zinc-500 dark:text-yellow-400 bg-zinc-100 dark:bg-zinc-900 rounded-lg"
                   >
                     {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                   </button>
                   <button className="p-2 text-red-600" onClick={() => window.location.href = '/public/auth/login-clientes'}><LogIn size={20} /></button>
                </div>

              </div>
            </nav>

            {/* Hero Slider */}
            <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
                {slides.map((slide, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10"></div>
                    <img 
                        src={slide.image} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" 
                        alt="Hero background"
                    />
                    
                    <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
                        <div className={`transition-all duration-1000 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                          <div className="inline-flex items-center gap-3 bg-red-600 text-white px-4 py-2 rounded-lg font-black italic text-sm mb-6 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            <Tag size={16} />
                            {slide.tag}
                          </div>
                          
                          <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4 max-w-2xl text-white">
                            {slide.promo}
                          </h2>
                          
                          <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-10 border-l-4 border-yellow-500 pl-4">
                            {slide.subtitle}
                          </p>

                          <div className="flex flex-wrap gap-4">
                            <a href="#contacto" className="bg-white text-black font-black py-4 px-8 rounded-xl text-lg uppercase italic inline-flex items-center gap-4 hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95">
                                Agendar ahora <ChevronRight />
                            </a>
                            <a href="#servicios" className="bg-transparent border-2 border-white/20 hover:border-white text-white font-black py-4 px-8 rounded-xl text-lg uppercase italic inline-flex items-center gap-4 transition-all">
                                Ver Servicios
                            </a>
                          </div>
                        </div>
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                  {slides.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-12 bg-red-600' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                    />
                  ))}
                </div>
            </section>

            {/* Servicios */}
            <section id="servicios" className="py-24 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-12">
                        PLANES DE <span className="text-red-600">SERVICIO</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {services.map((s, i) => <MotoServiceCard key={i} data={s} />)}
                    </div>
                </div>
            </section>

            {/* Nosotros + Valores */}
            <section id="nosotros" className="py-24 bg-zinc-100 dark:bg-zinc-900 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                        <div className="space-y-6">
                            <NutDecoration size={32} />
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter">MÁS DE <span className="text-red-600">10 AÑOS</span> EXPERIENCIA</h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-4 border-yellow-500 pl-6">
                                Líderes en mecánica preventiva y correctiva para todo tipo de motocicletas. Calidad garantizada en cada ajuste.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <img src="https://img.freepik.com/foto-gratis/hombre-reparando-motocicleta-taller-moderno_158595-8083.jpg" className="rounded-2xl border-2 border-white dark:border-zinc-800 shadow-lg" alt="Mecánico" />
                            <img src="https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=400" className="rounded-2xl border-2 border-white dark:border-zinc-800 mt-6 shadow-lg" alt="Taller" />
                            <img src="https://i.pinimg.com/236x/37/ba/d8/37bad88093f8c00dafadff6e8cd94ad9.jpg" className="rounded-2xl border-2 border-white dark:border-zinc-800 mt-6 shadow-lg" alt="Taller" />
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm-rv6YFn2AVz9y00g6L2RcxMCgxGMrnrKyQ&s" className="rounded-2xl border-2 border-white dark:border-zinc-800 shadow-lg" alt="Mecánico" />

                            
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <div key={i} className="bg-white dark:bg-black p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-red-600 transition-all group">
                                <div className="mb-4 bg-zinc-100 dark:bg-zinc-900 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {v.icon}
                                </div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">{v.title}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <DiagnosticAI />

            {/* Contacto */}
            <section id="contacto" className="py-24 bg-white dark:bg-black">
                <div className="max-w-4xl mx-auto px-4 bg-zinc-50 dark:bg-zinc-900 p-8 md:p-16 rounded-[3rem] border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">Reserva tu <span className="text-red-600">Cita</span></h2>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Atención inmediata sin esperas</p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <input placeholder="Nombre Completo" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                </div>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <input type="tel" placeholder="Teléfono" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                </div>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <input type="date" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <input placeholder="Marca y Modelo" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                        <input placeholder="Placa" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                    </div>
                                    <select className="w-full bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all appearance-none">
                                        <option disabled selected>Motor</option>
                                        <option>Bajo cilindraje</option>
                                        <option>Medio cilindraje</option>
                                        <option>Alto cilindraje</option>
                                    </select>
                                </div>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <select className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all appearance-none">
                                        <option>Sede Central</option>
                                        <option>Sede Norte</option>
                                        <option>Sede Sur</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button className="w-full bg-zinc-900 dark:bg-red-600 text-white font-black py-5 rounded-2xl uppercase italic text-xl hover:bg-red-600 dark:hover:bg-white dark:hover:text-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                            Confirmar Reserva <Send size={20} />
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="text-2xl font-black italic">MOTOSERVICIO<span className="text-red-600">VM</span></span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">© 2024 MOTO SERVICIO VM. RACING SPIRIT.</p>
                </div>
            </footer>

            {/* --- CONTROLES FLOTANTES --- */}
            <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end gap-5">
                
                {/* Menú de Secciones Rápido */}
                <div className="relative flex flex-col items-end">
                    <div className={`flex flex-col items-end gap-3 mb-4 transition-all duration-300 transform ${isQuickMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}>
                        {menuLinks.map((link, idx) => (
                            <a 
                                key={idx}
                                href={link.href}
                                onClick={() => setIsQuickMenuOpen(false)}
                                className="group flex items-center justify-end gap-4"
                            >
                                <span className="bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 border border-zinc-800 dark:border-zinc-100">
                                    {link.name}
                                </span>
                                <div className="w-14 h-14 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-zinc-600 dark:text-white group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all shadow-xl">
                                    {link.icon}
                                </div>
                            </a>
                        ))}
                    </div>

                    <button 
                        onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl ${isQuickMenuOpen ? 'bg-zinc-900 dark:bg-white text-white dark:text-black rotate-90' : 'bg-red-600 text-white'}`}
                    >
                        {isQuickMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Botón WhatsApp */}
                <a 
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20consultar%20sobre%20los%20servicios%20de%20mantenimiento%20para%20mi%20motocicleta.`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-90 transition-all group relative border-4 border-white dark:border-black"
                >
                    <WhatsAppIcon size={32} />
                    <span className="absolute right-full mr-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-[10px] font-black py-2 px-5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none border-2 border-zinc-100 dark:border-zinc-800 translate-x-4 group-hover:translate-x-0">
                        Chat Soporte Técnico
                    </span>
                </a>
            </div>
        </div>
    );
};

export default App;