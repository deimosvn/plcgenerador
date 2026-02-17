import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

function getApiKeyFromRequest(request: NextRequest): string | undefined {
  // Permite API key por header personalizado
  const headerKey = request.headers.get('x-user-apikey');
  if (headerKey && headerKey.trim().length > 10) return headerKey.trim();
  // Fallback a variable de entorno
  return process.env.OPENAI_API_KEY;
}

const buildFallbackCode = (params: {
  description: string;
  plcBrand: string;
  plcModel?: string;
  language: string;
}) => {
  const { description, plcBrand, plcModel, language } = params;
  const header = `${plcBrand}${plcModel ? ` ${plcModel}` : ''}`.trim();
  return `(*\n  PROGRAMA DE RESPALDO GENERADO LOCALMENTE\n  EQUIPO: ${header || 'PLC ESTÁNDAR'}\n  LENGUAJE OBJETIVO: ${language.toUpperCase()}\n  REQUERIMIENTOS: ${description}\n*)\n\nPROGRAM Main\nVAR_INPUT\n    StartButton : BOOL;\n    StopButton  : BOOL;\n    SensorOK    : BOOL;\nEND_VAR\n\nVAR_OUTPUT\n    PumpCmd : BOOL;\n    Alarm   : BOOL;\nEND_VAR\n\nVAR\n    Running : BOOL;\nEND_VAR\n\n(* Lógica simple de respaldo para pruebas locales *)\nIF StartButton AND NOT StopButton AND SensorOK THEN\n    Running := TRUE;\nELSIF StopButton OR NOT SensorOK THEN\n    Running := FALSE;\nEND_IF;\n\nPumpCmd := Running;\nAlarm := NOT SensorOK;\n\nEND_PROGRAM`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, plcBrand, plcModel, language } = body;

    if (!description || !plcBrand || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = getApiKeyFromRequest(request);
    const openaiClient = apiKey ? new OpenAI({ apiKey }) : null;

    const systemPrompt = `You are an expert PLC (Programmable Logic Controller) programmer with deep knowledge of:
- Siemens (S7-1200, S7-1500, TIA Portal)
- Allen-Bradley (CompactLogix, ControlLogix, Studio 5000)
- Mitsubishi (FX series, Q series)
- Omron (CP, CJ series)
- IEC 61131-3 standards

Your task is to generate production-ready PLC code based on user requirements.
Always include:
1. Comments explaining the logic
2. Variable declarations
3. Input/Output mappings
4. Error handling where applicable
5. Best practices for safety and reliability`;

    const userPrompt = `Generate ${language.toUpperCase()} code for a ${plcBrand}${plcModel ? ` (${plcModel})` : ''} PLC.

Requirements:
${description}

Code Format Guidelines:
- For Ladder Diagram: Use text-based ladder notation with clear rungs and logic
- For Structured Text: Use IEC 61131-3 ST syntax
- For Function Block Diagram: Use block notation with connections
- For Python: Use clean, documented Python code

Include:
1. Program description at the top
2. Variable declarations (inputs, outputs, internal variables)
3. Main logic/program
4. Comments for each section
5. Safety considerations

Generate only the code, without additional explanation.`;

    if (!openaiClient) {
      return NextResponse.json({
        code: buildFallbackCode({ description, plcBrand, plcModel, language }),
        description,
        plcBrand,
        plcModel,
        language,
        timestamp: Date.now(),
        warning: 'Generado con plantilla local porque OPENAI_API_KEY no está configurada.',
      });
    }

    let generatedCode = '';
    try {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 2048,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });
      generatedCode = completion.choices?.[0]?.message?.content?.trim() ?? '';
    } catch (error) {
      console.error('OpenAI request failed, returning fallback:', error);
    }

    if (!generatedCode) {
      generatedCode = buildFallbackCode({ description, plcBrand, plcModel, language });
    }

    return NextResponse.json({
      code: generatedCode,
      description,
      plcBrand,
      plcModel,
      language,
      timestamp: Date.now(),
      warning: generatedCode.includes('PROGRAMA DE RESPALDO') ? 'Respuesta generada localmente por falta de salida del modelo.' : undefined,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code. Please try again.' },
      { status: 500 }
    );
  }
}
