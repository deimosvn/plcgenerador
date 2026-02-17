'use client';

import React, { useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export function Toast({ message, type }: ToastProps) {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className={`${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse`}>
      <span className="font-bold text-lg">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
