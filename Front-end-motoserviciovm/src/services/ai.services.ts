import axios from "axios";
import type { AiDiagnosticRequest, AiDiagnosticData } from "../types/aiType";
import type { apiResponse } from "../types/apiResponse";
import { aiResponseSchema } from "../zod/ai.schema";

const API_URL = import.meta.env.VITE_DOMAIN
const AI_API_URL = API_URL + "ai"

const postAIDiagnostic = async (payload: AiDiagnosticRequest): Promise<AiDiagnosticData> => {
  try {
    const response = await axios.post<apiResponse<AiDiagnosticData>>(AI_API_URL+"/diagnostic", payload, {
      headers: { "Content-Type": "application/json" },
    });

    const body = response.data;

    try {
      aiResponseSchema.parse(body);
    } catch (err) {
      console.warn("AI response did not match expected schema:", err);
    }

    if (!body || body.status !== "success" || !body.data) {
      const serverMessage = (body && (body as any).message) || "INVALID AI RESPONSE";
      throw new Error(serverMessage);
    }

    return body.data;
  } catch (error) {
    console.error("postAIDiagnostic error:", error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      if (serverMessage) throw new Error(serverMessage);
      if (status === 404) throw new Error("AI endpoint not found (404)");
      if (status === 500) throw new Error("AI server error (500)");

      throw new Error("Connection error to AI service");
    }

    throw new Error((error as Error).message);
  }
};

export { postAIDiagnostic };
