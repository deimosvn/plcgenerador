// ─────────────────────────────────────────────────────────────
// Hook: usePLCGenerator — Lógica principal de generación
// ─────────────────────────────────────────────────────────────

'use client';

import { useState, useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';
import { generatePLCCode } from '@/lib/gemini-client';
import { APP_CONFIG } from '@/lib/constants';
import type { GenerationResult, GenerationFormData } from '@/types';

export function usePLCGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [apiKey, setApiKeyState] = useLocalStorage<string>('plc-api-key', '');
  const [history, setHistory] = useLocalStorage<GenerationResult[]>('plc-history', []);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
  }, [setApiKeyState]);

  const generate = useCallback(async (formData: GenerationFormData) => {
    setLoading(true);
    setError(null);

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

  const loadFromHistory = useCallback((item: GenerationResult) => {
    setCurrentResult(item);
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
  }, [setHistory]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    currentResult,
    apiKey,
    history,
    // Actions
    generate,
    setApiKey,
    loadFromHistory,
    deleteHistoryItem,
    clearHistory,
    clearError,
  };
}
