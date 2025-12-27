import React from 'react';

/**
 * Componente LoadingMoto
 * Un cargador animado que muestra una motocicleta en movimiento.
 * Incluye efectos de vibración sutil (temblor), viento, rines giratorios 
 * y una animación de "caballito" (wheelie).
 */
const LoadingMoto = () => {
  return (
    <div className="flex items-center justify-center  overflow-hidden">
      <style>
        {`
          /* Animación de vibración/temblor discreto */
          @keyframes motoVibration {
            0% { transform: translateY(-2px); }
            50% { transform: translateY(1px); }
            100% { transform: translateY(-2px); }
          }

          /* Animación de Caballito (Wheelie) - Basado en tus ajustes */
          @keyframes wheelie {
            0%, 40%, 100% { 
              transform: rotate(0deg) translateY(0) translateX(0px); 
            }
            60% { 
              transform: rotate(-15deg) translateY(-0px); 
            }
            70% { 
              transform: rotate(-30deg) translateY(5px) translateX(10px); 
            }
            75% { 
              transform: rotate(0deg) translateY(0px) translateX(15px); 
            }
            90% { 
              transform: rotate(0deg) translateY(0px) translateX(70px); 
            }
          }

          @keyframes roadMoveBackwards {
            from { background-position: 80px 0; }
            to { background-position: 0 0; }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes speedMoveLeft {
            0% { transform: translateX(200px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-400px); opacity: 0; }
          }

          .tire-spin {
            animation: spin 0.2s linear infinite;
          }

          /* Capa de vibración discreta aplicada directamente al contenido */
          .moto-vibration-layer {
            animation: motoVibration 0.15s infinite ease-in-out;
          }

          /* Contenedor que maneja el caballito (basado en eje trasero) */
          .moto-main-container {
            animation: wheelie 4s infinite ease-in-out;
            transform-origin: bottom left; 
          }

          .road-animate::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, #f0f0f0 50%, transparent 100%);
            background-size: 80px 100%;
            animation: roadMoveBackwards 0.3s linear infinite;
          }

          .speed-line-animate {
            animation: speedMoveLeft 0.5s linear infinite;
          }
        `}
      </style>

      <div className="relative w-[400px] h-[250px] flex flex-col items-center justify-end">
        {/* Líneas de velocidad (viento en contra) */}
        <div className="speed-line-animate absolute h-[3px] bg-black/10 rounded-full w-[60px] top-[20%] right-[-200px]"></div>
        <div className="speed-line-animate absolute h-[3px] bg-black/10 rounded-full w-[100px] top-[45%] right-[-100px] [animation-delay:0.2s]"></div>
        <div className="speed-line-animate absolute h-[3px] bg-black/10 rounded-full w-[40px] top-[70%] right-[-150px] [animation-delay:0.1s]"></div>

        {/* Capa de Caballito */}
        <div className="moto-main-container relative w-[250px] h-[180px] z-10">
          
          {/* Capa de Temblor Discreto */}
          <div className="moto-vibration-layer w-full h-full relative">
            
            {/* Llanta Trasera */}
            <svg viewBox="0 0 40 40" className="tire-spin absolute w-[65px] h-[65px] bottom-[48px] left-[5px] z-[4]">
              <circle cx="20" cy="20" r="17" stroke="#1a1a1a" strokeWidth="5" fill="none" />
              <circle cx="20" cy="20" r="14" stroke="#444" strokeWidth="1" fill="none" />
              <path d="M20 5 L20 35 M5 20 L35 20 M10 10 L30 30 M30 10 L10 30" stroke="#1a1a1a" strokeWidth="2" />
              <circle cx="20" cy="20" r="4" fill="#1a1a1a" />
            </svg>

            {/* Llanta Delantera */}
            <svg viewBox="0 0 40 40" className="tire-spin absolute w-[65px] h-[65px] bottom-[48px] right-[18px] z-[6]">
              <circle cx="20" cy="20" r="17" stroke="#1a1a1a" strokeWidth="5" fill="none" />
              <circle cx="20" cy="20" r="14" stroke="#444" strokeWidth="1" fill="none" />
              <path d="M20 5 L20 35 M5 20 L35 20 M10 10 L30 30 M30 10 L10 30" stroke="#1a1a1a" strokeWidth="2" />
              <circle cx="20" cy="20" r="4" fill="#1a1a1a" />
            </svg>

            {/* Cuerpo de la Moto */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-242.349 -72.389 600 280" className="w-full h-auto relative z-[5] drop-shadow-md">
              <rect x="207.651" y="96.892" width="12" height="90" rx="6" fill="#ca8a04" opacity="0.8"/>
              <rect x="232.651" y="96.892" width="12" height="90" rx="6" fill="#ca8a04"/>
              
              <path d="M 210.426 -32.823 L 270.426 -42.823" stroke="#111827" strokeWidth="6" strokeLinecap="round"/>
              <path d="M 187.651 46.892 L 157.651 31.892" stroke="#111827" strokeWidth="6" strokeLinecap="round"/>
              <path d="M 175.91 -31.337 L 219.824 -43.399" stroke="#111827" strokeWidth="6" strokeLinecap="round" transform="matrix(-1, 0, 0, -1, 395.734, -74.736)"/>
              
              <path d="M -92.349 136.892 L 57.651 86.892 L 207.651 116.892 L 187.651 146.892 L 27.651 146.892 L -92.349 136.892 Z" fill="#111827"/>
              
              <path d="M 27.651 36.892 C 127.651 6.892 247.651 36.892 307.651 86.892 L 257.651 126.892 C 207.651 96.892 127.651 86.892 27.651 106.892 L 27.651 36.892 Z" fill="#c81e1e"/>
              <path d="M 47.191 9.092 C 119.227 -18.395 205.673 9.092 248.896 54.904 L 212.877 91.554 C 176.858 64.067 119.227 54.904 47.191 73.229 L 47.191 9.092 Z" fill="#c81e1e"/>
              
              <path d="M -112.35 96.892 L -12.349 56.892 L 27.651 106.892 L -92.349 136.892 L -112.35 96.892 Z" fill="#b91c1c"/>
              <path d="M 243.877 7.829 L 298.123 43.985 L 319.822 -1.21 L 254.727 -28.328 L 243.877 7.829 Z" fill="#b91c1c"/>
              <path d="M 191.353 -13.88 L 286.064 44.626 L 323.949 -28.506 L 210.296 -72.389 L 191.353 -13.88 Z" fill="#b91c1c" transform="matrix(-1, 0, 0, -1, 515.302, -27.763)"/>
              
              <path d="M -36.905 43.37 L 41.957 43.37 L 22.241 74.793 L -56.62 74.793 L -36.905 43.37 Z" fill="#111827"/>
              <path d="M -142.88 64.703 L -102.88 49.703 L -62.883 64.703 L -82.883 74.703 L -142.88 64.703 Z" fill="#991b1b"/>
              
              <text x="80.104" y="76.269" fontSize="44" fontWeight="900" fill="white" fontFamily="Arial, Helvetica, sans-serif">73</text>
            </svg>
          </div>
        </div>  
        
        {/* Carretera */}
        <div className="road-animate relative bottom-[55px] w-[300px] h-[6px] bg-[#282828] rounded-full overflow-hidden"></div>
        <div className="relative flex bottom-[45px] w-[280px] h-[4px] bg-white/70 rounded-full justify-center"
        > <p>CARGANDO...</p></div>
      </div>
    </div>
  );
};

export default LoadingMoto;