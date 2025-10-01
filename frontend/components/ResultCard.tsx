import clsx from "clsx";
import { AnalysisResult } from "@/lib/types";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export function ResultCard({ result }: { result: AnalysisResult }) {
  const statusConfig = {
    "legal": {
      icon: <CheckCircle2 className="h-6 w-6" />,
      card: "bg-green-900/50 border-green-700 text-green-200",
      header: "text-green-300",
    },
    "possibly legal": {
      icon: <CheckCircle2 className="h-6 w-6" />,
      card: "bg-green-900/50 border-green-700 text-green-200",
      header: "text-green-300",
    },
    "likely legal": {
      icon: <CheckCircle2 className="h-6 w-6" />,
      card: "bg-green-800/50 border-green-600 text-green-200",
      header: "text-green-300",
    },
    "illegal": {
      icon: <XCircle className="h-6 w-6" />,
      card: "bg-red-900/50 border-red-700 text-red-200",
      header: "text-red-300",
    },
    "possibly illegal": {
      icon: <XCircle className="h-6 w-6" />,
      card: "bg-red-900/50 border-red-700 text-red-200",
      header: "text-red-300",
    },
    "likely illegal": {
      icon: <XCircle className="h-6 w-6" />,
      card: "bg-red-800/50 border-red-600 text-red-200",
      header: "text-red-300",
    },
  };

  const config = statusConfig[result.status];

  return (
    <div className={clsx("p-6 rounded-xl border w-full text-left backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative", config.card)}>
      {/* product name */}
      <p className="font-semibold text-xl text-white/90 mb-4 animate-fade-in-up">{result.product.name}</p>

      {/* status */}
      <div className="flex items-center gap-4 mt-4 animate-fade-in-up delay-100">
        <span className={`${config.header} animate-bounce`}>{config.icon}</span>
        <p className={`text-2xl font-bold ${config.header} animate-pulse`}>
          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
        </p>
      </div>

      {/* confidence bar */}
      <div className="mt-6 animate-fade-in-up delay-150">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/80">Confidence Level</span>
          <span className="text-sm font-bold text-white/90">{Math.round(result.confidence * 100)}%</span>
        </div>
        <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className={clsx(
              "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
              result.confidence >= 0.8 ? "bg-gradient-to-r from-green-500 to-emerald-400" :
              result.confidence >= 0.6 ? "bg-gradient-to-r from-yellow-500 to-orange-400" :
              "bg-gradient-to-r from-red-500 to-pink-400"
            )}
            style={{ width: `${result.confidence * 100}%` }}
          >
            {/* shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
          {/* markers */}
          <div className="absolute inset-0 flex justify-between items-center px-1">
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-white/50 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* reason */}
      <p className="mt-6 text-white/70 text-lg leading-relaxed animate-fade-in-up delay-200">{result.reason}</p>
      
      {/* border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
