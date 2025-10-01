// types
export interface AnalysisResult {
  status: "legal" | "possibly legal" | "possibly illegal" | "illegal" | "likely legal" | "likely illegal";
  reason: string;
  confidence: number;
  product: {
    name: string;
  };
  sourceUrl: string;
}
