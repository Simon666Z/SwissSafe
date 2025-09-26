"use client";

import React from "react";
import { ScanLine, Link, Loader2 } from "lucide-react";

interface URLInputFormProps {
  url: string;
  setUrl: (value: string) => void;
  isLoading: boolean;
  onSubmit: (event: React.FormEvent) => void;
}

export const URLCard: React.FC<URLInputFormProps> = ({
  url,
  setUrl,
  isLoading,
  onSubmit,
}) => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient-x">
          Swiss Compliance Checker
        </h1>
        <p className="text-gray-400 mt-4 max-w-md mx-auto text-lg animate-fade-in-up delay-200">
          Enter a product URL to check its import legality.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="group">
          <label htmlFor="product-url" className="sr-only">
            Product URL
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Link className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
            </div>
            <input
              type="text"
              id="product-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              placeholder="e.g., https://www.e-commerce.com/product/..."
              className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl py-4 pl-12 pr-4 text-white 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                         hover:border-gray-500/50 transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         placeholder-gray-500"
              disabled={isLoading}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !url}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-cyan-600 
                     font-bold py-4 px-6 rounded-xl text-white shadow-lg
                     hover:from-emerald-500 hover:to-cyan-500 hover:shadow-emerald-500/25 hover:shadow-xl
                     focus:outline-none focus:ring-4 focus:ring-emerald-500/50
                     disabled:from-gray-600 disabled:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                     relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="relative z-10">Checking...</span>
            </>
          ) : (
            <>
              <ScanLine className="h-5 w-5 group-hover:animate-pulse" />
              <span className="relative z-10">Check Legality</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
