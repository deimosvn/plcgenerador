// ─────────────────────────────────────────────────────────────
// Generación del "dossier" PDF del proyecto PLC (lado cliente).
// Construye un documento profesional con portada, metadata, código,
// checklist y aviso de seguridad usando jsPDF.
// ─────────────────────────────────────────────────────────────

import { PLC_BRANDS } from './constants';
import { calculateCodeStats, formatTimestamp } from './utils';
import type { GenerationResult, PLCBrandKey } from '@/types';

const BLUE: [number, number, number] = [37, 99, 235];
const DARK: [number, number, number] = [15, 23, 42];
const GRAY: [number, number, number] = [100, 116, 139];

// jsPDF se carga de forma diferida para no inflar el bundle inicial.
export async function exportProjectPdf(result: GenerationResult): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const brand = PLC_BRANDS[result.plcBrand as PLCBrandKey];
  const stats = result.codeStats || calculateCodeStats(result.code);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = margin;

  // ─── Helpers ───
  const ensure = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const heading = (text: string) => {
    ensure(14);
    doc.setFillColor(...BLUE);
    doc.rect(margin, y, 3, 6, 'F');
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(text, margin + 6, y + 5);
    y += 11;
  };

  const paragraph = (text: string, size = 10, color: [number, number, number] = DARK) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentW) as string[];
    for (const line of lines) {
      ensure(size * 0.5);
      doc.text(line, margin, y);
      y += size * 0.5;
    }
    y += 2;
  };

  const kvRow = (k: string, v: string) => {
    ensure(7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(k, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    const vLines = doc.splitTextToSize(v, contentW - 55) as string[];
    doc.text(vLines, margin + 52, y);
    y += Math.max(6, vLines.length * 5);
  };

  // ─── Portada ───
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, 70, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('Dossier de Proyecto PLC', margin, 34);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Generado por PLC AI Studio', margin, 44);
  doc.setTextColor(96, 165, 250);
  doc.text(`${brand?.label || result.plcBrand}  ·  ${result.language.toUpperCase()}`, margin, 54);

  y = 86;
  heading('Información del proyecto');
  kvRow('Fabricante', brand?.manufacturer || result.plcBrand);
  kvRow('Modelo', `${brand?.model || 'Estándar'}${result.plcModel ? ` (${result.plcModel})` : ''}`);
  kvRow('Lenguaje', result.language.toUpperCase());
  kvRow('Software', brand?.software || 'IDE del fabricante');
  kvRow('Extensión', brand?.ext || '.txt');
  kvRow('Protocolos', brand?.protocols?.join(', ') || 'N/A');
  kvRow('Fecha', formatTimestamp(result.timestamp));
  y += 3;

  heading('Requerimiento original');
  paragraph(result.description || 'Sin descripción.', 10, GRAY);

  heading('Estadísticas del código');
  kvRow('Líneas totales', String(stats.totalLines));
  kvRow('Líneas de código', String(stats.codeLines));
  kvRow('Comentarios', String(stats.commentLines));
  kvRow('Variables', String(stats.variables));
  kvRow('Funciones / bloques', String(stats.functions));

  // ─── Código fuente ───
  doc.addPage();
  y = margin;
  heading(`Código fuente — main_program${brand?.ext || '.txt'}`);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...DARK);
  const codeLines = result.code.split('\n');
  for (let i = 0; i < codeLines.length; i++) {
    const wrapped = doc.splitTextToSize(codeLines[i] || ' ', contentW - 12) as string[];
    for (const w of wrapped) {
      ensure(4);
      doc.setTextColor(...GRAY);
      doc.text(String(i + 1).padStart(3, ' '), margin, y);
      doc.setTextColor(...DARK);
      doc.text(w, margin + 10, y);
      y += 4;
    }
  }
  y += 4;

  // ─── Checklist ───
  heading('Lista de verificación pre-despliegue');
  const checklist = [
    'Verificar direcciones de I/O contra el diagrama eléctrico',
    'Validar tiempos de respuesta de temporizadores',
    'Comprobar enclavamientos de seguridad',
    'Ejecutar pruebas de paro de emergencia',
    'Documentar parámetros de comunicación',
    'Respaldar el programa antes de transferir',
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  for (const item of checklist) {
    ensure(7);
    doc.setDrawColor(...GRAY);
    doc.rect(margin, y - 3.2, 3.5, 3.5);
    doc.setTextColor(...DARK);
    doc.text(item, margin + 7, y);
    y += 6.5;
  }
  y += 3;

  // ─── Aviso de seguridad ───
  heading('Aviso de seguridad');
  ensure(20);
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  const noteText =
    'IMPORTANTE: Este código fue generado por IA y debe ser revisado y validado por un ingeniero ' +
    'calificado. Realiza pruebas FAT/SAT documentadas en un entorno controlado antes de su puesta en producción.';
  const noteLines = doc.splitTextToSize(noteText, contentW - 10) as string[];
  const boxH = noteLines.length * 5 + 8;
  doc.rect(margin, y, contentW, boxH, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 53, 15);
  doc.text(noteLines, margin + 5, y + 6);
  y += boxH + 6;

  // ─── Pie de página con numeración ───
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(`PLC AI Studio · ${formatTimestamp(result.timestamp)}`, margin, pageH - 8);
    doc.text(`Página ${p} de ${pages}`, pageW - margin, pageH - 8, { align: 'right' });
  }

  const fileName = `Dossier_PLC_${result.plcBrand.replace(/[\s-]+/g, '_')}_${result.language}.pdf`;
  doc.save(fileName);
}
