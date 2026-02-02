import { ChevronRight, Wrench } from "lucide-react";
import type { OpcionServicioType } from "../../../types/opcionServicioType";
import { Fragment } from "react/jsx-runtime";

export type MotoServiceData = {
  tipo: string;
  descripcion: string;
  isMajor?: boolean;
  opcionServicios: OpcionServicioType[];
};

export const MotoServiceCard = ({ data }: { data: MotoServiceData }) => {
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
            {(data.tipo || '').split(' ').filter(Boolean).map((word, i, arr) => (
              <Fragment key={i}>
                {i % 2 === 1 ? (
                  <span className="text-red-600">{word}</span>
                ) : (
                  <span>{word}</span>
                )}
                {i < arr.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed border-l-2 border-yellow-500 pl-4">
            {data.descripcion}
          </p>
        </div>
        <div className="mt-8 space-y-4 max-h-48 overflow-y-auto pr-2 opciones-scroll">
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Inspección técnica:</p>
          <ul className="space-y-3">
            {data.opcionServicios?.map((item, index) => (
              <li key={index} className="flex items-center space-x-3 group/item">
                <div className="h-1.5 w-1.5 bg-red-600 rounded-full group-hover/item:w-4 transition-all shrink-0"></div>
                <span className="text-sm text-zinc-700 dark:text-zinc-200 font-medium leading-tight">{item.opcion}</span>
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
