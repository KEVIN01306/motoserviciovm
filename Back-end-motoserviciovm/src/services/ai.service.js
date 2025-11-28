const API_URL_TEMPLATE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=';

async function generateDiagnostic(text, apiKey, options = {}) {
  if (!text || !text.trim()) {
    throw new Error('EMPTY_TEXT');
  }
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const systemPrompt = options.systemPrompt || "Act as an expert motorcycle mechanic with 20 years of experience. Your task is to provide a brief, professional, and safety-focused preliminary diagnosis and advice based on the user's description. Always remind the user that this is NOT a definitive diagnosis and they MUST schedule a professional inspection immediately. Respond in Spanish.";

  const payload = {
    contents: [{ parts: [{ text }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  const url = API_URL_TEMPLATE + encodeURIComponent(apiKey);

  const MAX_RETRIES = options.maxRetries ?? 2;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      if (!res.ok) {
        const parsed = (() => { try { return JSON.parse(raw); } catch { return null; } })();
        const msg = parsed?.error?.message || parsed?.message || raw;
        const err = new Error(`AI_API_ERROR: ${msg}`);
        err.status = res.status;
        throw err;
      }

      const json = (() => { try { return JSON.parse(raw); } catch { return null; } })();
      const candidate = json?.candidates?.[0];
      const diagnosis = candidate?.content?.parts?.[0]?.text ?? null;

      let sources = [];
      const groundingMetadata = candidate?.groundingMetadata;
      if (groundingMetadata && groundingMetadata.groundingAttributions) {
        sources = groundingMetadata.groundingAttributions
          .map((a) => ({ uri: a.web?.uri, title: a.web?.title }))
          .filter((s) => s.uri && s.title);
      }

      return { diagnosis, sources, raw: json };
    } catch (err) {
      const isLast = attempt === MAX_RETRIES;
      if (isLast) throw err;
      const backoff = Math.pow(2, attempt) * 500 + Math.random() * 500;
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
}

export { generateDiagnostic };
