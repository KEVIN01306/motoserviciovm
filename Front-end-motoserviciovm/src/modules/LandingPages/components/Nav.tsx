import { LogIn, Moon, Sun } from "lucide-react";


type NavProps = {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  menuLinks: { name: string; href: string }[];
}

const Nav = ({ isDarkMode, setIsDarkMode, menuLinks }: NavProps) => {
    return (
        <>
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
        </>
    );
}

export default Nav;