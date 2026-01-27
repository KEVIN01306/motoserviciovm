import { useEffect, useState } from 'react';
import { Wrench, Calendar, Cpu,User,Home,ShieldCheck,Zap,Target,} from 'lucide-react';
import DiagnosticAI from './components/DiagnosticAI';
import Footer from './components/Footer';
import ControlesFlotantes from './components/ControlesFlotantes';
import Contacto from './components/Contacto';
import Nosotros from './components/Nosotros';
import Servicios from './components/Servicios';
import HeroSlider from './components/HeroSlider';
import Nav from './components/Nav';


const Index = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
      try {
        const s = localStorage.getItem('landing:theme');
        if (s) return s === 'dark';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        return true;
      }
    });

    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
      {
        image: "https://img.freepik.com/fotos-premium/motocicleta-antigua-taller-garaje-bien-organizado-herramientas-mantenimiento-bicicletas-clasicas-repai_1293074-50537.jpg",
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
        image: "https://images.pexels.com/photos/11536993/pexels-photo-11536993.jpeg?cs=srgb&dl=pexels-ali-huzeyfe-ermis-194760225-11536993.jpg&fm=jpg",
        tag: "CLIENTE NUEVO",
        promo: "REVISIÓN DE FRENOS GRATIS",
        subtitle: "En tu primera visita al taller"
      }
    ];
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
            
            <Nav isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} menuLinks={menuLinks} />
            
            <HeroSlider slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
            <Servicios services={services} />

            <Nosotros values={values} />

            <DiagnosticAI />

            <Contacto />

            <Footer />
            <ControlesFlotantes menuLinks={menuLinks} />
        </div>
    );
};

export default Index;