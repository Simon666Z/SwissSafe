// lib/types.ts
export interface AnalysisResult {
  status: "legal" | "prohibited" | "uncertain";
  reason: string;
  product: {
    name: string;
  };
  sourceUrl: string;
}
