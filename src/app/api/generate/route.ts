// ─────────────────────────────────────────────────────────────
// API Route: /api/generate — Proxy para generación de código PLC
// Este endpoint puede usarse como alternativa server-side.
// La app actualmente llama a Gemini desde el cliente.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, plcBrand, plcModel, language, apiKey } = body;

    if (!description || !plcBrand || !language) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: description, plcBrand, language' },
        { status: 400 },
      );
    }

    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: 'API Key no proporcionada. Configura tu clave de Gemini.' },
        { status: 401 },
      );
    }

    const systemPrompt =
      'Eres un ingeniero de automatización industrial senior especializado en programación PLC según IEC 61131-3. Genera código completo, funcional, documentado en español, con declaración de variables, manejo de errores y mejores prácticas de seguridad. Responde SOLO con el código.';

    const userPrompt = `Genera código ${language.toUpperCase()} para un PLC ${plcBrand}${plcModel ? ` (${plcModel})` : ''}.

Requerimientos:
${description}

Incluye: declaración de variables, lógica principal, comentarios descriptivos y manejo de errores.`;

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Error de la API de Gemini (${response.status})` },
        { status: response.status },
      );
    }

    const data = await response.json();
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!generatedText) {
      return NextResponse.json(
        { error: 'La API no devolvió contenido.' },
        { status: 502 },
      );
    }

    // Clean markdown wrappers
    const code = generatedText
      .replace(/^```[\w]*\n?/gm, '')
      .replace(/\n?```$/gm, '')
      .trim();

    return NextResponse.json({
      code,
      description,
      plcBrand,
      plcModel,
      language,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 },
    );
  }
}
