import type { CurrencyResult } from '../lib/types';

const CACHE_KEY = 'fincalc_rates';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface RateCache {
  timestamp: number;
  rates: Record<string, number>;
  base: string;
}

export async function fetchRates(): Promise<Record<string, number>> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsed: RateCache = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      return parsed.rates;
    }
  }

  const res = await fetch(
    'https://api.exchangerate-api.com/v4/latest/USD'
  );
  const data = await res.json();
  const rates = data.rates as Record<string, number>;

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), rates, base: 'USD' })
  );

  return rates;
}

export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): CurrencyResult {
  const inUSD = from === 'USD' ? amount : amount / rates[from];
  const result = inUSD * rates[to];

  return {
    type: 'currency',
    from,
    to,
    amount,
    rate: Math.round((rates[to] / (from === 'USD' ? 1 : rates[from])) * 10000) / 10000,
    result: Math.round(result * 100) / 100,
  };
}
