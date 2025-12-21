import React from 'react';

const sectionTitleClass = "text-4xl sm:text-5xl font-extrabold mb-12 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-20 after:h-1 after:rounded-full";

type Props = { theme?: 'light' | 'dark' };

const NosotrosSection: React.FC<Props> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';

  const bg = isDark ? 'var(--bg-darker)' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#0b0b0b';
  const subText = isDark ? '#e6e7ea' : '#374151';

  return (
    <section id="nosotros" className="py-16 sm:py-24" style={{ backgroundColor: bg, color: textColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 grid grid-cols-2 gap-4 rounded-xl overflow-hidden shadow-2xl">
            <img className="w-full h-full object-cover aspect-square rounded-lg" src="https://placehold.co/400x400/1c1c1c/ff6600?text=MOTOR" alt="Motor" />
            <img className="w-full h-full object-cover aspect-square rounded-lg" src="https://placehold.co/400x400/333333/ffffff?text=MECANICO" alt="Mecánico" />
            <img className="w-full h-full object-cover aspect-square rounded-lg" src="https://placehold.co/400x400/555555/ffffff?text=HERRAMIENTAS" alt="Herramientas" />
            <img className="w-full h-full object-cover aspect-square rounded-lg" src="https://placehold.co/400x400/ff6600/1c1c1c?text=CALIDAD" alt="Calidad" />
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <h2 className={`${sectionTitleClass} text-center md:text-left mx-auto md:mx-0`} style={{ color: textColor, position: 'relative' }}>
              Más de 10 Años de Pasión
              <span style={{ display: 'block', width: 80, height: 6, backgroundColor: 'var(--accent-yellow)', borderRadius: 6, margin: '8px auto 0 0' }} />
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: subText }}><strong>MOTO SERVICIO VM</strong>, no solo reparamos motocicletas, compartimos tu pasión por la carretera. Desde 2014, hemos crecido hasta convertirnos en el centro de servicio de confianza de la comunidad.</p>
            <p className="text-lg leading-relaxed" style={{ color: subText }}>Nuestro equipo de mecánicos certificados se especializa en todas las marcas y modelos, utilizando solo repuestos originales y la tecnología de diagnóstico más avanzada.</p>
            <ul className="list-disc list-inside space-y-2 pt-2 ml-4" style={{ color: isDark ? '#cbd5e1' : '#6b7280' }}>
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
