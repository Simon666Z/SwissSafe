// lib/types.ts
export interface AnalysisResult {
  status: "possibly legal" | "possibly illegal" | "likely legal" | "likely illegal";
  reason: string;
  confidence: number;
  product: {
    name: string;
  };
  sourceUrl: string;
}
