import type { CompoundInterestResult } from '../lib/types';

export function compoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundPerYear: number = 1
): CompoundInterestResult {
  const rate = annualRate / 100;
  const steps: CompoundInterestResult['steps'] = [];
  const yearlyBreakdown: CompoundInterestResult['yearlyBreakdown'] = [];

  let balance = principal;
  for (let y = 1; y <= years; y++) {
    const interestEarned = balance * (Math.pow(1 + rate / compoundPerYear, compoundPerYear) - 1);
    balance = balance * Math.pow(1 + rate / compoundPerYear, compoundPerYear);
    const stepInterest = balance * (Math.pow(1 + rate / compoundPerYear, compoundPerYear) - 1);

    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance * 100) / 100,
      interest: Math.round((balance - principal - yearlyBreakdown.reduce((a, b) => a + b.interest, 0)) * 100) / 100,
    });

    steps.push({
      step: y,
      label: `${y}. Yıl Sonu`,
      formula: `${Math.round(balance / Math.pow(1 + rate / compoundPerYear, compoundPerYear) * 100) / 100} × (1 + ${rate}/${compoundPerYear})^(${compoundPerYear}×${y})`,
      value: Math.round(balance * 100) / 100,
    });
  }

  const finalBalance = Math.round(balance * 100) / 100;
  const netGain = Math.round((finalBalance - principal) * 100) / 100;

  // Recalculate yearly interest properly
  let prevBalance = principal;
  for (let y = 0; y < yearlyBreakdown.length; y++) {
    const balAtEnd = yearlyBreakdown[y].balance;
    yearlyBreakdown[y].interest = Math.round((balAtEnd - prevBalance) * 100) / 100;
    prevBalance = balAtEnd;
  }

  return {
    type: 'compound_interest',
    principal,
    rate: annualRate,
    years,
    maturity: finalBalance,
    netGain,
    steps,
    yearlyBreakdown,
  };
}

export function simpleInterest(principal: number, annualRate: number, years: number): number {
  return principal * (1 + (annualRate / 100) * years);
}

export function effectiveAnnualRate(nominalRate: number, compoundPerYear: number): number {
  return (Math.pow(1 + nominalRate / 100 / compoundPerYear, compoundPerYear) - 1) * 100;
}
