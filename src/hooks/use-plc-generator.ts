// ─────────────────────────────────────────────────────────────
// Hook: usePLCGenerator — Lógica principal de generación
//
// No maneja ninguna clave de API: delega en las rutas /api del
// servidor a través de los wrappers de gemini-client.
// ─────────────────────────────────────────────────────────────

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';
import { generatePLCCode, analyzePLCCode, refinePLCCode } from '@/lib/gemini-client';
import { APP_CONFIG } from '@/lib/constants';
import type { GenerationResult, GenerationFormData, AnalysisResult } from '@/types';

export function usePLCGenerator() {
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useLocalStorage<GenerationResult[]>('plc-history', []);

  // Permite cancelar la petición en curso (botón Cancelar / desmontaje).
  const abortRef = useRef<AbortController | null>(null);
  const refineAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      refineAbortRef.current?.abort();
    };
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  }, []);

  const generate = useCallback(async (formData: GenerationFormData) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const result = await generatePLCCode(formData, controller.signal);
      setCurrentResult(result);
      setHistory((prev) => [result, ...prev].slice(0, APP_CONFIG.maxHistory));
      return result;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return null;
      const message = err instanceof Error ? err.message : 'Error desconocido al generar código';
      setError(message);
      throw err;
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }, [setHistory]);

  const analyzeCode = useCallback(async (code: string, fileName: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await analyzePLCCode(code, fileName, controller.signal);
      setCurrentAnalysis(result);
      return result;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return null;
      const message = err instanceof Error ? err.message : 'Error desconocido al analizar código';
      setError(message);
      throw err;
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }, []);

  const refine = useCallback(async (instruction: string) => {
    let base: GenerationResult | null = null;
    setCurrentResult((prev) => {
      base = prev;
      return prev;
    });
    if (!base) return null;
    const source = base as GenerationResult;

    refineAbortRef.current?.abort();
    const controller = new AbortController();
    refineAbortRef.current = controller;

    setRefining(true);
    setError(null);

    try {
      const result = await refinePLCCode(
        {
          code: source.code,
          instruction,
          plcBrand: source.plcBrand,
          language: source.language,
        },
        controller.signal,
      );
      // Conservamos la descripción y el modelo originales del proyecto.
      const merged: GenerationResult = {
        ...result,
        description: source.description,
        plcModel: source.plcModel,
      };
      setCurrentResult(merged);
      setHistory((prev) => [merged, ...prev].slice(0, APP_CONFIG.maxHistory));
      return merged;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return null;
      const message = err instanceof Error ? err.message : 'Error al refinar el código';
      setError(message);
      throw err;
    } finally {
      if (refineAbortRef.current === controller) refineAbortRef.current = null;
      setRefining(false);
    }
  }, [setHistory]);

  const loadFromHistory = useCallback((item: GenerationResult) => {
    setCurrentResult(item);
    setCurrentAnalysis(null);
    setError(null);
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setCurrentResult((prev) => (prev?.id === id ? null : prev));
  }, [setHistory]);

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
    refining,
    error,
    currentResult,
    currentAnalysis,
    history,
    // Actions
    generate,
    analyzeCode,
    refine,
    cancel,
    loadFromHistory,
    deleteHistoryItem,
    clearHistory,
    clearError,
  };
}
