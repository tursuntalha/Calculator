import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage } from '../lib/types';

const HISTORY_KEY = 'fincalc_history';

export function useHistory() {
  const [history, setHistory] = useState<ChatMessage[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((msg: ChatMessage) => {
    setHistory((prev) => {
      const updated = [...prev, msg];
      return updated.slice(-100); // keep last 100
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
