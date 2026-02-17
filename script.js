// Utilidades para obtener extensión y nombre de archivo según marca/modelo
function getFileExtension(brand, format) {
  if (format && format !== 'auto') return '.' + format;
  if (brand.includes('Siemens')) return '.scl';
  if (brand.includes('Allen-Bradley')) return '.L5X';
  if (brand.includes('Mitsubishi')) return '.gxw';
  if (brand.includes('Omron')) return '.cxp';
  return '.txt';
}

function getFileName(brand, model, language, format) {
  const clean = (str) => str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return `plc_${clean(brand)}${model ? '_' + clean(model) : ''}_${clean(language)}${getFileExtension(brand, format)}`;
}

// Descargar archivo generado
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Evento principal
// Evento para descargar el archivo generado
document.getElementById('download-btn').addEventListener('click', function () {
  const plcBrand = document.getElementById('plc-brand').value;
  const plcModel = document.getElementById('plc-model').value.trim();
  const language = document.getElementById('language').value;
  const fileFormat = document.getElementById('file-format').value;
  const codeDisplay = document.getElementById('code-display');
  const filename = getFileName(plcBrand, plcModel, language, fileFormat);
  const content = codeDisplay.textContent;
  downloadFile(filename, content);
});
const btn = document.getElementById('generate-btn');
btn.addEventListener('click', async function () {
  const apiKey = document.getElementById('user-api-key').value.trim();
  const provider = document.getElementById('provider-select').value;
  const prompt = document.getElementById('prompt').value.trim();
  const plcBrand = document.getElementById('plc-brand').value;
  const plcModel = document.getElementById('plc-model').value.trim();
  const language = document.getElementById('language').value;
  const codeDisplay = document.getElementById('code-display');
  const fileFormat = document.getElementById('file-format').value;

  if (!apiKey) {
    alert('Por favor, ingresa tu API Key.');
    return;
  }
  if (!prompt || prompt.length < 10) {
    alert('Por favor, describe el proceso con al menos 10 caracteres.');
    return;
  }

  codeDisplay.textContent = 'Generando código...';

  const fullPrompt = `Genera código PLC en ${language.toUpperCase()} para un ${plcBrand}${plcModel ? ` (${plcModel})` : ''} con los siguientes requerimientos: ${prompt}`;

  async function generateLocalCode() {
    // Generación avanzada local (nivel senior)
        // Procesos PLC estándar
        const preset = document.getElementById('preset-process')?.value || '';
        const processTemplates = {
          arranque_paro_bomba: {
            scl: `(* Arranque y paro de bomba *)\nVAR_INPUT\n    StartButton : BOOL;\n    StopButton : BOOL;\nEND_VAR\nVAR_OUTPUT\n    PumpCmd : BOOL;\nEND_VAR\nPumpCmd := StartButton AND NOT StopButton;`,
            ladder: `| StartButton |----| |----|/|----( PumpCmd )\n| StopButton |`,
            fbd: `StartButton --AND--|NOT|-- StopButton --> PumpCmd`,
            il: `LD StartButton\nANDN StopButton\nOUT PumpCmd`
          },
          control_nivel_tanque: {
            scl: `(* Control de nivel de tanque *)\nVAR_INPUT\n    NivelAlto : BOOL;\n    NivelBajo : BOOL;\nEND_VAR\nVAR_OUTPUT\n    LlenaTanque : BOOL;\nEND_VAR\nLlenaTanque := NivelBajo AND NOT NivelAlto;`,
            ladder: `| NivelBajo |----| |----|/|----( LlenaTanque )\n| NivelAlto |`,
            fbd: `NivelBajo --AND--|NOT|-- NivelAlto --> LlenaTanque`,
            il: `LD NivelBajo\nANDN NivelAlto\nOUT LlenaTanque`
          },
          control_temperatura: {
            scl: `(* Control de temperatura *)\nVAR_INPUT\n    TempActual : REAL;\n    TempSet : REAL;\nEND_VAR\nVAR_OUTPUT\n    Calefactor : BOOL;\nEND_VAR\nCalefactor := TempActual < TempSet;`,
            ladder: `| TempActual < TempSet |----( Calefactor )`,
            fbd: `TempActual < TempSet --> Calefactor`,
            il: `LD TempActual\nLT TempSet\nOUT Calefactor`
          },
          control_motor: {
            scl: `(* Control de motor trifásico *)\nVAR_INPUT\n    Arranque : BOOL;\n    Paro : BOOL;\nEND_VAR\nVAR_OUTPUT\n    MotorON : BOOL;\nEND_VAR\nMotorON := Arranque AND NOT Paro;`,
            ladder: `| Arranque |----| |----|/|----( MotorON )\n| Paro |`,
            fbd: `Arranque --AND--|NOT|-- Paro --> MotorON`,
            il: `LD Arranque\nANDN Paro\nOUT MotorON`
          },
          cinta_transportadora: {
            scl: `(* Cinta transportadora *)\nVAR_INPUT\n    SensorInicio : BOOL;\n    SensorFin : BOOL;\nEND_VAR\nVAR_OUTPUT\n    MotorCinta : BOOL;\nEND_VAR\nMotorCinta := SensorInicio AND NOT SensorFin;`,
            ladder: `| SensorInicio |----| |----|/|----( MotorCinta )\n| SensorFin |`,
            fbd: `SensorInicio --AND--|NOT|-- SensorFin --> MotorCinta`,
            il: `LD SensorInicio\nANDN SensorFin\nOUT MotorCinta`
          },
          control_valvula: {
            scl: `(* Control de válvula *)\nVAR_INPUT\n    Abrir : BOOL;\n    Cerrar : BOOL;\nEND_VAR\nVAR_OUTPUT\n    ValvulaON : BOOL;\nEND_VAR\nValvulaON := Abrir AND NOT Cerrar;`,
            ladder: `| Abrir |----| |----|/|----( ValvulaON )\n| Cerrar |`,
            fbd: `Abrir --AND--|NOT|-- Cerrar --> ValvulaON`,
            il: `LD Abrir\nANDN Cerrar\nOUT ValvulaON`
          },
          alarma_general: {
            scl: `(* Alarma general y reset *)\nVAR_INPUT\n    Error : BOOL;\n    Reset : BOOL;\nEND_VAR\nVAR_OUTPUT\n    Alarma : BOOL;\nEND_VAR\nAlarma := Error AND NOT Reset;`,
            ladder: `| Error |----| |----|/|----( Alarma )\n| Reset |`,
            fbd: `Error --AND--|NOT|-- Reset --> Alarma`,
            il: `LD Error\nANDN Reset\nOUT Alarma`
          },
          control_luces: {
            scl: `(* Control de luces *)\nVAR_INPUT\n    Encender : BOOL;\n    Apagar : BOOL;\nEND_VAR\nVAR_OUTPUT\n    LuzON : BOOL;\nEND_VAR\nLuzON := Encender AND NOT Apagar;`,
            ladder: `| Encender |----| |----|/|----( LuzON )\n| Apagar |`,
            fbd: `Encender --AND--|NOT|-- Apagar --> LuzON`,
            il: `LD Encender\nANDN Apagar\nOUT LuzON`
          },
          control_puerta: {
            scl: `(* Control de puerta automática *)\nVAR_INPUT\n    Abrir : BOOL;\n    Cerrar : BOOL;\nEND_VAR\nVAR_OUTPUT\n    PuertaON : BOOL;\nEND_VAR\nPuertaON := Abrir AND NOT Cerrar;`,
            ladder: `| Abrir |----| |----|/|----( PuertaON )\n| Cerrar |`,
            fbd: `Abrir --AND--|NOT|-- Cerrar --> PuertaON`,
            il: `LD Abrir\nANDN Cerrar\nOUT PuertaON`
          },
          contaje_objetos: {
            scl: `(* Contaje de objetos *)\nVAR_INPUT\n    SensorObj : BOOL;\nEND_VAR\nVAR\n    Contador : DINT := 0;\nEND_VAR\nIF SensorObj THEN\n    Contador := Contador + 1;\nEND_IF;`,
            ladder: `| SensorObj |----| |----( Contador+1 )`,
            fbd: `SensorObj --> Contador+1`,
            il: `LD SensorObj\nINC Contador`
          },
          control_ventilador: {
            scl: `(* Control de ventilador *)\nVAR_INPUT\n    Encender : BOOL;\n    Apagar : BOOL;\nEND_VAR\nVAR_OUTPUT\n    VentiladorON : BOOL;\nEND_VAR\nVentiladorON := Encender AND NOT Apagar;`,
            ladder: `| Encender |----| |----|/|----( VentiladorON )\n| Apagar |`,
            fbd: `Encender --AND--|NOT|-- Apagar --> VentiladorON`,
            il: `LD Encender\nANDN Apagar\nOUT VentiladorON`
          }
        };
        let code = '';
        if (preset && processTemplates[preset]) {
          code = processTemplates[preset][language] || processTemplates[preset]['scl'];
          code = `(*\n  PROCESO ESTÁNDAR: ${document.getElementById('preset-process').selectedOptions[0].text}\n  MARCA: ${plcBrand}${plcModel ? ` (${plcModel})` : ''}\n  LENGUAJE: ${language.toUpperCase()}\n  FECHA: ${new Date().toLocaleDateString()}\n*)\n\n` + code;
        } else {
          // Generación avanzada local (nivel senior)
          code = `(*\n  PROGRAMA PLC GENERADO LOCALMENTE\n  MARCA: ${plcBrand}${plcModel ? ` (${plcModel})` : ''}\n  LENGUAJE: ${language.toUpperCase()}\n  REQUERIMIENTOS: ${prompt}\n  AUTOR: Ingeniero Senior - AI Studio\n  FECHA: ${new Date().toLocaleDateString()}\n*)\n\nPROGRAM Main\nVAR_INPUT\n    StartButton : BOOL; // Botón de arranque\n    StopButton  : BOOL; // Botón de paro\n    SensorOK    : BOOL; // Sensor de estado\n    Emergency   : BOOL; // Paro de emergencia\nEND_VAR\n\nVAR_OUTPUT\n    PumpCmd : BOOL; // Comando de bomba\n    Alarm   : BOOL; // Alarma general\n    Status  : INT;  // Estado del sistema\nEND_VAR\n\nVAR\n    Running : BOOL;\n    Fault   : BOOL;\n    CycleCount : DINT;\n    LastError  : STRING[64];\nEND_VAR\n\n(* Lógica avanzada de control *)\nIF Emergency THEN\n    Running := FALSE;\n    Fault := TRUE;\n    LastError := 'Paro de emergencia activado';\nELSIF StartButton AND NOT StopButton AND SensorOK THEN\n    Running := TRUE;\n    Fault := FALSE;\n    LastError := '';\nELSIF StopButton OR NOT SensorOK THEN\n    Running := FALSE;\n    Fault := TRUE;\n    LastError := 'Sensor no OK o paro manual';\nEND_IF;\n\nIF Running THEN\n    PumpCmd := TRUE;\n    Status := 1;\n    CycleCount := CycleCount + 1;\nELSE\n    PumpCmd := FALSE;\n    Status := 0;\nEND_IF;\n\nAlarm := Fault;\n\n(* Diagnóstico y registro de errores *)\nIF Fault THEN\n    // Aquí se puede agregar lógica de registro avanzado\nEND_IF;\n\nEND_PROGRAM`;
        }
    codeDisplay.textContent = '⚠️ La API Key de IA no se detectó como válida. El código generado es local y puede requerir ajustes manuales.\n\n' + code.replace(/\\n/g, '\n');
    let downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) downloadBtn.style.display = 'flex';
    if (window.showDownloadBtn) window.showDownloadBtn(code.replace(/\\n/g, '\n'));
  }

  try {
    let generated = '';
    let iaError = false;
    if (provider === 'gemini') {
      // Intenta primero con gemini-pro
      let geminiModel = 'gemini-pro';
      let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [ { text: fullPrompt } ] }
          ]
        })
      });
      if (response.status === 404) {
        // Si da 404, prueba con gemini-pro-vision
        geminiModel = 'gemini-pro-vision';
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { parts: [ { text: fullPrompt } ] }
            ]
          })
        });
        if (response.status === 404) {
          iaError = true;
        }
      }
      if (!iaError && !response.ok) {
        throw new Error('Error de API: ' + response.statusText);
      }
      if (!iaError) {
        const result = await response.json();
        generated = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    } else if (provider === 'openai') {
      // Usa el modelo OpenAI actual (ejemplo: gpt-4o)
      const openaiModel = 'gpt-4o';
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [
            { role: 'system', content: 'Eres un experto en programación de PLCs. Genera solo el código solicitado, sin explicaciones.' },
            { role: 'user', content: fullPrompt }
          ],
          max_tokens: 2048,
          temperature: 0.7
        })
      });
      if (!response.ok) {
        iaError = true;
      } else {
        const result = await response.json();
        generated = result.choices?.[0]?.message?.content?.trim() || '';
      }
    }
    if (iaError || !generated) {
      // Si falla la IA, genera localmente y muestra aviso
      generateLocalCode();
    } else {
      codeDisplay.textContent = generated;
      let downloadBtn = document.getElementById('download-btn');
      if (downloadBtn) downloadBtn.style.display = 'flex';
      if (window.showDownloadBtn) window.showDownloadBtn(generated);
    }
  } catch (err) {
    // Si hay error, genera localmente y muestra aviso
    generateLocalCode();
  }
});
