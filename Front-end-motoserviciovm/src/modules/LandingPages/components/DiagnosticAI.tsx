import React, { useState } from 'react';
import { Loader2, Send, Cpu } from 'lucide-react';
import { postAIDiagnostic } from '../../../services/ai.services';

const DiagnosticAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setDiagnosis(null);

    let attempts = 0;
    while (attempts < 5) {
      try {
        const data = await postAIDiagnostic({ text: query });
        if (data && (data as any).diagnosis) {
          setDiagnosis((data as any).diagnosis);
          break;
        } else {
          setDiagnosis('Lo sentimos, la IA no pudo generar un diagnóstico. Por favor, sé más específico o contáctanos directamente.');
          break;
        }
      } catch (err) {
        attempts++;
        await new Promise((r) => setTimeout(r, Math.pow(2, attempts) * 1000));
      }
    }

    setLoading(false);
  };

  return (
    <section id="diagnostico" className="py-24 bg-zinc-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white mb-4">
            DIAGNÓSTICO <span className="text-red-600 underline decoration-yellow-500">IA</span>
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Escaneo técnico asistido</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleDiagnose} className="space-y-6">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe el fallo de tu moto..."
              className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 text-zinc-900 dark:text-white outline-none focus:border-red-600 transition-all min-h-[120px]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase italic text-xl"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              {loading ? 'Analizando...' : 'Diagnosticar'}
            </button>
          </form>

          {diagnosis && (
            <div className="mt-10 p-8 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h4 className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-black uppercase text-lg mb-4 italic"><Cpu size={24} /> Resultado</h4>
              <div className="text-zinc-700 dark:text-zinc-300 italic border-l-4 border-red-600 pl-6 whitespace-pre-line">{diagnosis}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiagnosticAI;
