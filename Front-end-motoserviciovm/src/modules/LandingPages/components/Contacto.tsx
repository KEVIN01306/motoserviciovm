import { Bike, Calendar, Hash, Mail, Map, MapPin, Send, Smartphone, User } from "lucide-react";
import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import type { ContactoType } from "../../../types/contactoType";



const Contacto = ({ contacto, loading, loadingTextos, descripcion }: { contacto: ContactoType; loading: boolean; loadingTextos: boolean; descripcion?: string }) => {
    return (
        <>
            <section id="contacto" className="py-24 bg-white dark:bg-black">
                <div className="max-w-4xl mx-auto px-4 bg-zinc-50 dark:bg-zinc-900 p-8 md:p-16 rounded-[3rem] border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2"
                        >
                            Reserva tu <span className="text-red-600">Cita</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]"
                        >
                            {loadingTextos ? <Skeleton width="100%" /> : descripcion}
                        </motion.p>
                    </div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-6"
                        onSubmit={(e) => e.preventDefault()}
                    >
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
                    </motion.form>
                </div>
                {/* --- Contacto personal CONTACTO --- */}

                <div className="mt-16 pt-12 border-t-2 border-zinc-200 dark:border-zinc-800 grid md:grid-cols-3 gap-8">
                    {loading ? (
                        <>
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <Skeleton variant="circular" width={56} height={56} className="mb-4" sx={{ bgcolor: 'rgba(0,0,0,0.11)' }} />
                                    <Skeleton variant="text" width={80} height={20} className="mb-1" sx={{ bgcolor: 'rgba(0,0,0,0.11)' }} />
                                    <Skeleton variant="text" width={150} height={16} sx={{ bgcolor: 'rgba(0,0,0,0.11)' }} />
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <>
                            <motion.a
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contacto.direccion)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                    <Map className="text-zinc-600 dark:text-zinc-400 group-hover:text-white" size={24} />
                                </div>
                                <h4 className="font-black italic uppercase text-sm mb-1">Ubicación</h4>
                                <p className="text-zinc-500 font-bold text-xs whitespace-pre-line">
                                    {contacto.direccion}
                                </p>
                            </motion.a>

                            <motion.a
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                href={`mailto:${contacto.email}`}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                    <Mail className="text-zinc-600 dark:text-zinc-400 group-hover:text-white" size={24} />
                                </div>
                                <h4 className="font-black italic uppercase text-sm mb-1">Email</h4>
                                <p className="text-zinc-500 font-bold text-xs truncate w-full px-2">{contacto.email}</p>
                            </motion.a>

                            <motion.a
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true, margin: "-100px" }}
                                href={`tel:${contacto.telefono}`}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                                    <Smartphone className="text-zinc-600 dark:text-zinc-400 group-hover:text-white" size={24} />
                                </div>
                                <h4 className="font-black italic uppercase text-sm mb-1">Teléfono</h4>
                                <p className="text-zinc-500 font-bold text-xs">{contacto.telefono}</p>
                            </motion.a>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

export default Contacto;