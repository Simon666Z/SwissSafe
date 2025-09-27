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
          status: backendResult.status as "possibly legal" | "possibly illegal" | "likely legal" | "likely illegal",
          reason: backendResult.reasoning,
          confidence: backendResult.confidence || 0.5,
          product: {
            name: `Product from ${new URL(url).hostname}`,
          },
          sourceUrl: url,
        };

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
    <div className="font-sans bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen relative overflow-hidden">
      {/* Modern Swiss Image Grid Background */}
      <div className="fixed inset-0 z-0">
        {/* Grid Container */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 p-8">
          
          {/* Matterhorn - Large Hero Grid */}
          <div 
            className="col-span-4 row-span-5 bg-cover bg-center rounded-2xl opacity-20 hover:opacity-30 transition-opacity duration-500"
            style={{
              backgroundImage: `url("/switzerland-in-pictures-most-beautiful-places-matterhorn.jpg")`,
              transform: 'rotate(-2deg)',
            }}
          ></div>
          
          {/* Schilthorn - Medium Grid */}
          <div 
            className="col-span-3 row-span-3 bg-cover bg-center rounded-xl opacity-15 hover:opacity-25 transition-opacity duration-500"
            style={{
              backgroundImage: `url("/schilthorn-3033448_1280-1.webp")`,
              transform: 'rotate(1deg)',
            }}
          ></div>
          
          {/* Swiss Landscape - Vertical Grid */}
          <div 
            className="col-span-2 row-span-6 bg-cover bg-center rounded-xl opacity-18 hover:opacity-28 transition-opacity duration-500"
            style={{
              backgroundImage: `url("/switzer_land_d4ff3a3099.png")`,
              transform: 'rotate(-1deg)',
            }}
          ></div>
          
          {/* Additional Swiss Image - Small Grid */}
          <div 
            className="col-span-2 row-span-2 bg-cover bg-center rounded-lg opacity-12 hover:opacity-22 transition-opacity duration-500"
            style={{
              backgroundImage: `url("/960x0.webp")`,
              transform: 'rotate(2deg)',
            }}
          ></div>
          
          {/* Matterhorn Duplicate - Small Accent */}
          <div 
            className="col-span-2 row-span-3 bg-cover bg-center rounded-xl opacity-10 hover:opacity-20 transition-opacity duration-500"
            style={{
              backgroundImage: `url("/switzerland-in-pictures-most-beautiful-places-matterhorn.jpg")`,
              transform: 'rotate(-1deg)',
            }}
          ></div>
          
          {/* Schilthorn Duplicate - Tiny Accent */}
          <div 
            className="col-span-1 row-span-2 bg-cover bg-center rounded-lg opacity-8 hover:opacity-18 transition-opacity duration-500"
            style={{
              backgroundImage: `url("/schilthorn-3033448_1280-1.webp")`,
              transform: 'rotate(1.5deg)',
            }}
          ></div>
          
          {/* Swiss Landscape Duplicate - Small Accent */}
          <div 
            className="col-span-2 row-span-2 bg-cover bg-center rounded-lg opacity-14 hover:opacity-24 transition-opacity duration-500"
            style={{
              backgroundImage: `url("/switzer_land_d4ff3a3099.png")`,
              transform: 'rotate(-0.5deg)',
            }}
          ></div>
          
        </div>
        
        {/* Floating Swiss Elements Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Swiss Cross Elements */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`cross-${i}`}
              className="absolute w-2 h-2 animate-float-slow"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 10)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${6 + (i % 2)}s`
              }}
            >
              <div className="w-full h-full bg-red-600/30 relative rounded-sm">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/40 transform -translate-y-1/2"></div>
                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/40 transform -translate-x-1/2"></div>
              </div>
            </div>
          ))}
          
          {/* Swiss Watch Elements */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`watch-${i}`}
              className="absolute w-3 h-3 animate-float-medium"
              style={{
                left: `${70 + (i * 8)}%`,
                top: `${20 + (i * 15)}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${7 + (i % 2)}s`
              }}
            >
              <div className="w-full h-full border border-white/30 rounded-full relative">
                <div className="absolute top-1/2 left-1/2 w-0.5 h-1 bg-white/40 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-0.5 bg-white/40 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        
        
        {/* Subtle overlay to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/50 to-gray-900/70"></div>
      </div>

      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-gray-600/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-gray-500/15 rotate-45 animate-float-medium"></div>
        <div className="absolute top-60 left-1/4 w-3 h-3 bg-gray-400/25 rounded-full animate-float-fast"></div>
        <div className="absolute top-80 right-1/3 w-5 h-5 bg-gray-600/20 rotate-12 animate-float-slow"></div>
        
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-gray-500/20 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-40 right-10 w-6 h-6 bg-gray-400/15 rotate-45 animate-float-fast"></div>
        <div className="absolute bottom-60 left-1/3 w-3 h-3 bg-gray-600/25 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-80 right-1/4 w-5 h-5 bg-gray-500/20 rotate-12 animate-float-medium"></div>

        {/* Large floating orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl animate-orb-drift-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-full blur-3xl animate-orb-drift-medium"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-gray-500/3 to-gray-600/3 rounded-full blur-3xl animate-orb-drift-fast"></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-400 animate-grid-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${3 + (i % 3)}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Enhanced floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400/20 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          ></div>
        ))}

        {/* Subtle wave animations */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-800/10 to-transparent animate-wave-slow"></div>
        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-gray-700/10 to-transparent animate-wave-medium"></div>
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
        className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-500 relative z-10 ${
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
