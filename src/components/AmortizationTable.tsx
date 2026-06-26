interface Props {
  schedule: { paymentNo: number; payment: number; principal: number; interest: number; balance: number }[];
  total: number;
}

export function AmortizationTable({ schedule, total }: Props) {
  return (
    <div className="overflow-x-auto max-h-48 overflow-y-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-(--border)">
            <th className="text-left p-1">#</th>
            <th className="text-right p-1">Taksit</th>
            <th className="text-right p-1">Anapara</th>
            <th className="text-right p-1">Faiz</th>
            <th className="text-right p-1">Kalan</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row) => (
            <tr key={row.paymentNo} className="border-b border-(--border) hover:bg-(--border)/30">
              <td className="p-1">{row.paymentNo}</td>
              <td className="text-right p-1">{row.payment.toLocaleString('tr-TR')}</td>
              <td className="text-right p-1">{row.principal.toLocaleString('tr-TR')}</td>
              <td className="text-right p-1">{row.interest.toLocaleString('tr-TR')}</td>
              <td className="text-right p-1">{row.balance.toLocaleString('tr-TR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {total > 12 && <p className="text-xs text-gray-500 mt-1">...ve {total - 12} taksit daha</p>}
    </div>
  );
}
