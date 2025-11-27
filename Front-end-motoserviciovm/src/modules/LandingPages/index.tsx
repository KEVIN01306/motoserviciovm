import LandingAppBar from './components/LandingAppBar';
import Carousel from './components/Carousel';
import ServicePackageCard from './components/ServicePackageCard';
import DiagnosticAI from './components/DiagnosticAI';
import NosotrosSection from './components/NosotrosSection';
import BookingForm from './components/BookingForm';
import LandingFooter from './components/LandingFooter';

// --- Configuración de Colores de Tailwind (MUI Palette Simulation) ---
// Primary: #1c1c1c (primary-dark), Secondary/Accent: #ff6600 (accent-orange), Background: #f7f7f7 (light-gray)

// Datos del Carrusel
const carouselSlides = [
    { 
        id: 1, 
        headline: "¡Potencia tu Viaje!", 
        subtitle: "Mantenimiento y reparación profesional con la pasión que tu motocicleta merece.",
        promo: "PROMOCIÓN: 10% de descuento en tu primer servicio completo. ¡Válido solo este mes!",
        imgUrl: "https://placehold.co/1200x800/1c1c1c/ff6600?text=MOTOSERVICIO+VM" 
    },
    { 
        id: 2, 
        headline: "Diagnóstico de Precisión", 
        subtitle: "Tecnología avanzada para identificar fallas rápidamente y garantizar la seguridad.",
        promo: "¡Revisión de frenos gratis al agendar en línea!",
        imgUrl: "https://placehold.co/1200x800/222222/ffffff?text=DIAGNOSTICOS+AVANZADOS" 
    },
    { 
        id: 3, 
        headline: "Expertos en la Vía", 
        subtitle: "Nuestro equipo está listo para cualquier desafío, de motor a chasis.",
        promo: "Obtén un 20% de descuento en repuestos originales.",
        imgUrl: "https://placehold.co/1200x800/333333/ff6600?text=EXPERTOS+EN+MOTOS" 
    },
];

// Use new LandingAppBar component (keeps code split)
const MuiAppBar = LandingAppBar;

// Componente de Carrusel para el Banner
type Slide = { id: number; headline: string; subtitle: string; promo: string; imgUrl: string };

// ServicePackageCard and helper icon-button moved to components folder.


// TextField wrapper moved to components; `MuiTextField` alias points to it.

// Componente principal de la aplicación
const App = () => {
    // Minimal orchestration: service packages used by ServicePackageCard components
    const servicePackages = [
        {
            name: 'Servicio Menor',
            description: 'Mantenimiento preventivo esencial para el día a día. Ideal para kilometrajes bajos.',
            isMajor: false,
            items: [
                'Cambio de aceite de motor (sintético o mineral, a elección).',
                'Reemplazo de filtro de aceite.',
                'Chequeo de niveles de líquidos (frenos, refrigerante).'
            ]
        },
        {
            name: 'Servicio Mayor',
            description: 'Revisión completa y profundo ajuste para garantizar rendimiento y seguridad a largo plazo.',
            isMajor: true,
            items: ['Todos los puntos incluidos en el Servicio Menor.', 'Cambio de bujías', 'Revisión completa del sistema de frenos.']
        }
    ];

    const sectionTitleClass = "text-4xl sm:text-5xl font-extrabold mb-12 relative pb-2 text-primary-dark after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-accent-orange after:rounded-full";

    // Sections for app bar / drawer navigation
    const sections = [
        { name: 'Servicios', href: '#servicios' },
        { name: 'Diagnóstico AI', href: '#diagnostico' },
        { name: 'Nosotros', href: '#nosotros' },
        { name: 'Cita', href: '#contacto' },
    ];

    // App orchestration only — interactive pieces live in child components


    return (
        <div className="font-sans text-primary-dark min-h-screen flex flex-col bg-light-gray">
            {/* Definición de animaciones CSS en línea para simular efectos MUI */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-down {
                    animation: slideDown 0.3s ease-out forwards;
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.3s ease-out forwards;
                }
            ` }} />

            <MuiAppBar sections={sections} />

            {/* 1. Carrusel (Hero Section) */}
            <Carousel slides={carouselSlides} />

            {/* 2. Sección de Servicios (ACTUALIZADA con ServicePackageCard) */}
            <section id="servicios" className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className={`${sectionTitleClass} text-primary-dark`}>Nuestros Planes de Servicio</h2>
                    
                    {/* MUI Grid Layout para Paquetes de Servicio */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {servicePackages.map((pkg, index) => (
                            <ServicePackageCard 
                                key={index}
                                serviceName={pkg.name}
                                description={pkg.description}
                                items={pkg.items}
                                isMajor={pkg.isMajor}
                            />
                        ))}
                    </div>
                </div>

                <DiagnosticAI />
            </section>
            <NosotrosSection />

            <BookingForm />

            <LandingFooter />
        </div>
    );
};

export default App;