import React from 'react';

const NosotrosSection: React.FC = () => {
  const sectionTitleClass = "text-4xl sm:text-5xl font-extrabold mb-12 relative pb-2 text-primary-dark after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:bg-accent-orange after:rounded-full";

  return (
    <section id="nosotros" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 grid grid-cols-2 gap-4 rounded-xl overflow-hidden shadow-2xl">
            <img className="w-full h-full object-cover aspect-square rounded-lg" src="https://placehold.co/400x400/1c1c1c/ff6600?text=MOTOR" alt="Motor" />
            <img className="w-full h-full object-cover aspect-square rounded-lg" src="https://placehold.co/400x400/333333/ffffff?text=MECANICO" alt="Mecánico" />
            <img className="w-full h-full object-cover aspect-square rounded-lg" src="https://placehold.co/400x400/555555/ffffff?text=HERRAMIENTAS" alt="Herramientas" />
            <img className="w-full h-full object-cover aspect-square rounded-lg" src="https://placehold.co/400x400/ff6600/1c1c1c?text=CALIDAD" alt="Calidad" />
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <h2 className={`${sectionTitleClass} text-center md:text-left mx-auto md:mx-0 after:bg-primary-dark`}>Más de 10 Años de Pasión</h2>
            <p className="text-lg text-gray-700 leading-relaxed">En <strong>MOTO SERVICIO VM</strong>, no solo reparamos motocicletas, compartimos tu pasión por la carretera. Desde 2014, hemos crecido hasta convertirnos en el centro de servicio de confianza de la comunidad.</p>
            <p className="text-lg text-gray-700 leading-relaxed">Nuestro equipo de mecánicos certificados se especializa en todas las marcas y modelos, utilizando solo repuestos originales y la tecnología de diagnóstico más avanzada.</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 pt-2 ml-4">
              <li>Servicio honesto y transparente.</li>
              <li>Garantía en todas nuestras reparaciones.</li>
              <li>Comprometidos con la calidad y tu seguridad.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NosotrosSection;
