import type { apiResponse } from "./apiResponse";

export type AiDiagnosticRequest = {
  text: string;
};

export type AiSource = {
  uri?: string;
  title?: string;
};

export type AiDiagnosticData = {
  diagnosis: string;
  sources: AiSource[];
};

export type AiDiagnosticResponse = apiResponse<AiDiagnosticData>;
