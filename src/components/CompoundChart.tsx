import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  data: { year: number; balance: number; interest: number }[];
}

export function CompoundChart({ data }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="year" label={{ value: 'Yıl', position: 'bottom' }} stroke="var(--fg)" />
          <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}B`} stroke="var(--fg)" />
          <Tooltip
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}
            formatter={(value: number) => [`${value.toLocaleString('tr-TR')} TL`]}
          />
          <Bar dataKey="balance" fill="var(--primary)" name="Bakiye" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
