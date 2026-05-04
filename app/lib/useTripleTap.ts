"use client";

import { useRef, useCallback } from "react";

/**
 * Retorna um onClick handler que dispara onTriple quando 3 cliques
 * acontecerem dentro de `windowMs` ms. Útil pra gestos secretos
 * (acesso a painel de apresentadora, modo dev, etc.) sem expor o
 * controle na UI.
 */
export function useTripleTap(onTriple: () => void, windowMs = 1000) {
  const tapsRef = useRef<number[]>([]);

  return useCallback(() => {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current.filter((t) => now - t < windowMs), now];
    if (tapsRef.current.length >= 3) {
      tapsRef.current = [];
      onTriple();
    }
  }, [onTriple, windowMs]);
}
