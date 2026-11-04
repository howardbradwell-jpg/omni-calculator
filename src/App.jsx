import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, Calculator, TrendingUp } from 'lucide-react';

export default function App() {
  const [revenue, setRevenue] = useState(125000);
  const [expenses, setExpenses] = useState(25000);

  const netProfit = Math.max(0, revenue - expenses);
  
  // SECA Tax (15.3% on 92.35% of earnings)
  const seTaxable = netProfit * 0.9235;
  const seTax = seTaxable > 0 ? seTaxable * 0.153 : 0;
  const halfSe = seTax / 2;

  // QBI Deduction (20% of Qualified Business Income)
  const qbi = Math.max(0, (netProfit - halfSe) * 0.20);
  
  // 2026 Projected Standard Deduction
  const standardDeduction = 15400; 

  const taxableIncome = Math.max(0, netProfit - halfSe - qbi - standardDeduction);

  // 2026 Marginal Brackets (Approximate Single)
  let incomeTax = 0;
  if (taxableIncome > 0) {
    if (taxableIncome <= 12000) incomeTax = taxableIncome * 0.10;
    else if (taxableIncome <= 48000) incomeTax = 1200 + (taxableIncome - 12000) * 0.12;
    else if (taxableIncome <= 105000) incomeTax = 5520 + (taxableIncome - 48000) * 0.22;
    else incomeTax = 18060 + (taxableIncome - 105000) * 0.24; 
  }

  const totalTax = seTax + incomeTax;
  const takeHome = netProfit - totalTax;
  const taxShield = expenses + halfSe + qbi + standardDeduction;

  const chartData = [
    { name: 'Take-Home Pay', value: takeHome, color: '#10b981' },
    { name: 'SECA Tax (FICA)', value: seTax, color: '#f59e0b' },
    { name: 'Fed Income Tax', value: incomeTax, color: '#3b82f6' }
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center md:justify-start gap-3">
            <Calculator className="w-8 h-8 text-indigo-600" />
            Omni Digital Tax Engine
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Real-time 2026 IRS 1099 Liability & QBI Modeling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Business Metrics
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Gross 1099 Revenue</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-bold">$</span>
                    <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Operating Expenses (Write-offs)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-bold">$</span>
                    <input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-indigo-200" />
                <h3 className="text-sm font-bold tracking-wide uppercase text-indigo-100">Total Tax Shield</h3>
              </div>
              <div className="text-3xl font-extrabold font-mono">{formatCurrency(taxShield)}</div>
              <p className="text-indigo-200 text-sm mt-2 leading-relaxed">Money protected from federal taxes via write-offs, the 20% QBI deduction, and standard deductions.</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Net Profit</p>
                <p className="text-2xl font-extrabold font-mono text-slate-800">{formatCurrency(netProfit)}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center border-b-4 border-b-red-400">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Tax Owed</p>
                <p className="text-2xl font-extrabold font-mono text-red-500">{formatCurrency(totalTax)}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center border-b-4 border-b-emerald-400">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Net Take-Home</p>
                <p className="text-2xl font-extrabold font-mono text-emerald-500">{formatCurrency(takeHome)}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">2026 IRS Ledger Breakdown</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">SECA Tax (15.3%)</span>
                  <span className="font-mono font-medium">{formatCurrency(seTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Half-SE Deduction</span>
                  <span className="font-mono font-medium text-emerald-600">-{formatCurrency(halfSe)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">QBI Deduction (20%)</span>
                  <span className="font-mono font-medium text-emerald-600">-{formatCurrency(qbi)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Standard Deduction</span>
                  <span className="font-mono font-medium text-emerald-600">-{formatCurrency(standardDeduction)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700">Federal Income Tax</span>
                  <span className="font-mono font-bold text-slate-800">{formatCurrency(incomeTax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
