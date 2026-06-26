import { describe, it, expect } from 'vitest';
import { mortgage } from '../engine/mortgage';

describe('mortgage', () => {
  it('should calculate monthly payment correctly', () => {
    const result = mortgage(200000, 6, 30);
    expect(result.type).toBe('mortgage');
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(result.principal);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.amortizationSchedule).toHaveLength(360);
  });

  it('should have decreasing interest over time', () => {
    const result = mortgage(100000, 5, 15);
    const firstPayment = result.amortizationSchedule[0];
    const lastPayment = result.amortizationSchedule[result.amortizationSchedule.length - 1];
    expect(firstPayment.interest).toBeGreaterThan(lastPayment.interest);
  });

  it('should end with zero balance', () => {
    const result = mortgage(50000, 4, 10);
    expect(result.amortizationSchedule[result.amortizationSchedule.length - 1].balance).toBe(0);
  });
});
