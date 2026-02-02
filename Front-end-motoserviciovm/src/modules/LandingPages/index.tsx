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
import { getTipos } from '../../services/tipoServicio.services';
import { getSlides } from '../../services/slide.services';
import { getAboutImages } from '../../services/aboutImage.services';
import { getValores } from '../../services/valor.services';
import { getContactos } from '../../services/contacto.services';
import type { ContactoType } from '../../types/contactoType';
import { getTextos } from '../../services/texto.services';
import type { TextoSchemaType } from '../../zod/texto.schema';

const URL_DOMAIN = import.meta.env.VITE_DOMAIN;

const iconMap: Record<string, React.ComponentType<any>> = {
  Wrench,
  Calendar,
  Cpu,
  User,
  Home,
  ShieldCheck,
  Zap,
  Target,
};

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
    const [serviciosTipos, setServiciosTipos] = useState<any[]>([]);
    const [loadingServicios, setLoadingServicios] = useState(true);
    const [slides, setSlides] = useState<any[]>([]);
    const [loadingSlides, setLoadingSlides] = useState(true);
    const [aboutImages, setAboutImages] = useState<any[]>([]);
    const [loadingAboutImages, setLoadingAboutImages] = useState(true);
    const [valores, setValores] = useState<any[]>([]);
    const [loadingValores, setLoadingValores] = useState(true);
    const [contacto, setContacto] = useState<ContactoType>({} as ContactoType);
    const [loadingContacto, setLoadingContacto] = useState(true);
    const [textos, setTextos] = useState<TextoSchemaType>({});
    const [loadingTextos, setLoadingTextos] = useState(true);

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

    const fecthServiciosTipos = async () => {
        try{
          setLoadingServicios(true);
          const serviciosResponse = await getTipos();
          setServiciosTipos(serviciosResponse.filter((servicio) => servicio.activo) || []);
        } catch (error) {
          console.error('Error fetching servicios tipos:', error);
        } finally {
          setLoadingServicios(false);
        }
    }

    const fetchAboutImages = async () => {
      try{
        setLoadingAboutImages(true);
        const aboutImagesResponse = await getAboutImages();
        setAboutImages(aboutImagesResponse.map((img) => ({...img, image: URL_DOMAIN + img.image})) || []);
      } catch (error) {
        console.error('Error fetching about images:', error);
      } finally {
        setLoadingAboutImages(false);
      }
    }

    const fetchSlides = async () => {
      try{
        setLoadingSlides(true);
        const slidesResponse = await getSlides();
        setSlides(slidesResponse.map((slide) => ({...slide, image: URL_DOMAIN + slide.image})) || []);
      } catch (error) {
        console.error('Error fetching slides:', error);
      } finally {
        setLoadingSlides(false);
      }
    }

    const fetchValores = async () => {
      try{
        setLoadingValores(true);
        const valoresResponse = await getValores();
        const transformedValores = valoresResponse.map((valor: any) => {
          const IconComponent = iconMap[valor.icon] || Target;
          return {
            title: valor.title,
            desc: valor.desc,
            icon: <IconComponent className={valor.color || 'text-red-600'} />
          };
        });
        setValores(transformedValores);
      } catch (error) {
        console.error('Error fetching valores:', error);
      } finally {
        setLoadingValores(false);
      }
    }

    const fetchContacto = async () => {
      try{
        setLoadingContacto(true);
        const contactoResponse = await getContactos();
        setContacto(contactoResponse[0] || null);
      } catch (error) {
        console.error('Error fetching contacto:', error);
      } finally {
        setLoadingContacto(false);
      }
    }

    const fetchTextos = async () => {
      try{
        setLoadingTextos(true);
        const textosResponse = await getTextos();
        setTextos(textosResponse[0] || {});
      } catch (error) {
        console.error('Error fetching textos:', error);
      } finally {
        setLoadingTextos(false);
      }
    }

    useEffect ( () => {
        fecthServiciosTipos();
        fetchSlides();
        fetchAboutImages();
        fetchValores();
        fetchContacto();
        fetchTextos();
    }, []);

    const menuLinks = [
      { name: 'Inicio', href: '#', icon: <Home size={18}/> },
      { name: 'Servicios', href: '#servicios', icon: <Wrench size={18}/> },
      { name: 'Nosotros', href: '#nosotros', icon: <User size={18}/> },
      { name: 'Diagnóstico IA', href: '#diagnostico', icon: <Cpu size={18}/> },
      { name: 'Reservar', href: '#contacto', icon: <Calendar size={18}/> }
    ];

    const defaultValues = [
      { title: "Precisión", desc: "Cada ajuste se realiza bajo estándares de fábrica.", icon: <Target className="text-red-600" /> },
      { title: "Rapidez", desc: "Entendemos que tu moto es tu herramienta de vida.", icon: <Zap className="text-yellow-500" /> },
      { title: "Confianza", desc: "Transparencia total en repuestos y procesos.", icon: <ShieldCheck className="text-green-500" /> }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-500">
            
            <Nav isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} menuLinks={menuLinks} loading={loadingTextos} logoText={textos.logoTitle ? String(textos.logoTitle) : undefined} />
            
            <HeroSlider  slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} loading={loadingSlides}/>
            <Servicios services={serviciosTipos} loading={loadingServicios} loadingTextos={loadingTextos} descripcion={textos.textoServicio ? String(textos.textoServicio) : undefined} />

            <Nosotros loadingTextos={loadingTextos} descripcion={textos.textoAbout ? String(textos.textoAbout) : undefined} values={loadingValores ? defaultValues : valores} aboutImages={aboutImages} loading={loadingAboutImages} loadingValores={loadingValores} />

            <DiagnosticAI loading={loadingTextos} descripcion={textos.textoIA ? String(textos.textoIA) : undefined} />

            <Contacto contacto={contacto} loading={loadingContacto} loadingTextos={loadingContacto} descripcion={textos.textoCita ? String(textos.textoCita) : undefined} />

            <Footer logoText={textos.logoTitle ? String(textos.logoTitle) : undefined} descripcion={textos.footerText ? String(textos.footerText) : undefined} loading={loadingTextos} />
            <ControlesFlotantes menuLinks={menuLinks} contacto={contacto} loading={loadingContacto} />
        </div>
    );
};

export default Index;