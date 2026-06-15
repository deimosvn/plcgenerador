// ─────────────────────────────────────────────────────────────
// Hook: usePLCGenerator — Lógica principal de generación
// ─────────────────────────────────────────────────────────────

'use client';

import { useState, useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';
import { generatePLCCode, analyzePLCCode } from '@/lib/gemini-client';
import { APP_CONFIG } from '@/lib/constants';
import type { GenerationResult, GenerationFormData, AnalysisResult } from '@/types';

export function usePLCGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useLocalStorage<GenerationResult[]>('plc-history', []);
  const apiKey = 'AIzaSyDQMejzD4vP0XE2npuLOVVgLpZx68rTk6c';

  const generate = useCallback(async (formData: GenerationFormData) => {
    setLoading(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const result = await generatePLCCode(formData, apiKey);
      setCurrentResult(result);

      // Agregar al historial
      setHistory((prev) => {
        const updated = [result, ...prev].slice(0, APP_CONFIG.maxHistory);
        return updated;
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido al generar código';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiKey, setHistory]);

  const analyzeCode = useCallback(async (code: string, fileName: string) => {
    setLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await analyzePLCCode(code, fileName, apiKey);
      setCurrentAnalysis(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido al analizar código';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const loadFromHistory = useCallback((item: GenerationResult) => {
    setCurrentResult(item);
    setCurrentAnalysis(null);
    setError(null);
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  }, [setHistory, currentResult]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentResult(null);
    setCurrentAnalysis(null);
  }, [setHistory]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    currentResult,
    currentAnalysis,
    history,
    // Actions
    generate,
    analyzeCode,
    loadFromHistory,
    deleteHistoryItem,
    clearHistory,
    clearError,
  };
}
