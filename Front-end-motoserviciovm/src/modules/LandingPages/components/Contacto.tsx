import { Bike, Calendar, Hash, MapPin, Send, Smartphone, User } from "lucide-react";



const Contacto = () => {
    return (
        <>
            <section id="contacto" className="py-24 bg-white dark:bg-black">
                <div className="max-w-4xl mx-auto px-4 bg-zinc-50 dark:bg-zinc-900 p-8 md:p-16 rounded-[3rem] border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">Reserva tu <span className="text-red-600">Cita</span></h2>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Atención inmediata sin esperas</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <input placeholder="Nombre Completo" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                </div>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <input type="tel" placeholder="Teléfono" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                </div>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <input type="date" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <input placeholder="Marca y Modelo" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                        <input placeholder="Placa" className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all" />
                                    </div>
                                    <select className="w-full bg-white dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all appearance-none">
                                        <option disabled selected>Motor</option>
                                        <option>Bajo cilindraje</option>
                                        <option>Medio cilindraje</option>
                                        <option>Alto cilindraje</option>
                                    </select>
                                </div>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600" size={18} />
                                    <select className="w-full bg-white dark:bg-black p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:border-red-600 dark:text-white transition-all appearance-none">
                                        <option>Sede Central</option>
                                        <option>Sede Norte</option>
                                        <option>Sede Sur</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button className="w-full bg-zinc-900 dark:bg-red-600 text-white font-black py-5 rounded-2xl uppercase italic text-xl hover:bg-red-600 dark:hover:bg-white dark:hover:text-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                            Confirmar Reserva <Send size={20} />
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Contacto;