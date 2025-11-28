import { generateDiagnostic } from '../services/ai.service.js';
import { responseSucces, responseError } from '../helpers/response.helper.js';

const postDiagnostic = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json(responseError('Text is required'));
    }

    const apiKey = process.env.GENERATIVE_API_KEY || process.env.GOOGLE_API_KEY || null;
    if (!apiKey) {
      return res.status(500).json(responseError('AI API key not configured on server (set GENERATIVE_API_KEY)'));
    }

    const result = await generateDiagnostic(text, apiKey, { maxRetries: 2 });

    return res.status(200).json(responseSucces('AI diagnostic generated', { diagnosis: result.diagnosis, sources: result.sources }));
  } catch (err) {
    console.error('AI diagnostic error:', err);
    const status = err.status || 500;
    return res.status(status).json(responseError(err.message || 'AI request failed'));
  }
};

export { postDiagnostic };
