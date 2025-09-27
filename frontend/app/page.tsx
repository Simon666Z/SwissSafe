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
      {/* Swiss-Themed Background Montage */}
      <div className="fixed inset-0 z-0">
        {/* Real Swiss Images Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-12"
          style={{
            backgroundImage: `url("/switzerland-in-pictures-most-beautiful-places-matterhorn.jpg")`,
          }}
        ></div>
        
        {/* Schilthorn Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-8"
          style={{
            backgroundImage: `url("/schilthorn-3033448_1280-1.webp")`,
            backgroundPosition: 'top right',
            backgroundSize: '50%',
          }}
        ></div>
        
        {/* Swiss Landscape Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url("/switzer_land_d4ff3a3099.png")`,
            backgroundPosition: 'bottom left',
            backgroundSize: '40%',
          }}
        ></div>
        
        {/* Additional Swiss Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-6"
          style={{
            backgroundImage: `url("/960x0.webp")`,
            backgroundPosition: 'center',
            backgroundSize: '30%',
          }}
        ></div>
        
        {/* Swiss Watch Elements */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.4'%3E%3Ccircle cx='200' cy='200' r='80' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Ccircle cx='200' cy='200' r='60' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='200' cy='200' r='40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cline x1='200' y1='200' x2='200' y2='160' stroke='%23ffffff' stroke-width='3'/%3E%3Cline x1='200' y1='200' x2='230' y2='200' stroke='%23ffffff' stroke-width='2'/%3E%3Ccircle cx='200' cy='200' r='3' fill='%23ffffff'/%3E%3C/g%3E%3Cg opacity='0.3'%3E%3Ccircle cx='1700' cy='300' r='100' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Ccircle cx='1700' cy='300' r='80' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='1700' cy='300' r='60' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cline x1='1700' y1='300' x2='1700' y2='250' stroke='%23ffffff' stroke-width='3'/%3E%3Cline x1='1700' y1='300' x2='1740' y2='300' stroke='%23ffffff' stroke-width='2'/%3E%3Ccircle cx='1700' cy='300' r='4' fill='%23ffffff'/%3E%3C/g%3E%3Cg opacity='0.2'%3E%3Ccircle cx='400' cy='800' r='70' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Ccircle cx='400' cy='800' r='50' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='400' cy='800' r='30' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cline x1='400' y1='800' x2='400' y2='760' stroke='%23ffffff' stroke-width='2'/%3E%3Cline x1='400' y1='800' x2='430' y2='800' stroke='%23ffffff' stroke-width='1.5'/%3E%3Ccircle cx='400' cy='800' r='2' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'scattered',
            backgroundSize: 'contain',
          }}
        ></div>
        
        {/* Swiss Cross Pattern */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-6"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.2'%3E%3Crect x='100' y='100' width='40' height='40' fill='%23dc2626'/%3E%3Crect x='115' y='85' width='10' height='70' fill='white'/%3E%3Crect x='85' y='115' width='70' height='10' fill='white'/%3E%3C/g%3E%3Cg opacity='0.15'%3E%3Crect x='1800' y='200' width='30' height='30' fill='%23dc2626'/%3E%3Crect x='1812' y='185' width='6' height='60' fill='white'/%3E%3Crect x='1785' y='212' width='60' height='6' fill='white'/%3E%3C/g%3E%3Cg opacity='0.1'%3E%3Crect x='500' y='700' width='25' height='25' fill='%23dc2626'/%3E%3Crect x='508' y='690' width='9' height='45' fill='white'/%3E%3Crect x='485' y='712' width='45' height='9' fill='white'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'scattered',
            backgroundSize: 'contain',
          }}
        ></div>
        
        {/* Swiss Cheese Holes Pattern */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-4"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.3'%3E%3Ccircle cx='300' cy='400' r='15' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='350' cy='450' r='12' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='280' cy='480' r='18' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='320' cy='520' r='10' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3Cg opacity='0.2'%3E%3Ccircle cx='1500' cy='600' r='20' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='1550' cy='650' r='14' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='1480' cy='680' r='16' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='1520' cy='720' r='12' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'scattered',
            backgroundSize: 'contain',
          }}
        ></div>
        
        {/* Swiss Bank Vault Pattern */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.2'%3E%3Crect x='800' y='150' width='60' height='80' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Ccircle cx='830' cy='190' r='15' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Cline x1='830' y1='175' x2='830' y2='205' stroke='%23ffffff' stroke-width='1'/%3E%3Cline x1='820' y1='190' x2='840' y2='190' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3Cg opacity='0.15'%3E%3Crect x='1200' y='800' width='50' height='70' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Ccircle cx='1225' cy='835' r='12' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Cline x1='1225' y1='823' x2='1225' y2='847' stroke='%23ffffff' stroke-width='1'/%3E%3Cline x1='1213' y1='835' x2='1237' y2='835' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'scattered',
            backgroundSize: 'contain',
          }}
        ></div>
        
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

        {/* Swiss-themed floating elements */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400/30 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          ></div>
        ))}
        
        {/* Swiss Cross floating elements */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`cross-${i}`}
            className="absolute w-3 h-3 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${6 + Math.random() * 2}s`
            }}
          >
            <div className="w-full h-full bg-red-600/20 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/30 transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/30 transform -translate-x-1/2"></div>
            </div>
          </div>
        ))}
        
        {/* Swiss Watch floating elements */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`watch-${i}`}
            className="absolute w-4 h-4 animate-float-medium"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${7 + Math.random() * 3}s`
            }}
          >
            <div className="w-full h-full border border-white/20 rounded-full relative">
              <div className="absolute top-1/2 left-1/2 w-0.5 h-1 bg-white/30 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-1 h-0.5 bg-white/30 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
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
