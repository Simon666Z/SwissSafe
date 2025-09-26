"use client";

import { useState, useEffect } from "react";
import { ResultCard } from "@/components/ResultCard";
import { URLCard } from "@/components/URLCard";
import { HistoryList } from "@/components/HistoryList";
import { AnalysisResult } from "@/lib/types";
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("searchHistory");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }, [history]);

  function isValidUrl(input: string): boolean {
    if (!input) return false;
    try {
      const parsed = new URL(input);
      const host = parsed.hostname || "";
      return (
        host === "localhost" || host.includes(".") || /^[0-9:.]+$/.test(host)
      );
    } catch {
      try {
        const parsed = new URL("https://" + input);
        const host = parsed.hostname || "";
        return (
          host === "localhost" || host.includes(".") || /^[0-9:.]+$/.test(host)
        );
      } catch {
        return false;
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!url || !isValidUrl(url)) {
      setError("Please enter a valid URL to check.");
      return;
    }

    setError(null);
    setResult(null);
    setIsLoading(true);

    (async () => {
      try {
        const response = await axios.post('http://localhost:8000/check-product', {
          url: url.trim()
        });

        const backendResult = response.data;
        const transformedResult: AnalysisResult = {
          status: backendResult.status.toLowerCase() as "legal" | "prohibited" | "uncertain",
          reason: backendResult.reasoning,
          confidence: backendResult.confidence || 0.5,
          product: {
            name: `Product from ${new URL(url).hostname}`,
          },
          sourceUrl: url,
        };

        console.log("New result confidence:", transformedResult.confidence); // Debug logging

        setResult(transformedResult);
        setHistory((prev) => [
          transformedResult,
          ...prev.filter((item) => item.sourceUrl !== transformedResult.sourceUrl),
        ]);
      } catch (fetchErr: unknown) {
        const message =
          typeof fetchErr === "string"
            ? fetchErr
            : fetchErr instanceof Error
            ? fetchErr.message
            : "An unknown error occurred";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    })();
  }

  return (
    <div className="font-sans bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
      {/* Animated background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Fixed, scrollable history panel in the top-left */}
      <div className="fixed top-6 left-6 z-50 w-72 max-h-[70vh] overflow-auto hidden md:block">
        {history.length > 0 && (
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-2xl animate-slide-in-left">
            <HistoryList
              history={history}
              onItemClick={(item) => {
                setResult(item);
                setError(null);
              }}
              onClear={() => {
                setHistory([]);
                setResult(null);
              }}
            />
          </div>
        )}
      </div>

      <main
        className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-500 ${
          history.length > 0 ? "md:ml-72" : ""
        }`}
      >
        <div className="w-full max-w-xl">
          <div className="flex flex-col gap-6">
            <div className="animate-fade-in-up">
              <URLCard
                url={url}
                setUrl={setUrl}
                isLoading={isLoading}
                onSubmit={handleSubmit}
              />
            </div>

            {error && (
              <div className="text-red-400 bg-red-900/30 border border-red-800/50 rounded-xl p-4 text-center animate-fade-in-up backdrop-blur-sm shadow-lg">
                <strong>Error:</strong> {error}
              </div>
            )}

            {result && (
              <div className="animate-fade-in-up">
                <ResultCard result={result} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
