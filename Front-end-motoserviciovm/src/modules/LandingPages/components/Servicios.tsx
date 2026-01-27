import {MotoServiceCard} from "./MotoServiceCard";
import type{ MotoServiceData } from "./MotoServiceCard";

type ServiciosProps = {
    services: MotoServiceData[];
};

const Servicios = ({ services }: ServiciosProps) => {
    return (
        <>
                    <section id="servicios" className="py-24 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-12">
                        PLANES DE <span className="text-red-600">SERVICIO</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {services.map((s, i) => <MotoServiceCard key={i} data={s} />)}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Servicios;