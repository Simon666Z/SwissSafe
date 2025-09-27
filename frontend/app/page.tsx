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
          status: backendResult.status as "legal" | "possibly legal" | "possibly illegal" | "illegal" | "likely legal" | "likely illegal",
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
      {/* Swiss-Themed Geometric Background */}
      <div className="fixed inset-0 z-0">
        {/* Enhanced Alpine Mountain Silhouettes - Fixed at Bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/3 bg-no-repeat opacity-20 z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='360' viewBox='0 0 1920 360' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='mountain1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.8' /%3E%3Cstop offset='30%25' style='stop-color:%23f8fafc;stop-opacity:0.6' /%3E%3Cstop offset='70%25' style='stop-color:%23e2e8f0;stop-opacity:0.4' /%3E%3Cstop offset='100%25' style='stop-color:%23cbd5e1;stop-opacity:0.2' /%3E%3C/linearGradient%3E%3ClinearGradient id='mountain2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f1f5f9;stop-opacity:0.7' /%3E%3Cstop offset='40%25' style='stop-color:%23e2e8f0;stop-opacity:0.5' /%3E%3Cstop offset='80%25' style='stop-color:%23cbd5e1;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23a1a1aa;stop-opacity:0.2' /%3E%3C/linearGradient%3E%3ClinearGradient id='mountain3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.6' /%3E%3Cstop offset='50%25' style='stop-color:%23f1f5f9;stop-opacity:0.4' /%3E%3Cstop offset='100%25' style='stop-color:%23e2e8f0;stop-opacity:0.2' /%3E%3C/linearGradient%3E%3ClinearGradient id='snow' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.9' /%3E%3Cstop offset='100%25' style='stop-color:%23f8fafc;stop-opacity:0.6' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cg opacity='0.7'%3E%3Cpath d='M0,200 L150,60 L300,120 L450,30 L600,90 L750,15 L900,70 L1050,25 L1200,85 L1350,40 L1500,100 L1650,50 L1800,80 L1920,110 L1920,360 L0,360 Z' fill='url(%23mountain1)'/%3E%3Cpath d='M0,250 L120,180 L280,220 L420,160 L580,200 L720,140 L880,190 L1020,150 L1180,210 L1320,170 L1480,230 L1620,180 L1780,220 L1920,250 L1920,360 L0,360 Z' fill='url(%23mountain2)'/%3E%3Cpath d='M0,280 L100,240 L250,270 L380,220 L520,260 L650,200 L780,250 L920,190 L1050,240 L1180,200 L1310,250 L1440,210 L1570,260 L1700,220 L1830,270 L1920,290 L1920,360 L0,360 Z' fill='url(%23mountain3)'/%3E%3C/g%3E%3Cg opacity='0.8'%3E%3Cpath d='M0,200 L150,60 L300,120 L450,30 L600,90 L750,15 L900,70 L1050,25 L1200,85 L1350,40 L1500,100 L1650,50 L1800,80 L1920,110 L1920,360 L0,360 Z' fill='url(%23snow)'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'bottom',
            backgroundSize: 'cover',
          }}
        ></div>
        
        {/* Distributed Swiss Watch Elements All Over Screen */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-6"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='watch1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.8' /%3E%3Cstop offset='100%25' style='stop-color:%23f8fafc;stop-opacity:0.5' /%3E%3C/linearGradient%3E%3ClinearGradient id='watch2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e2e8f0;stop-opacity:0.7' /%3E%3Cstop offset='100%25' style='stop-color:%23cbd5e1;stop-opacity:0.4' /%3E%3C/linearGradient%3E%3ClinearGradient id='watch3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f1f5f9;stop-opacity:0.6' /%3E%3Cstop offset='100%25' style='stop-color:%23e2e8f0;stop-opacity:0.3' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cg opacity='0.3'%3E%3Ccircle cx='150' cy='150' r='40' fill='none' stroke='url(%23watch1)' stroke-width='1.5'/%3E%3Ccircle cx='150' cy='150' r='30' fill='none' stroke='url(%23watch1)' stroke-width='1'/%3E%3Cline x1='150' y1='150' x2='150' y2='120' stroke='url(%23watch1)' stroke-width='2'/%3E%3Cline x1='150' y1='150' x2='170' y2='150' stroke='url(%23watch1)' stroke-width='1.5'/%3E%3Ccircle cx='150' cy='150' r='2' fill='url(%23watch1)'/%3E%3C/g%3E%3Cg opacity='0.25'%3E%3Ccircle cx='400' cy='300' r='35' fill='none' stroke='url(%23watch2)' stroke-width='1.5'/%3E%3Ccircle cx='400' cy='300' r='25' fill='none' stroke='url(%23watch2)' stroke-width='1'/%3E%3Cline x1='400' y1='300' x2='400' y2='275' stroke='url(%23watch2)' stroke-width='2'/%3E%3Cline x1='400' y1='300' x2='415' y2='300' stroke='url(%23watch2)' stroke-width='1.5'/%3E%3Ccircle cx='400' cy='300' r='1.5' fill='url(%23watch2)'/%3E%3C/g%3E%3Cg opacity='0.2'%3E%3Ccircle cx='700' cy='200' r='30' fill='none' stroke='url(%23watch3)' stroke-width='1'/%3E%3Ccircle cx='700' cy='200' r='20' fill='none' stroke='url(%23watch3)' stroke-width='0.8'/%3E%3Cline x1='700' y1='200' x2='700' y2='180' stroke='url(%23watch3)' stroke-width='1.5'/%3E%3Cline x1='700' y1='200' x2='710' y2='200' stroke='url(%23watch3)' stroke-width='1'/%3E%3Ccircle cx='700' cy='200' r='1' fill='url(%23watch3)'/%3E%3C/g%3E%3Cg opacity='0.3'%3E%3Ccircle cx='1000' cy='400' r='45' fill='none' stroke='url(%23watch1)' stroke-width='1.5'/%3E%3Ccircle cx='1000' cy='400' r='35' fill='none' stroke='url(%23watch1)' stroke-width='1'/%3E%3Cline x1='1000' y1='400' x2='1000' y2='365' stroke='url(%23watch1)' stroke-width='2'/%3E%3Cline x1='1000' y1='400' x2='1020' y2='400' stroke='url(%23watch1)' stroke-width='1.5'/%3E%3Ccircle cx='1000' cy='400' r='2' fill='url(%23watch1)'/%3E%3C/g%3E%3Cg opacity='0.25'%3E%3Ccircle cx='1300' cy='150' r='40' fill='none' stroke='url(%23watch2)' stroke-width='1.5'/%3E%3Ccircle cx='1300' cy='150' r='30' fill='none' stroke='url(%23watch2)' stroke-width='1'/%3E%3Cline x1='1300' y1='150' x2='1300' y2='120' stroke='url(%23watch2)' stroke-width='2'/%3E%3Cline x1='1300' y1='150' x2='1320' y2='150' stroke='url(%23watch2)' stroke-width='1.5'/%3E%3Ccircle cx='1300' cy='150' r='2' fill='url(%23watch2)'/%3E%3C/g%3E%3Cg opacity='0.2'%3E%3Ccircle cx='1600' cy='300' r='35' fill='none' stroke='url(%23watch3)' stroke-width='1'/%3E%3Ccircle cx='1600' cy='300' r='25' fill='none' stroke='url(%23watch3)' stroke-width='0.8'/%3E%3Cline x1='1600' y1='300' x2='1600' y2='275' stroke='url(%23watch3)' stroke-width='1.5'/%3E%3Cline x1='1600' y1='300' x2='1615' y2='300' stroke='url(%23watch3)' stroke-width='1'/%3E%3Ccircle cx='1600' cy='300' r='1.5' fill='url(%23watch3)'/%3E%3C/g%3E%3Cg opacity='0.3'%3E%3Ccircle cx='200' cy='600' r='50' fill='none' stroke='url(%23watch1)' stroke-width='1.5'/%3E%3Ccircle cx='200' cy='600' r='35' fill='none' stroke='url(%23watch1)' stroke-width='1'/%3E%3Cline x1='200' y1='600' x2='200' y2='565' stroke='url(%23watch1)' stroke-width='2'/%3E%3Cline x1='200' y1='600' x2='220' y2='600' stroke='url(%23watch1)' stroke-width='1.5'/%3E%3Ccircle cx='200' cy='600' r='2' fill='url(%23watch1)'/%3E%3C/g%3E%3Cg opacity='0.25'%3E%3Ccircle cx='500' cy='700' r='40' fill='none' stroke='url(%23watch2)' stroke-width='1.5'/%3E%3Ccircle cx='500' cy='700' r='30' fill='none' stroke='url(%23watch2)' stroke-width='1'/%3E%3Cline x1='500' y1='700' x2='500' y2='670' stroke='url(%23watch2)' stroke-width='2'/%3E%3Cline x1='500' y1='700' x2='520' y2='700' stroke='url(%23watch2)' stroke-width='1.5'/%3E%3Ccircle cx='500' cy='700' r='2' fill='url(%23watch2)'/%3E%3C/g%3E%3Cg opacity='0.2'%3E%3Ccircle cx='800' cy='800' r='30' fill='none' stroke='url(%23watch3)' stroke-width='1'/%3E%3Ccircle cx='800' cy='800' r='20' fill='none' stroke='url(%23watch3)' stroke-width='0.8'/%3E%3Cline x1='800' y1='800' x2='800' y2='780' stroke='url(%23watch3)' stroke-width='1.5'/%3E%3Cline x1='800' y1='800' x2='810' y2='800' stroke='url(%23watch3)' stroke-width='1'/%3E%3Ccircle cx='800' cy='800' r='1' fill='url(%23watch3)'/%3E%3C/g%3E%3Cg opacity='0.3'%3E%3Ccircle cx='1200' cy='600' r='45' fill='none' stroke='url(%23watch1)' stroke-width='1.5'/%3E%3Ccircle cx='1200' cy='600' r='35' fill='none' stroke='url(%23watch1)' stroke-width='1'/%3E%3Cline x1='1200' y1='600' x2='1200' y2='565' stroke='url(%23watch1)' stroke-width='2'/%3E%3Cline x1='1200' y1='600' x2='1220' y2='600' stroke='url(%23watch1)' stroke-width='1.5'/%3E%3Ccircle cx='1200' cy='600' r='2' fill='url(%23watch1)'/%3E%3C/g%3E%3Cg opacity='0.25'%3E%3Ccircle cx='1500' cy='700' r='40' fill='none' stroke='url(%23watch2)' stroke-width='1.5'/%3E%3Ccircle cx='1500' cy='700' r='30' fill='none' stroke='url(%23watch2)' stroke-width='1'/%3E%3Cline x1='1500' y1='700' x2='1500' y2='670' stroke='url(%23watch2)' stroke-width='2'/%3E%3Cline x1='1500' y1='700' x2='1520' y2='700' stroke='url(%23watch2)' stroke-width='1.5'/%3E%3Ccircle cx='1500' cy='700' r='2' fill='url(%23watch2)'/%3E%3C/g%3E%3Cg opacity='0.2'%3E%3Ccircle cx='1800' cy='500' r='35' fill='none' stroke='url(%23watch3)' stroke-width='1'/%3E%3Ccircle cx='1800' cy='500' r='25' fill='none' stroke='url(%23watch3)' stroke-width='0.8'/%3E%3Cline x1='1800' y1='500' x2='1800' y2='475' stroke='url(%23watch3)' stroke-width='1.5'/%3E%3Cline x1='1800' y1='500' x2='1815' y2='500' stroke='url(%23watch3)' stroke-width='1'/%3E%3Ccircle cx='1800' cy='500' r='1.5' fill='url(%23watch3)'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'scattered',
            backgroundSize: 'contain',
          }}
        ></div>
        
        {/* Distributed Swiss Cross Pattern All Over Screen */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.15'%3E%3Crect x='100' y='100' width='20' height='20' fill='%23dc2626'/%3E%3Crect x='108' y='92' width='4' height='36' fill='white'/%3E%3Crect x='92' y='108' width='36' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.12'%3E%3Crect x='300' y='200' width='18' height='18' fill='%23dc2626'/%3E%3Crect x='306' y='194' width='6' height='30' fill='white'/%3E%3Crect x='294' y='206' width='30' height='6' fill='white'/%3E%3C/g%3E%3Cg opacity='0.1'%3E%3Crect x='500' y='150' width='15' height='15' fill='%23dc2626'/%3E%3Crect x='505' y='145' width='5' height='25' fill='white'/%3E%3Crect x='495' y='155' width='25' height='5' fill='white'/%3E%3C/g%3E%3Cg opacity='0.15'%3E%3Crect x='700' y='300' width='22' height='22' fill='%23dc2626'/%3E%3Crect x='709' y='291' width='4' height='40' fill='white'/%3E%3Crect x='691' y='309' width='40' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.12'%3E%3Crect x='900' y='100' width='16' height='16' fill='%23dc2626'/%3E%3Crect x='906' y='94' width='4' height='28' fill='white'/%3E%3Crect x='894' y='106' width='28' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.1'%3E%3Crect x='1100' y='250' width='14' height='14' fill='%23dc2626'/%3E%3Crect x='1105' y='245' width='4' height='24' fill='white'/%3E%3Crect x='1095' y='255' width='24' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.15'%3E%3Crect x='1300' y='400' width='20' height='20' fill='%23dc2626'/%3E%3Crect x='1308' y='392' width='4' height='36' fill='white'/%3E%3Crect x='1292' y='408' width='36' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.12'%3E%3Crect x='1500' y='150' width='18' height='18' fill='%23dc2626'/%3E%3Crect x='1506' y='144' width='6' height='30' fill='white'/%3E%3Crect x='1494' y='156' width='30' height='6' fill='white'/%3E%3C/g%3E%3Cg opacity='0.1'%3E%3Crect x='1700' y='300' width='15' height='15' fill='%23dc2626'/%3E%3Crect x='1705' y='295' width='5' height='25' fill='white'/%3E%3Crect x='1695' y='305' width='25' height='5' fill='white'/%3E%3C/g%3E%3Cg opacity='0.15'%3E%3Crect x='200' y='500' width='22' height='22' fill='%23dc2626'/%3E%3Crect x='209' y='491' width='4' height='40' fill='white'/%3E%3Crect x='191' y='509' width='40' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.12'%3E%3Crect x='400' y='600' width='18' height='18' fill='%23dc2626'/%3E%3Crect x='406' y='594' width='6' height='30' fill='white'/%3E%3Crect x='394' y='606' width='30' height='6' fill='white'/%3E%3C/g%3E%3Cg opacity='0.1'%3E%3Crect x='600' y='700' width='15' height='15' fill='%23dc2626'/%3E%3Crect x='605' y='695' width='5' height='25' fill='white'/%3E%3Crect x='595' y='705' width='25' height='5' fill='white'/%3E%3C/g%3E%3Cg opacity='0.15'%3E%3Crect x='800' y='500' width='20' height='20' fill='%23dc2626'/%3E%3Crect x='808' y='492' width='4' height='36' fill='white'/%3E%3Crect x='792' y='508' width='36' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.12'%3E%3Crect x='1000' y='600' width='16' height='16' fill='%23dc2626'/%3E%3Crect x='1006' y='594' width='4' height='28' fill='white'/%3E%3Crect x='994' y='606' width='28' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.1'%3E%3Crect x='1200' y='700' width='14' height='14' fill='%23dc2626'/%3E%3Crect x='1205' y='695' width='4' height='24' fill='white'/%3E%3Crect x='1195' y='705' width='24' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.15'%3E%3Crect x='1400' y='500' width='22' height='22' fill='%23dc2626'/%3E%3Crect x='1409' y='491' width='4' height='40' fill='white'/%3E%3Crect x='1391' y='509' width='40' height='4' fill='white'/%3E%3C/g%3E%3Cg opacity='0.12'%3E%3Crect x='1600' y='600' width='18' height='18' fill='%23dc2626'/%3E%3Crect x='1606' y='594' width='6' height='30' fill='white'/%3E%3Crect x='1594' y='606' width='30' height='6' fill='white'/%3E%3C/g%3E%3Cg opacity='0.1'%3E%3Crect x='1800' y='400' width='15' height='15' fill='%23dc2626'/%3E%3Crect x='1805' y='395' width='5' height='25' fill='white'/%3E%3Crect x='1795' y='405' width='25' height='5' fill='white'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'scattered',
            backgroundSize: 'contain',
          }}
        ></div>
        
        {/* Subtle Swiss Cheese Holes Pattern */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-1"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.1'%3E%3Ccircle cx='300' cy='400' r='12' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='350' cy='450' r='10' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='280' cy='480' r='14' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='320' cy='520' r='8' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3C/g%3E%3Cg opacity='0.08'%3E%3Ccircle cx='1500' cy='600' r='16' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='1550' cy='650' r='12' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='1480' cy='680' r='14' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='1520' cy='720' r='10' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'scattered',
            backgroundSize: 'contain',
          }}
        ></div>
        
        {/* Subtle Swiss Bank Vault Pattern */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-2"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.08'%3E%3Crect x='800' y='150' width='50' height='70' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Ccircle cx='825' cy='185' r='12' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cline x1='825' y1='173' x2='825' y2='197' stroke='%23ffffff' stroke-width='1'/%3E%3Cline x1='813' y1='185' x2='837' y2='185' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3Cg opacity='0.05'%3E%3Crect x='1200' y='800' width='40' height='60' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Ccircle cx='1220' cy='830' r='10' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cline x1='1220' y1='820' x2='1220' y2='840' stroke='%23ffffff' stroke-width='1'/%3E%3Cline x1='1210' y1='830' x2='1230' y2='830' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'scattered',
            backgroundSize: 'contain',
          }}
        ></div>
        
        {/* Elegant Geometric Pattern */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-6"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23064748;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%230f172a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231e293b;stop-opacity:1' /%3E%3C/linearGradient%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23064748;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%231e293b;stop-opacity:0.1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad1)'/%3E%3Cg opacity='0.3'%3E%3Cpath d='M0,0 L1920,540 L0,1080 Z' fill='url(%23grad2)'/%3E%3Cpath d='M1920,0 L0,540 L1920,1080 Z' fill='url(%23grad2)'/%3E%3C/g%3E%3Cg opacity='0.15'%3E%3Ccircle cx='960' cy='270' r='150' fill='none' stroke='%23064748' stroke-width='1.5'/%3E%3Ccircle cx='960' cy='810' r='120' fill='none' stroke='%23064748' stroke-width='1'/%3E%3Ccircle cx='480' cy='540' r='80' fill='none' stroke='%23064748' stroke-width='0.8'/%3E%3Ccircle cx='1440' cy='540' r='100' fill='none' stroke='%23064748' stroke-width='0.8'/%3E%3C/g%3E%3Cg opacity='0.1'%3E%3Cpath d='M0,0 Q480,270 960,540 T1920,1080' fill='none' stroke='%23064748' stroke-width='0.8'/%3E%3Cpath d='M1920,0 Q1440,270 960,540 T0,1080' fill='none' stroke='%23064748' stroke-width='0.8'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        
        {/* Subtle overlay to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/65 via-gray-800/45 to-gray-900/65"></div>
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
            <div className="w-full h-full bg-red-600/20 relative rounded-sm">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/30 transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/30 transform -translate-x-1/2"></div>
            </div>
          </div>
        ))}
        
        {/* Enhanced Swiss Watch floating elements */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`watch-${i}`}
            className="absolute w-4 h-4 animate-float-medium"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${25 + (i * 12)}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${8 + (i % 2)}s`
            }}
          >
            <div className="w-full h-full border-2 border-white/40 rounded-full relative">
              <div className="absolute top-1/2 left-1/2 w-0.5 h-1.5 bg-white/50 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-1.5 h-0.5 bg-white/50 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white/60 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        ))}
        
        {/* Minimal floating particles */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400/10 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${12 + Math.random() * 6}s`
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
        className={`min-h-screen flex flex-col items-center justify-center pb-20 p-4 sm:p-6 transition-all duration-500 relative z-10 ${
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
