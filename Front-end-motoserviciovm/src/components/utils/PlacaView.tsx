/**
 * GuatemalaMotorcyclePlate
 * * Un componente que renderiza una placa de motocicleta de Guatemala 
 * con el formato oficial de la SAT (Azul/Blanco).
 * * @param {string} plate - El número de placa (ej: "742DVM"). 
 * La "M" se antepone automáticamente si no está presente.
 */
export const GuatemalaMotorcyclePlate = ({ plate = "" }) => {
  // Limpieza de datos: quitamos la "M" inicial si el usuario ya la pasó, para manejarla con su propio estilo
  const cleanPlate = plate.toUpperCase().replace(/^M\s?/, '').trim();
  
  return (
    <div className="inline-block select-none font-sans">
      {/* Cuerpo de la Placa (Proporciones 8x4 pulgadas aproximadas en escala) */}
      <div className="relative w-[340px] h-[190px] bg-[#FDFDFD] border-[16px] border-[#005293] rounded-[26px] shadow-xl flex flex-col items-center justify-between overflow-hidden">
        
        {/* Efecto de acabado reflectivo metálico */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-black/5 pointer-events-none"></div>
        
        {/* Encabezado: PAÍS */}
        <div className="w-full text-center pt-5 z-10">
          <h2 className="text-[#005293] font-[1000] text-[16px] tracking-[0.45em] leading-none">
            GUATEMALA
          </h2>
        </div>

        {/* Identificador Principal (Serie M + Correlativo) */}
        <div className="flex flex-row items-center justify-center flex-grow w-full z-10 px-10">
          {/* La 'M' distintiva de motocicleta en azul SAT */}
          <span className="text-[45px] font-[1000] text-[#005293] leading-none drop-shadow-[0.5px_0.5px_0px_rgba(0,0,0,0.1)] italic mr-4">
            M
          </span>
          
          {/* El número de placa en negro con efecto de relieve invertido */}
          <div className="flex items-center">
            <span className="text-[52px] font-[1000] text-[#1A1A1A] tracking-[0.02em] leading-none drop-shadow-[0px_1px_0px_rgba(255,255,255,0.8)]">
              {cleanPlate || "000AAA"}
            </span>
          </div>
        </div>

        {/* Pie de Placa: Región y Logo */}
        <div className="w-full flex justify-between items-end px-10 pb-6 z-10">
          {/* Logo SAT (Simulado) */}
          <div className="relative flex items-center justify-center w-7 h-7 border-[2px] border-[#005293] rounded-full bg-white/40">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-full h-[0.5px] bg-[#005293] rotate-45"></div>
              <div className="w-full h-[0.5px] bg-[#005293] -rotate-45"></div>
            </div>
            <span className="text-[7px] font-[1000] text-[#005293] z-10 uppercase">Sat</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-[#005293] font-black text-[10px] tracking-[0.25em] uppercase">
              Centroamérica
            </span>
          </div>

          {/* Espaciador invisible para centrado de texto inferior */}
          <div className="w-7"></div>
        </div>

        {/* Remaches de montaje (agujeros de los tornillos) */}
        <div className="absolute top-6 left-6 w-2.5 h-2.5 bg-[#CBD5E1] rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.3)] border border-gray-400/20"></div>
        <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-[#CBD5E1] rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.3)] border border-gray-400/20"></div>
        <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-[#CBD5E1] rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.3)] border border-gray-400/20"></div>
        <div className="absolute bottom-6 right-6 w-2.5 h-2.5 bg-[#CBD5E1] rounded-full shadow-[inset_1px_1px_1px_rgba(0,0,0,0.3)] border border-gray-400/20"></div>
        
        {/* Sutil relieve en el borde interno del marco azul */}
        <div className="absolute inset-[1px] border border-black/5 rounded-[24px] pointer-events-none"></div>
      </div>
    </div>
  );
};
export default GuatemalaMotorcyclePlate;