import { useState, useCallback } from 'react';
import type { ChatMessage, CalculationResult } from '../lib/types';
import { compoundInterest } from '../engine/interest';
import { mortgage } from '../engine/mortgage';
import { taxTr } from '../engine/tax_tr';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const processQuery = useCallback(async (query: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setLoading(true);

    try {
      // Try to import ollama dynamically - fallback to local parsing if not available
      let intent;
      try {
        const { parseIntent } = await import('../lib/ollama');
        intent = await parseIntent(query);
      } catch {
        // Fallback: simple keyword-based parsing
        intent = fallbackParse(query);
      }

      if (intent.type === 'clarify' || intent.type === 'error') {
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: intent.type === 'clarify'
            ? (intent as any).question || 'Ne hesaplamak istediğinizi anlayamadım. Lütfen faiz, kredi, maaş veya döviz ile ilgili bir soru sorun.'
            : 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
          timestamp: Date.now(),
        };
        addMessage(errorMsg);
        setLoading(false);
        return;
      }

      let result: CalculationResult;

      switch (intent.type) {
        case 'compound_interest': {
          const p = Number(intent.params.principal) || 0;
          const r = Number(intent.params.rate) || 0;
          const n = Number(intent.params.years) || 1;
          result = compoundInterest(p, r, n);
          break;
        }
        case 'mortgage': {
          const p = Number(intent.params.principal) || 0;
          const r = Number(intent.params.annualRate) || 0;
          const n = Number(intent.params.years) || 1;
          result = mortgage(p, r, n);
          break;
        }
        case 'tax_tr': {
          const g = Number(intent.params.grossMonthly) || 0;
          result = taxTr(g);
          break;
        }
        default: {
          const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Bu hesaplama türü henüz desteklenmiyor.',
            timestamp: Date.now(),
          };
          addMessage(errorMsg);
          setLoading(false);
          return;
        }
      }

      const resultMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'result',
        content: formatResultText(result),
        result,
        timestamp: Date.now(),
      };
      addMessage(resultMsg);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: Date.now(),
      };
      addMessage(errorMsg);
    }
    setLoading(false);
  }, [addMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, loading, processQuery, clearChat };
}

function fallbackParse(query: string) {
  const q = query.toLowerCase();

  // Tax
  if (q.includes('maaş') || q.includes('maas') || q.includes('vergi') || q.includes('sgk')) {
    const numbers = extractNumbers(query);
    return { type: 'tax_tr' as const, params: { grossMonthly: numbers[0] || 30000 }, originalQuery: query };
  }

  // Mortgage
  if (q.includes('kredi') || q.includes('mortgage') || q.includes('konut') || q.includes('ev kredisi')) {
    const numbers = extractNumbers(query);
    return {
      type: 'mortgage' as const,
      params: { principal: numbers[0] || 200000, annualRate: numbers[1] || 14.4, years: numbers[2] || 10 },
      originalQuery: query,
    };
  }

  // Compound interest
  if (q.includes('faiz') || q.includes('birikim') || q.includes('yatırım') || q.includes('yatirim')) {
    const numbers = extractNumbers(query);
    return {
      type: 'compound_interest' as const,
      params: { principal: numbers[0] || 10000, rate: numbers[1] || 10, years: numbers[2] || 3 },
      originalQuery: query,
    };
  }

  return { type: 'clarify' as const, params: {}, question: 'Ne hesaplamak istiyorsunuz? (faiz, kredi, maaş)', originalQuery: query };
}

function extractNumbers(text: string): number[] {
  // Turkish format: "500.000" -> 500000, "1.500,50" -> 1500.50
  const cleaned = text
    .replace(/\./g, '')
    .replace(',', '.');
  const matches = cleaned.match(/\d+(\.\d+)?/g);
  return matches ? matches.map(Number).filter((n) => n > 0) : [];
}

function formatResultText(result: CalculationResult): string {
  switch (result.type) {
    case 'compound_interest':
      return `${result.principal.toLocaleString('tr-TR')} TL anapara, %${result.rate} faizle ${result.years} yıl sonra **${result.maturity.toLocaleString('tr-TR')} TL** olur. Net kazanç: ${result.netGain.toLocaleString('tr-TR')} TL`;
    case 'mortgage':
      return `Aylık taksit: **${result.monthlyPayment.toLocaleString('tr-TR')} TL**\nToplam ödeme: ${result.totalPayment.toLocaleString('tr-TR')} TL\nToplam faiz: ${result.totalInterest.toLocaleString('tr-TR')} TL`;
    case 'tax_tr':
      return `Brüt: ${result.grossMonthly.toLocaleString('tr-TR')} TL/ay\nSGK: -${result.sgk.toLocaleString('tr-TR')} TL/yıl\nGelir Vergisi: -${result.incomeTax.toLocaleString('tr-TR')} TL/yıl\nDamga Vergisi: -${result.stampTax.toLocaleString('tr-TR')} TL/yıl\n**Net: ${result.netMonthly.toLocaleString('tr-TR')} TL/ay**`;
    case 'currency':
      return `${result.amount} ${result.from} = **${result.result} ${result.to}** (Kur: ${result.rate})`;
    default:
      return '';
  }
}
