import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TaxResult } from '../lib/types';

interface Props {
  result: TaxResult;
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];

export function TaxBreakdown({ result }: Props) {
  const data = [
    { name: 'Net', value: result.netAnnual },
    { name: 'SGK', value: result.sgk },
    { name: 'Gelir Vergisi', value: result.incomeTax },
    { name: 'Damga Vergisi', value: result.stampTax },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20">
          <p className="text-xs text-gray-500">Brüt Aylık</p>
          <p className="font-semibold">{result.grossMonthly.toLocaleString('tr-TR')} TL</p>
        </div>
        <div className="p-2 rounded bg-green-50 dark:bg-green-900/20">
          <p className="text-xs text-gray-500">Net Aylık</p>
          <p className="font-semibold text-green-600 dark:text-green-400">{result.netMonthly.toLocaleString('tr-TR')} TL</p>
        </div>
        <div className="p-2 rounded bg-red-50 dark:bg-red-900/20">
          <p className="text-xs text-gray-500">SGK (%14)</p>
          <p className="font-semibold text-red-500">{result.sgk.toLocaleString('tr-TR')} TL/yıl</p>
        </div>
        <div className="p-2 rounded bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-xs text-gray-500">Gelir Vergisi</p>
          <p className="font-semibold text-yellow-600">{result.incomeTax.toLocaleString('tr-TR')} TL/yıl</p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `${v.toLocaleString('tr-TR')} TL`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs space-y-1">
        <p><span className="text-gray-500">Dilimler:</span></p>
        {result.brackets.map((b, i) => (
          <p key={i} className={b.amount > 0 ? '' : 'text-gray-400'}>
            {b.min.toLocaleString('tr-TR')} - {b.max ? b.max.toLocaleString('tr-TR') + ' TL' : '∞'} | %{b.rate * 100} = {b.amount.toLocaleString('tr-TR')} TL
          </p>
        ))}
      </div>
    </div>
  );
}
