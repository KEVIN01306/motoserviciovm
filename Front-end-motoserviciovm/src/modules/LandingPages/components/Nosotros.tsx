import NutDecoration from "./NutDecoration";
import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";

type NosotrosProp = {
    values: {
        icon: React.ReactNode;
        title: string;
        desc: string;
    }[];
    loading: boolean;
    aboutImages?: any[];
    loadingValores: boolean;
}

const Nosotros = ({ values, aboutImages, loading,loadingValores }: NosotrosProp) => {
    return (
        <>
        {/* Nosotros + Valores */}
            <section id="nosotros" className="py-24 bg-zinc-100 dark:bg-zinc-900 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="space-y-6"
                        >
                            <NutDecoration size={32} />
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="text-5xl font-black italic uppercase tracking-tighter"
                            >
                                MÁS DE <span className="text-red-600">10 AÑOS</span> EXPERIENCIA
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-4 border-yellow-500 pl-6"
                            >
                                Líderes en mecánica preventiva y correctiva para todo tipo de motocicletas. Calidad garantizada en cada ajuste.
                            </motion.p>
                        </motion.div>
                        <div className="grid grid-cols-2 gap-4">
                            {loading ? (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Skeleton variant="rounded" width="100%" height={280} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.1 }}
                                    >
                                        <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)", marginTop: "24px" }} />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                    >
                                        <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)", marginTop: "24px" }} />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                    >
                                        <Skeleton variant="rounded" width="100%" height={280} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                                    </motion.div>
                                </>
                            ) : aboutImages ? (
                                aboutImages.map((img, index) => (
                                    <motion.img
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        src={img.image}
                                        className="rounded-2xl border-2 border-white dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow"
                                        alt={`Nosotros ${index + 1}`}
                                    />
                                ))
                            ) : null}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {loadingValores ? (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                                </motion.div>
                            </>
                        ) : (
                            values.map((v, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -10, borderColor: "rgb(220, 38, 38)" }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="bg-white dark:bg-black p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-red-600 transition-all group"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        transition={{ duration: 0.3 }}
                                        className="mb-4 bg-zinc-100 dark:bg-zinc-900 w-12 h-12 rounded-xl flex items-center justify-center"
                                    >
                                        {v.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">{v.title}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{v.desc}</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Nosotros;