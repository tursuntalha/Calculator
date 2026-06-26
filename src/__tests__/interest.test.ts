import { describe, it, expect } from 'vitest';
import { compoundInterest, simpleInterest, effectiveAnnualRate } from '../engine/interest';

describe('compoundInterest', () => {
  it('should calculate compound interest correctly', () => {
    const result = compoundInterest(1000, 10, 3);
    expect(result.type).toBe('compound_interest');
    expect(result.maturity).toBeCloseTo(1331, 0);
    expect(result.netGain).toBeCloseTo(331, 0);
    expect(result.yearlyBreakdown).toHaveLength(3);
  });

  it('should handle zero principal', () => {
    const result = compoundInterest(0, 10, 5);
    expect(result.maturity).toBe(0);
    expect(result.netGain).toBe(0);
  });

  it('should handle zero rate', () => {
    const result = compoundInterest(1000, 0, 5);
    expect(result.maturity).toBe(1000);
  });

  it('should handle 1 year correctly', () => {
    const result = compoundInterest(1000, 50, 1);
    expect(result.maturity).toBeCloseTo(1500, 0);
  });
});

describe('simpleInterest', () => {
  it('should calculate simple interest', () => {
    expect(simpleInterest(1000, 10, 3)).toBeCloseTo(1300, 0);
  });
});

describe('effectiveAnnualRate', () => {
  it('should calculate EAR for monthly compounding', () => {
    const ear = effectiveAnnualRate(12, 12);
    expect(ear).toBeGreaterThan(12);
  });
});
