import { describe, it, expect } from 'vitest';
import { taxTr } from '../engine/tax_tr';

describe('taxTr', () => {
  it('should calculate tax for monthly salary', () => {
    const result = taxTr(30000);
    expect(result.type).toBe('tax_tr');
    expect(result.grossAnnual).toBe(360000);
    expect(result.netMonthly).toBeLessThan(result.grossMonthly);
    expect(result.sgk).toBeGreaterThan(0);
    expect(result.incomeTax).toBeGreaterThan(0);
    expect(result.stampTax).toBeGreaterThan(0);
  });

  it('should have SGK as 14% of annual', () => {
    const result = taxTr(50000);
    expect(result.sgk).toBeCloseTo(50000 * 12 * 0.14, 0);
  });

  it('should handle minimum wage', () => {
    const result = taxTr(17002);
    expect(result.netMonthly).toBeLessThan(result.grossMonthly);
    expect(result.brackets.length).toBeGreaterThanOrEqual(1);
  });

  it('should apply progressive brackets', () => {
    const low = taxTr(20000);
    const high = taxTr(100000);
    const lowTaxRate = low.incomeTax / low.grossAnnual;
    const highTaxRate = high.incomeTax / high.grossAnnual;
    expect(highTaxRate).toBeGreaterThan(lowTaxRate);
  });
});
