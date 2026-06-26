export interface FormulaStep {
  step: number;
  label: string;
  formula: string;
  value: number;
}

export interface CompoundInterestResult {
  type: 'compound_interest';
  principal: number;
  rate: number;
  years: number;
  maturity: number;
  netGain: number;
  steps: FormulaStep[];
  yearlyBreakdown: { year: number; balance: number; interest: number }[];
}

export interface MortgageResult {
  type: 'mortgage';
  principal: number;
  annualRate: number;
  years: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: {
    paymentNo: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export interface TaxResult {
  type: 'tax_tr';
  grossMonthly: number;
  grossAnnual: number;
  sgk: number;
  sgkEmployer: number;
  incomeTax: number;
  stampTax: number;
  netMonthly: number;
  netAnnual: number;
  brackets: { min: number; max: number | null; rate: number; amount: number }[];
}

export interface CurrencyResult {
  type: 'currency';
  from: string;
  to: string;
  amount: number;
  rate: number;
  result: number;
}

export type CalculationResult =
  | CompoundInterestResult
  | MortgageResult
  | TaxResult
  | CurrencyResult;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'result';
  content: string;
  result?: CalculationResult;
  timestamp: number;
}

export interface ParsedIntent {
  type: 'compound_interest' | 'mortgage' | 'tax_tr' | 'currency';
  params: Record<string, number | string>;
  originalQuery: string;
}
