import React, { useState, useEffect } from 'react';

export function ApiKeySection({ onApiKeyChange }: { onApiKeyChange?: (key: string) => void }) {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('userApiKey') || '';
      setApiKey(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('userApiKey', value);
    }
    if (onApiKeyChange) onApiKeyChange(value);
  };

  return (
    <div className="mb-6 rounded-xl border border-yellow-400 bg-white p-4 shadow-sm">
      <label className="block text-sm font-semibold text-yellow-600 mb-2" htmlFor="user-api-key">
        Google Gemini API Key
      </label>
      <input
        id="user-api-key"
        type="password"
        className="w-full rounded border border-yellow-400 px-3 py-2 text-slate-900 bg-slate-900/80 placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        placeholder="Pega tu Google Gemini API Key aquí"
        value={apiKey}
        onChange={handleChange}
        autoComplete="off"
        style={{ color: '#FFD600', borderColor: '#FFD600' }}
      />
      <div className="mt-2 text-xs text-yellow-300">
        <span>Tu clave <b>no se guardará</b> ni se enviará a ningún servidor, solo se usará en tu navegador para conectar con Google Gemini.</span>
        <br />
        <span>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 underline hover:text-yellow-200"
          >
            ¿No tienes una API Key? Consíguela aquí
          </a>
        </span>
      </div>
    </div>
  );
}
