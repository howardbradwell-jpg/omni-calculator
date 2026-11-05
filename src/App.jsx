import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function App() {
  // 1. Initialize State for User Inputs
  const [revenue, setRevenue] = useState(125000);
  const [expenses, setExpenses] = useState(25000);

  // 2. Build the Reactive 2026 Tax Engine
  const taxLedger = useMemo(() => {
    const netProfit = Math.max(0, revenue - expenses);

    // --- SECA TAX (Self-Employment) ---
    const taxableSEIncome = netProfit * 0.9235;
    const ssTax = Math.min(taxableSEIncome, 184500) * 0.124; // 2026 SS Cap
    const medicareTax = taxableSEIncome * 0.029;
    const secaTax = ssTax + medicareTax;
    const halfSEDeduction = secaTax / 2;

    // --- QBI DEDUCTION (Section 199A) ---
    const qbiBase = Math.max(0, netProfit - halfSEDeduction);
    const qbiDeduction = Math.max(0, qbiBase * 0.20);

    // --- STANDARD DEDUCTION ---
    const standardDeduction = 16100; // 2026 Single Filer

    // --- FEDERAL INCOME TAX ---
    const taxableIncome = Math.max(0, netProfit - halfSEDeduction - qbiDeduction - standardDeduction);
    
    // 2026 Marginal Brackets Prototype
    const brackets = [
      { rate: 0.10, limit: 11925 },
      { rate: 0.12, limit: 48475 },
      { rate: 0.22, limit: 103350 },
      { rate: 0.24, limit: 197300 }
    ];

    let federalIncomeTax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    for (const bracket of brackets) {
      const taxableInBracket = Math.min(remainingIncome, bracket.limit - previousLimit);
      if (taxableInBracket > 0) {
        federalIncomeTax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
        previousLimit = bracket.limit;
      } else {
        break;
      }
    }

    const totalTaxOwed = secaTax + federalIncomeTax;
    const netTakeHome = netProfit - totalTaxOwed;
    
    // Shield = Expenses + Deductions
    const totalTaxShield = expenses + halfSEDeduction + qbiDeduction + standardDeduction;

    return {
      netProfit,
      secaTax,
      halfSEDeduction,
      qbiDeduction,
      standardDeduction,
      federalIncomeTax,
      totalTaxOwed,
      netTakeHome,
      totalTaxShield
    };
  }, [revenue, expenses]);

  // Currency Formatter Helper
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // Donut Chart Data Mapping
  const chartData = [
    { name: 'Net Take-Home', value: taxLedger.netTakeHome, color: '#10b981' }, // Emerald
    { name: 'SECA Tax', value: taxLedger.secaTax, color: '#3b82f6' }, // Blue
    { name: 'Federal Tax', value: taxLedger.federalIncomeTax, color: '#f59e0b' } // Amber
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Calculator className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Omni Digital Tax Engine</h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Real-time 2026 IRS 1099 Liability & QBI Modeling</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Inputs & Shield */}
          <div className="space-y-6">
            
            {/* Inputs Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h2 className="font-semibold text-slate-800">Business Metrics</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gross 1099 Revenue</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">$</span>
                    <input 
                      type="number" 
                      value={revenue}
                      onChange={(e) => setRevenue(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Operating Expenses (Write-offs)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">$</span>
                    <input 
                      type="number" 
                      value={expenses}
                      onChange={(e) => setExpenses(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Shield Card */}
            <div className="bg-blue-600 p-6 rounded-xl shadow-sm text-white">
              <div className="flex items-center space-x-2 mb-4">
                <ShieldCheck className="w-5 h-5 opacity-90" />
                <h2 className="font-semibold text-blue-50 tracking-wide text-sm">TOTAL TAX SHIELD</h2>
              </div>
              <div className="text-3xl font-bold mb-3">{formatCurrency(taxLedger.totalTaxShield)}</div>
              <p className="text-blue-100 text-sm leading-relaxed">
                Money protected from federal taxes via write-offs, the 20% QBI deduction, and standard deductions.
              </p>
            </div>
          </div>

          {/* Right Column: Stats & Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
                <div className="text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">Net Profit</div>
                <div className="text-xl font-bold text-slate-800">{formatCurrency(taxLedger.netProfit)}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100 text-center">
                <div className="text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">Total Tax Owed</div>
                <div className="text-xl font-bold text-red-500">{formatCurrency(taxLedger.totalTaxOwed)}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 text-center">
                <div className="text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">Net Take-Home</div>
                <div className="text-xl font-bold text-emerald-500">{formatCurrency(taxLedger.netTakeHome)}</div>
              </div>
            </div>

            {/* Ledger & Chart Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center">
              
              {/* Chart */}
              <div className="w-full md:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Ledger */}
              <div className="w-full md:w-1/2 space-y-4 md:pl-8 mt-6 md:mt-0 w-full">
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">2026 IRS Ledger Breakdown</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>SECA Tax (15.3%)</span>
                    <span className="font-medium">{formatCurrency(taxLedger.secaTax)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600">
                    <span>Half-SE Deduction</span>
                    <span>-{formatCurrency(taxLedger.halfSEDeduction)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600">
                    <span>QBI Deduction (20%)</span>
                    <span>-{formatCurrency(taxLedger.qbiDeduction)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600">
                    <span>Standard Deduction</span>
                    <span>-{formatCurrency(taxLedger.standardDeduction)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-800 font-bold border-t border-slate-100 pt-2 mt-2">
                    <span>Federal Income Tax</span>
                    <span>{formatCurrency(taxLedger.federalIncomeTax)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
