import { useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import { Menu, X } from "lucide-react";

type MenuLink = {
    name: string;
    href: string;
    icon: React.ReactNode;
}

const ControlesFlotantes = ({ menuLinks }: { menuLinks: MenuLink[] }) => {

    const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
    return (
        <>
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
        </>
    );
}

export default ControlesFlotantes;