'use client';

import React from 'react';

export const TEMPLATE_LIBRARY = {
  'Control de motores': {
    description: 'Arrancador trifásico con soft-start y protección térmica',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    template: 'Diseña un control de motor trifásico que:\n1. Ejecute arranque suave para reducir la corriente de irrupción\n2. Supervise temperatura y corriente del motor en tiempo real\n3. Desconecte mediante protección térmica si supera 80 °C\n4. Incluya paro de emergencia con enclavamiento\n5. Publique estados (marcha, fallo, detenido)\n6. Reporte alarmas a un relé de seguridad externo',
  },
  'Nivel de tanque': {
    description: 'Supervisión de nivel y control de bomba',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    template: 'Implementa un control de nivel que:\n1. Lea un transmisor analógico de 4-20 mA\n2. Arranque la bomba si el nivel cae por debajo del 30 %\n3. Detenga la bomba al llegar al 95 %\n4. Dispare alarma sonora al 100 %\n5. Encienda baliza por nivel bajo al 5 %\n6. Evite marcha en seco de la bomba\n7. Permita modo manual/automático con enclavamiento',
  },
  'Transportador inteligente': {
    description: 'Cinta con enclavamientos y control de velocidad',
    icon: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4',
    template: 'Construye el control de una banda transportadora que:\n1. Permita operación avance/retroceso con rampa de velocidad\n2. Pare inmediatamente si se abre una guarda de seguridad\n3. Supervise sobrecarga del motor y emita alarma\n4. Integre paro de emergencia en serie con otras líneas\n5. Utilice encoder para medir pulsos de velocidad real\n6. Gestione ramp-up y ramp-down configurables\n7. Lleve contador de piezas producidas',
  },
  'Temperatura crítica': {
    description: 'Calefacción/enfriamiento gobernado por PID',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    template: 'Desarrolla un control de temperatura que:\n1. Acepte entrada Pt100 o termopar\n2. Module un SSR de calefacción mediante PWM\n3. Regule un ventilador de enfriamiento con PWM\n4. Ejecute PID con ajuste para alcanzar el setpoint\n5. Corte todo si la temperatura supera 150 °C\n6. Genere alarma si se desvía ±5 °C del setpoint\n7. Incluya rampas configurables para puesta en marcha',
  },
  'Secuencia de iluminación': {
    description: 'Efecto escalonado para seguridad o espectáculo',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    template: 'Programa una secuencia de luces que:\n1. Encienda las luminarias 1-5 con retardo de 200 ms\n2. Apague todas en 500 ms con efecto fade\n3. Repita el ciclo cada 3 s\n4. Incluya interruptor manual on/off\n5. Agregue botón de blackout de emergencia\n6. Registre cada activación en un contador de ciclos',
  },
  'Presión y compresor': {
    description: 'Supervisión de red neumática con alarmas',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    template: 'Configura el control de presión que:\n1. Lea un transmisor 0-10 V (0-100 bar)\n2. Arranque el compresor si la presión < 80 bar\n3. Detenga el compresor si la presión > 95 bar\n4. Abra válvula de alivio a 100 bar\n5. Detenga el sistema > 110 bar\n6. Genere alarma si la presión cae 50 bar en 1 s\n7. Genere bit de mantenimiento preventivo cada 500 ciclos',
  },
  'Control de acceso': {
    description: 'Puerta segura con autenticación y registros',
    icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z',
    template: 'Crea un control de puerta inteligente que:\n1. Lea credenciales RFID o PIN\n2. Valide contra una lista de acceso\n3. Desbloquee por 3 s si es autorizado\n4. Envíe señal sonora por intentos fallidos\n5. Registre fecha/hora/usuario en memoria\n6. Integre salida hacia panel de alarmas\n7. Permita apertura manual por supervisor',
  },
  'Distribución de potencia': {
    description: 'Balanceo de carga y transferencia automática',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    template: 'Diseña un gestor de energía que:\n1. Supervise consumo en tres circuitos trifásicos\n2. Balancee carga moviendo alimentadores secundarios\n3. Desconecte cargas según prioridad en picos\n4. Detecte estado del UPS y tiempo restante\n5. Coordine transferencia a generador\n6. Monitoree calidad (THD, caídas) y registre eventos\n7. Entregue reporte diario de demanda máxima',
  },
} as const;

interface TemplateBrowserProps {
  onSelectTemplate: (template: string) => void;
}

export function TemplateBrowser({ onSelectTemplate }: TemplateBrowserProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Plantillas rápidas</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(TEMPLATE_LIBRARY).map(([name, { description, icon, template }]) => (
          <button
            key={name}
            onClick={() => onSelectTemplate(template)}
            className="text-left p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all group shadow-sm"
            title={description}
          >
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-sky-100 transition-colors">
                <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800 group-hover:text-sky-600 transition-colors">
                  {name}
                </p>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
