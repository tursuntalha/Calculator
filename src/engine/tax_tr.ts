import type { TaxResult } from '../lib/types';

const BRACKETS_2024: { min: number; max: number | null; rate: number }[] = [
  { min: 0, max: 110000, rate: 0.15 },
  { min: 110000, max: 230000, rate: 0.20 },
  { min: 230000, max: 580000, rate: 0.27 },
  { min: 580000, max: 3000000, rate: 0.35 },
  { min: 3000000, max: null, rate: 0.40 },
];

export function taxTr(grossMonthly: number): TaxResult {
  const grossAnnual = grossMonthly * 12;

  const sgkEmployee = grossAnnual * 0.14;
  const sgkEmployer = grossAnnual * 0.155;
  const stampTax = grossAnnual * 0.00759;

  const taxableIncome = grossAnnual - sgkEmployee;

  let remaining = taxableIncome;
  let incomeTax = 0;
  const brackets: TaxResult['brackets'] = [];

  for (const b of BRACKETS_2024) {
    if (remaining <= 0) break;
    const taxableInBracket = b.max !== null
      ? Math.min(remaining, b.max - b.min)
      : remaining;
    const taxInBracket = taxableInBracket * b.rate;
    incomeTax += taxInBracket;
    brackets.push({
      min: b.min,
      max: b.max,
      rate: b.rate,
      amount: Math.round(taxInBracket * 100) / 100,
    });
    remaining -= taxableInBracket;
  }

  const totalDeductions = sgkEmployee + incomeTax + stampTax;
  const netAnnual = grossAnnual - totalDeductions;
  const netMonthly = netAnnual / 12;

  return {
    type: 'tax_tr',
    grossMonthly: Math.round(grossMonthly * 100) / 100,
    grossAnnual: Math.round(grossAnnual * 100) / 100,
    sgk: Math.round(sgkEmployee * 100) / 100,
    sgkEmployer: Math.round(sgkEmployer * 100) / 100,
    incomeTax: Math.round(incomeTax * 100) / 100,
    stampTax: Math.round(stampTax * 100) / 100,
    netMonthly: Math.round(netMonthly * 100) / 100,
    netAnnual: Math.round(netAnnual * 100) / 100,
    brackets,
  };
}
