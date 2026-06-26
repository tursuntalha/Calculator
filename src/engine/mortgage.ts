import type { MortgageResult } from '../lib/types';

export function mortgage(
  principal: number,
  annualRatePercent: number,
  years: number
): MortgageResult {
  const monthlyRate = annualRatePercent / 100 / 12;
  const numPayments = years * 12;

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  let balance = principal;
  const schedule: MortgageResult['amortizationSchedule'] = [];

  for (let i = 1; i <= numPayments; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    if (balance < 0) balance = 0;

    schedule.push({
      paymentNo: i,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  const totalPayment = Math.round(monthlyPayment * numPayments * 100) / 100;
  const totalInterest = Math.round((totalPayment - principal) * 100) / 100;

  return {
    type: 'mortgage',
    principal,
    annualRate: annualRatePercent,
    years,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment,
    totalInterest,
    amortizationSchedule: schedule,
  };
}
