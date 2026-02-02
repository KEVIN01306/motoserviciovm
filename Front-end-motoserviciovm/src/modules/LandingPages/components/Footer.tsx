import { CircularProgress } from "@mui/material";
import DynamicLogo from "./DynamicLogo";

type FooterProps = {
    logoText?: string;
    descripcion?: string;
    loading?: boolean;
}

const Footer = ({ logoText = "MOTOSERVICIO VM", descripcion = "© 2024 MOTO SERVICIO VM. RACING SPIRIT.", loading }: FooterProps) => {
    return (
        <>
            {/* Footer */}
            <footer className="py-12 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <a className="text-2xl font-black italic tracking-tighter group">
                        {
                            loading ? <CircularProgress /> :
                                <DynamicLogo text={logoText} />
                        }
                    </a>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{loading ? <CircularProgress size={14} /> : descripcion}</p>
                </div>
            </footer>
        </>
    );
}

export default Footer;