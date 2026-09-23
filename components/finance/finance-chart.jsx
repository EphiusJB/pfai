'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

// Compact y-axis labels so the axis stays narrow on phones (1500 -> 1.5k).
const compact = (v) => (Math.abs(v) >= 1000 ? `${+(v / 1000).toFixed(1)}k` : v);

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '8px',
};

export function FinanceChart({ transactions }) {
  const [chartType, setChartType] = useState('line');

  // Group transactions by day
  const chartData = [...transactions]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .reduce((acc, currentTransaction) => {
      const dateStr = new Date(currentTransaction.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      let existing = acc.find((item) => item.date === dateStr);
      if (!existing) {
        existing = { date: dateStr, income: 0, expense: 0, net: 0 };
        acc.push(existing);
      }

      const amount = Number(currentTransaction.amount) || 0;
      if (currentTransaction.type === 'income') {
        existing.income += amount;
      } else if (currentTransaction.type === 'expense') {
        existing.expense += amount;
      }

      existing.net = existing.income - existing.expense;
      return acc;
    }, []);

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 text-muted-foreground">
        No transaction data to display
      </div>
    );
  }

  const axisProps = { stroke: 'rgba(255,255,255,0.5)', tick: { fontSize: 11 } };
  const margin = { top: 8, right: 8, bottom: 0, left: -12 };

  return (
    <div className="w-full space-y-4">
      <div className="inline-flex gap-1 rounded-lg bg-muted/30 p-1 sm:gap-2 sm:bg-transparent sm:p-0">
        {[
          ['line', 'Line Chart'],
          ['bar', 'Bar Chart'],
        ].map(([type, label]) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            aria-pressed={chartType === type}
            className={`px-3 py-2 sm:py-1 text-sm sm:text-xs rounded transition-colors ${
              chartType === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Height is CSS-driven so the chart is shorter on phones */}
      <div className="h-60 w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData} margin={margin}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" interval="preserveStartEnd" minTickGap={24} {...axisProps} />
              <YAxis tickFormatter={compact} width={44} {...axisProps} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="income" stroke="#00ff00" name="Income" dot={false} />
              <Line type="monotone" dataKey="expense" stroke="#ff6b6b" name="Expense" dot={false} />
              <Line type="monotone" dataKey="net" stroke="#4a9eff" name="Net" dot={false} />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={margin}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" interval="preserveStartEnd" minTickGap={24} {...axisProps} />
              <YAxis tickFormatter={compact} width={44} {...axisProps} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" fill="#00ff00" name="Income" />
              <Bar dataKey="expense" fill="#ff6b6b" name="Expense" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
