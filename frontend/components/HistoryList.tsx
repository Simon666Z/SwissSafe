import { AnalysisResult } from "@/lib/types";
import { Trash2 } from "lucide-react";

interface HistoryListProps {
  history: AnalysisResult[];
  onItemClick: (result: AnalysisResult) => void;
  onClear: () => void;
}

export function HistoryList({
  history,
  onItemClick,
  onClear,
}: HistoryListProps) {
  if (history.length === 0) {
    return null;
  }

  const statusColors: { [key in AnalysisResult["status"]]: string } = {
    legal: "text-green-400",
    prohibited: "text-red-400",
    uncertain: "text-yellow-400",
  };

  return (
     <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white animate-fade-in-up">History</h2>
        <button
          onClick={onClear}
          title="Clear History"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 
                     transition-all duration-300 p-2 rounded-lg hover:bg-red-900/20
                     focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          <Trash2 size={16} className="animate-pulse" />
          Clear
        </button>
      </div>
      <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {history.map((item, index) => (
          <li key={`${item.sourceUrl}-${index}`} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <button
              type="button"
              onClick={() => onItemClick(item)}
              className="w-full text-left p-4 bg-gray-900/60 hover:bg-gray-700/80 rounded-xl 
                         transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                         border border-gray-700/50 hover:border-emerald-700/50 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                         group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <p className="font-semibold text-white truncate group-hover:text-emerald-300 transition-colors duration-300">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-400 truncate mt-1 group-hover:text-gray-300 transition-colors duration-300">
                  {item.sourceUrl}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${
                    statusColors[item.status]
                  } animate-pulse`}></div>
                  <span className={`text-xs font-medium ${statusColors[item.status]} capitalize`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <style>
        {` .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4A5568;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #2D3748;
        }`}
      </style>
    </div>
  );
}
