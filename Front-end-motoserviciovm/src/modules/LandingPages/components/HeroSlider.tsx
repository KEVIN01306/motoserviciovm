import { ChevronRight, Tag } from "lucide-react";

type SlideProps = {
  image: string;
  tag: string;
  promo: string;
  subtitle: string;
};

const HeroSlider = ({ slides, currentSlide, setCurrentSlide }: { slides: SlideProps[]; currentSlide: number; setCurrentSlide: React.Dispatch<React.SetStateAction<number>> }) => {
    return (
        <>
        <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
                {slides.map((slide, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10"></div>
                    <img 
                        src={slide.image} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" 
                        alt="Hero background"
                    />
                    
                    <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
                        <div className={`transition-all duration-1000 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                          <div className="inline-flex items-center gap-3 bg-red-600 text-white px-4 py-2 rounded-lg font-black italic text-sm mb-6 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            <Tag size={16} />
                            {slide.tag}
                          </div>
                          
                          <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4 max-w-2xl text-white">
                            {slide.promo}
                          </h2>
                          
                          <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-10 border-l-4 border-yellow-500 pl-4">
                            {slide.subtitle}
                          </p>

                          <div className="flex flex-wrap gap-4">
                            <a href="#contacto" className="bg-white text-black font-black py-4 px-8 rounded-xl text-lg uppercase italic inline-flex items-center gap-4 hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95">
                                Agendar ahora <ChevronRight />
                            </a>
                            <a href="#servicios" className="bg-transparent border-2 border-white/20 hover:border-white text-white font-black py-4 px-8 rounded-xl text-lg uppercase italic inline-flex items-center gap-4 transition-all">
                                Ver Servicios
                            </a>
                          </div>
                        </div>
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                  {slides.map((_, i) => (
                    <button
                      aria-label={`Ir a la diapositiva ${i + 1}`}
                      key={i} 
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-12 bg-red-600' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                    />
                  ))}
                </div>
            </section>
        </>
    );
}

export default HeroSlider;