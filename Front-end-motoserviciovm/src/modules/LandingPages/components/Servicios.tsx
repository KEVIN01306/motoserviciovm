import {MotoServiceCard} from "./MotoServiceCard";
import type{ MotoServiceData } from "./MotoServiceCard";
import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";

type ServiciosProps = {
    services: MotoServiceData[];
    loading?: boolean;
    loadingTextos?: boolean;
    descripcion?: string;
};

const ServiceCardSkeleton = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-sm w-full bg-white dark:bg-[#0a0a0a] border-2 border-zinc-200 dark:border-zinc-800 rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-xl dark:shadow-[0_0_30px_rgba(220,38,38,0.15)] h-full flex flex-col"
    >
        <div className="w-full h-2.5 bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
        <div className="p-8 flex-grow">
            <div className="flex justify-between items-center mb-8">
                <Skeleton variant="circular" width={48} height={48} sx={{ backgroundColor: "red" }} />
                <div className="text-right">
                    <Skeleton variant="text" width={100} height={24} sx={{ backgroundColor: "red" }} />
                </div>
            </div>
            <div className="space-y-3">
                <Skeleton variant="text" width="100%" height={48} sx={{ backgroundColor: "white" }} />
                <Skeleton variant="text" width="100%" height={60} sx={{ backgroundColor: "rgba(229, 231, 235, 0.7)" }} />
            </div>
            <div className="mt-8 space-y-4">
                <Skeleton variant="text" width="80%" height={20} sx={{ backgroundColor: "rgba(229, 231, 235, 0.7)" }} />
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} variant="text" width="100%" height={20} sx={{ backgroundColor: "rgba(229, 231, 235, 0.7)" }} />
                    ))}
                </div>
            </div>
        </div>
        <div className="p-8 pt-0">
            <Skeleton variant="rounded" width="100%" height={56} sx={{ backgroundColor: "rgba(229, 231, 235, 0.7)" }} />
        </div>
    </motion.div>
);

const Servicios = ({ services, loading, loadingTextos, descripcion }: ServiciosProps) => {
    const isLoading = loading;

    return (
        <>
        <section id="servicios" className="py-24 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-5xl font-black italic uppercase tracking-tighter mb-12"
                    >
                        PLANES DE <span className="text-red-600">SERVICIO</span>
                    </motion.h2>

                    <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] text-start mb-12" 
                        >
                            {loadingTextos ? <Skeleton width="100%" /> : descripcion}
                        </motion.p>
                    <div className="grid md:grid-cols-2 gap-8 place-items-center">
                        {isLoading ? (
                            <>
                                <ServiceCardSkeleton />
                                <ServiceCardSkeleton />
                            </>
                        ) : (
                            services.map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.2 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                >
                                    <MotoServiceCard data={s} />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Servicios;