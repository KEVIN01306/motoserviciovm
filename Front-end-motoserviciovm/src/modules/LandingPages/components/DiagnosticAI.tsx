import React, { useState } from 'react';
import MuiTextFieldWrapper from './MuiTextFieldWrapper';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import WrenchIcon from '@mui/icons-material/Build';
import BookOpenIcon from '@mui/icons-material/MenuBook';

const DiagnosticAI: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [aiSources, setAiSources] = useState<Array<{ uri?: string; title?: string }>>([]);

  const handleAiDiagnosis = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!aiQuery.trim()) return;

    setIsLoadingAi(true);
    setIsPressed(true); // ensure hover-style is applied while analyzing
    setAiDiagnosis(null);
    setAiSources([]);

    const MAX_RETRIES = 3;
    // Hard-coded test API key (temporary)
    const API_KEY = "AIzaSyDA_yrLeV-_K05T-5CLRWbwh-K7u2dMkgE";
    console.log('DiagnosticAI: using hard-coded API key for testing');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

    const systemPrompt = "Act as an expert motorcycle mechanic with 20 years of experience. Your task is to provide a brief, professional, and safety-focused preliminary diagnosis and advice based on the user's description. Always remind the user that this is NOT a definitive diagnosis and they MUST schedule a professional inspection immediately. Respond in Spanish.";

    const payload = {
      contents: [{ parts: [{ text: aiQuery }] }],
      tools: [{ google_search: {} }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    } as any;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const rawBody = await response.text();
        console.log('Gemini API status:', response.status);
        console.log('Gemini API raw response body:', rawBody);

        if (response.status === 429 && attempt < MAX_RETRIES - 1) {
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        if (!response.ok) {
          let parsedBody: any = rawBody;
          try {
            parsedBody = JSON.parse(rawBody);
          } catch (e) {
            /* ignore */
          }
          const msg = parsedBody?.error?.message || parsedBody?.message || rawBody;
          throw new Error(`HTTP error! status: ${response.status} body: ${msg}`);
        }

        const result = (() => {
          try {
            return JSON.parse(rawBody);
          } catch (e) {
            return {} as any;
          }
        })();

        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
          const text = candidate.content.parts[0].text;
          setAiDiagnosis(text);

          let sources: Array<{ uri?: string; title?: string }> = [];
          const groundingMetadata = candidate.groundingMetadata;
          if (groundingMetadata && groundingMetadata.groundingAttributions) {
            sources = groundingMetadata.groundingAttributions
              .map((attribution: any) => ({ uri: attribution.web?.uri, title: attribution.web?.title }))
              .filter((source: any) => source.uri && source.title);
            setAiSources(sources);
          }
        } else {
          setAiDiagnosis('Lo sentimos, la IA no pudo generar un diagnóstico. Por favor, sé más específico o contáctanos directamente.');
        }

        break;
      } catch (error) {
        console.error('Error fetching AI diagnosis:', error);
        if (attempt === MAX_RETRIES - 1) {
          setAiDiagnosis('Lo sentimos, ha ocurrido un error al intentar generar el diagnóstico. Por favor, inténtalo de nuevo más tarde.');
        }
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    setIsLoadingAi(false);
    setIsPressed(false);
  };

  return (
    <div id="diagnostico" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-gray-300 text-left">
      <h3 className="text-3xl font-bold text-center text-primary-dark mb-6">Diagnóstico Rápido Asistido por IA</h3>
      <p className="text-center text-gray-700 mb-8">Describe brevemente el problema de tu motocicleta y obtén un diagnóstico preliminar.</p>

      <div className="MuiPaper bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-4 border-accent-orange">
        <form onSubmit={handleAiDiagnosis} className="flex flex-col sm:flex-row gap-4">
          <MuiTextFieldWrapper
            label="Describe el problema de tu moto"
            id="ai_query"
            type="text"
            placeholder="Ej: Mi moto hace un chillido al encender..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            required={true}
          />
          <button
            type="submit"
            disabled={isLoadingAi}
            aria-busy={isLoadingAi}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => !isLoadingAi && setIsPressed(false)}
            onMouseLeave={() => !isLoadingAi && setIsPressed(false)}
            className={`MuiButton MuiButton-secondary shrink-0 flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold rounded-lg transition-colors duration-150
              ${isLoadingAi || isPressed ? 'bg-primary-dark text-white' : 'bg-white text-black border-2 border-black hover:bg-primary-dark hover:text-white'}`}
          >
            {isLoadingAi ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <span className="capitalize">analizando</span>
              </>
            ) : (
              <>
                <SendIcon />
                <span>Diagnosticar</span>
              </>
            )}
          </button>
        </form>

        {aiDiagnosis && (
          <div className="MuiResultContainer mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-inner space-y-4">
            <h4 className="text-xl font-bold text-accent-orange flex items-center gap-2 border-b pb-2 border-gray-200">
              <WrenchIcon /> Resultado Preliminar
            </h4>
            <div className="text-gray-800 whitespace-pre-line leading-relaxed">{aiDiagnosis}</div>
            {aiSources.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-600 flex items-center gap-1"><BookOpenIcon /> Fuentes:</p>
                <ul className="text-xs text-gray-500 list-disc list-inside mt-1 space-y-1">
                  {aiSources.map((s, i) => (
                    <li key={i}><a href={s.uri} target="_blank" rel="noreferrer" className="hover:text-accent-orange">{s.title}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticAI;
