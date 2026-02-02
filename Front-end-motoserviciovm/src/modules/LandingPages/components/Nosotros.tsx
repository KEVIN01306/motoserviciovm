import NutDecoration from "./NutDecoration";
import { Skeleton } from "@mui/material";

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
                        <div className="space-y-6">
                            <NutDecoration size={32} />
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter">MÁS DE <span className="text-red-600">10 AÑOS</span> EXPERIENCIA</h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-4 border-yellow-500 pl-6">
                                Líderes en mecánica preventiva y correctiva para todo tipo de motocicletas. Calidad garantizada en cada ajuste.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {loading ? (
                                <>
                                    <Skeleton variant="rounded" width="100%" height={280} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                                    <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)", marginTop: "24px" }} />
                                    <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)", marginTop: "24px" }} />
                                    <Skeleton variant="rounded" width="100%" height={280} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                                </>
                            ) : aboutImages ? (
                                aboutImages.map((img, index) => (
                                    <img key={index} src={img.image} className="rounded-2xl border-2 border-white dark:border-zinc-800 shadow-lg" alt={`Nosotros ${index + 1}`} />
                                ))
                            ) : null}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {loadingValores ? (
                            <>
                                <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                                <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                                <Skeleton variant="rounded" width="100%" height={200} sx={{ backgroundColor: "rgba(229, 231, 235, 0.4)" }} />
                            </>
                        ) : (
                            values.map((v, i) => (
                                <div key={i} className="bg-white dark:bg-black p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-red-600 transition-all group">
                                    <div className="mb-4 bg-zinc-100 dark:bg-zinc-900 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {v.icon}
                                    </div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">{v.title}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{v.desc}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Nosotros;