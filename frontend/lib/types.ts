// lib/types.ts
export interface AnalysisResult {
  status: "legal" | "prohibited" | "uncertain";
  reason: string;
  confidence: number;
  product: {
    name: string;
  };
  sourceUrl: string;
}
