import clsx from "clsx";
import { AnalysisResult } from "@/lib/types";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export function ResultCard({ result }: { result: AnalysisResult }) {
  const statusConfig = {
    legal: {
      icon: <CheckCircle2 className="h-6 w-6" />,
      card: "bg-green-900/50 border-green-700 text-green-200",
      header: "text-green-300",
    },
    prohibited: {
      icon: <XCircle className="h-6 w-6" />,
      card: "bg-red-900/50 border-red-700 text-red-200",
      header: "text-red-300",
    },
    uncertain: {
      icon: <AlertTriangle className="h-6 w-6" />,
      card: "bg-yellow-900/50 border-yellow-700 text-yellow-200",
      header: "text-yellow-300",
    },
  };

  const config = statusConfig[result.status];

  return (
    <div className={clsx("p-6 rounded-xl border w-full text-left backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative", config.card)}>
      {/* Product Name */}
      <p className="font-semibold text-xl text-white/90 mb-4 animate-fade-in-up">{result.product.name}</p>

      {/* Status */}
      <div className="flex items-center gap-4 mt-4 animate-fade-in-up delay-100">
        <span className={`${config.header} animate-bounce`}>{config.icon}</span>
        <p className={`text-2xl font-bold ${config.header} animate-pulse`}>
          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
        </p>
      </div>

      {/* Reason */}
      <p className="mt-4 text-white/70 text-lg leading-relaxed animate-fade-in-up delay-200">{result.reason}</p>
      
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
