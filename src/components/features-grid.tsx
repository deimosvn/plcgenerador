'use client';

import React from 'react';

interface FeaturesGridProps {
  compact?: boolean;
}

export function FeaturesGrid({ compact = false }: FeaturesGridProps) {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Google Gemini generates optimal PLC code',
    },
    {
      icon: '📦',
      title: 'Multi-Brand',
      description: 'Supports Siemens, AB, Mitsubishi, Omron',
    },
    {
      icon: '💬',
      title: 'Multi-Language',
      description: 'Ladder, ST, FBD, IL, Python',
    },
    {
      icon: '⚡',
      title: 'Instant Export',
      description: 'Download as TXT or ZIP with documentation',
    },
    {
      icon: '📚',
      title: 'Templates',
      description: '8+ pre-built project templates',
    },
    {
      icon: '💾',
      title: 'History',
      description: 'Save and restore your projects',
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'No data stored, private API calls',
    },
    {
      icon: '⚙️',
      title: 'Professional',
      description: 'Production-ready code output',
    },
  ];

  const gridCols = compact ? 'grid-cols-2 gap-3' : 'grid-cols-2 sm:grid-cols-4 gap-4';

  return (
    <div className={`grid ${gridCols}`}>
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all"
        >
          <div className="text-3xl mb-2">{feature.icon}</div>
          <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
          <p className="text-xs text-slate-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
