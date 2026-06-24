'use client';

import React from 'react';
import type { WiringData, WiringConnection } from '@/types';

// ─────────────────────────────────────────────────────────────
// Render determinista de un diagrama de conexión PLC + BOM.
// La IA solo aporta el JSON estructurado; el dibujo lo hacemos aquí
// para que sea fiable y legible con cualquier cantidad de I/O.
// ─────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  DI: '#2563eb',
  AI: '#0891b2',
  DO: '#059669',
  AO: '#7c3aed',
};

function colorFor(type: string): string {
  return TYPE_COLOR[type?.toUpperCase()] || '#64748b';
}

const ROW_H = 30;
const SVG_W = 760;
const PLC_W = 150;
const DEV_W = 215;

function DeviceRow({
  conn,
  index,
  side,
  top,
}: {
  conn: WiringConnection;
  index: number;
  side: 'left' | 'right';
  top: number;
}) {
  const y = top + index * ROW_H;
  const color = colorFor(conn.type);
  const cy = y + ROW_H / 2;
  const plcX = (SVG_W - PLC_W) / 2;

  const devX = side === 'left' ? 8 : SVG_W - DEV_W - 8;
  const termX = side === 'left' ? plcX : plcX + PLC_W;
  const lineStart = side === 'left' ? devX + DEV_W : devX;

  return (
    <g>
      {/* línea de conexión */}
      <line x1={lineStart} y1={cy} x2={termX} y2={cy} stroke={color} strokeWidth={1.5} />
      <circle cx={termX} cy={cy} r={3} fill={color} />
      {/* terminal */}
      <text
        x={side === 'left' ? termX - 6 : termX + 6}
        y={cy - 5}
        textAnchor={side === 'left' ? 'end' : 'start'}
        className="fill-slate-500"
        style={{ fontSize: 9, fontFamily: 'monospace' }}
      >
        {conn.terminal}
      </text>
      {/* caja de dispositivo */}
      <rect x={devX} y={y + 3} width={DEV_W} height={ROW_H - 6} rx={5} fill="#fff" stroke={color} strokeWidth={1.2} />
      <rect x={devX} y={y + 3} width={4} height={ROW_H - 6} rx={2} fill={color} />
      <text x={devX + 10} y={cy - 1} className="fill-slate-800" style={{ fontSize: 10, fontWeight: 600 }}>
        {conn.tag}
      </text>
      <text x={devX + 10} y={cy + 9} className="fill-slate-500" style={{ fontSize: 8 }}>
        {(conn.device || '').slice(0, 32)}
      </text>
      <text
        x={devX + DEV_W - 8}
        y={y + 12}
        textAnchor="end"
        style={{ fontSize: 7, fontWeight: 700, fill: color, fontFamily: 'monospace' }}
      >
        {conn.type?.toUpperCase()}
      </text>
    </g>
  );
}

export function WiringDiagram({ data }: { data: WiringData }) {
  const inputs = data.connections.filter((c) => ['DI', 'AI'].includes(c.type?.toUpperCase()));
  const outputs = data.connections.filter((c) => ['DO', 'AO'].includes(c.type?.toUpperCase()));
  const maxRows = Math.max(inputs.length, outputs.length, 1);

  const top = 64;
  const height = top + maxRows * ROW_H + 24;
  const plcX = (SVG_W - PLC_W) / 2;
  const plcH = Math.max(maxRows * ROW_H, ROW_H);

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${height}`}
      className="w-full"
      role="img"
      style={{ minWidth: 680 }}
    >
      <title>Diagrama de conexión del PLC</title>
      <desc>Entradas a la izquierda, salidas a la derecha, conectadas al controlador central.</desc>

      {/* Cabeceras */}
      <text x={8} y={20} className="fill-slate-700" style={{ fontSize: 12, fontWeight: 700 }}>
        Entradas
      </text>
      <text x={SVG_W - 8} y={20} textAnchor="end" className="fill-slate-700" style={{ fontSize: 12, fontWeight: 700 }}>
        Salidas
      </text>
      <text x={SVG_W / 2} y={20} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 9 }}>
        ⚡ {data.powerSupply}
      </text>

      {/* PLC central */}
      <rect x={plcX} y={top} width={PLC_W} height={plcH} rx={8} fill="#0f172a" />
      <rect x={plcX} y={top} width={PLC_W} height={20} rx={8} fill="#1e293b" />
      <text x={plcX + PLC_W / 2} y={top + 14} textAnchor="middle" fill="#e2e8f0" style={{ fontSize: 10, fontWeight: 700 }}>
        PLC
      </text>
      <text
        x={plcX + PLC_W / 2}
        y={top + plcH / 2 + 4}
        textAnchor="middle"
        fill="#94a3b8"
        style={{ fontSize: 9 }}
      >
        {(data.plc || 'Controlador').slice(0, 22)}
      </text>

      {inputs.map((c, i) => (
        <DeviceRow key={`in-${i}`} conn={c} index={i} side="left" top={top} />
      ))}
      {outputs.map((c, i) => (
        <DeviceRow key={`out-${i}`} conn={c} index={i} side="right" top={top} />
      ))}
    </svg>
  );
}
