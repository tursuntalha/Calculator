import type { CalculationResult } from '../lib/types';
import { CompoundChart } from './CompoundChart';
import { AmortizationTable } from './AmortizationTable';
import { TaxBreakdown } from './TaxBreakdown';

interface Props {
  result: CalculationResult;
}

export function ResultCard({ result }: Props) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--surface) p-4 space-y-4">
      <div className="text-lg font-semibold text-(--primary)">
        {result.type === 'compound_interest' && 'Bileşik Faiz Hesabı'}
        {result.type === 'mortgage' && 'Konut Kredisi Hesabı'}
        {result.type === 'tax_tr' && 'Vergi Hesabı'}
        {result.type === 'currency' && 'Döviz Çevirici'}
      </div>

      <div className="space-y-1 text-sm">
        {result.type === 'compound_interest' && (
          <>
            <p>Anapara: <strong>{result.principal.toLocaleString('tr-TR')} TL</strong></p>
            <p>Faiz: <strong>%{result.rate}</strong></p>
            <p>Süre: <strong>{result.years} yıl</strong></p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              Vade Sonu: {result.maturity.toLocaleString('tr-TR')} TL
            </p>
            <p>Net Kazanç: {result.netGain.toLocaleString('tr-TR')} TL</p>
            <CompoundChart data={result.yearlyBreakdown} />
          </>
        )}
        {result.type === 'mortgage' && (
          <>
            <p>Kredi Tutarı: <strong>{result.principal.toLocaleString('tr-TR')} TL</strong></p>
            <p>Yıllık Faiz: <strong>%{result.annualRate}</strong></p>
            <p>Vade: <strong>{result.years} yıl</strong></p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              Aylık Taksit: {result.monthlyPayment.toLocaleString('tr-TR')} TL
            </p>
            <p>Toplam Ödeme: {result.totalPayment.toLocaleString('tr-TR')} TL</p>
            <p>Toplam Faiz: {result.totalInterest.toLocaleString('tr-TR')} TL</p>
            <AmortizationTable schedule={result.amortizationSchedule.slice(0, 12)} total={result.amortizationSchedule.length} />
          </>
        )}
        {result.type === 'tax_tr' && (
          <TaxBreakdown result={result} />
        )}
        {result.type === 'currency' && (
          <>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {result.amount} {result.from} = {result.result} {result.to}
            </p>
            <p className="text-sm text-gray-500">Kur: 1 {result.from} = {result.rate} {result.to}</p>
          </>
        )}
      </div>
    </div>
  );
}
