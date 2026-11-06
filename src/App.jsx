import { useState, useEffect } from 'react';

export default function App() {
  // 1. URL Sync & Local Storage Initialization
  const [revenue, setRevenue] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('rev') || localStorage.getItem('omni_rev') || '125000';
  });
  
  const [expenses, setExpenses] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('exp') || localStorage.getItem('omni_exp') || '25000';
  });

  // 2. Sync State Changes to Local Storage & URL
  useEffect(() => {
    localStorage.setItem('omni_rev', revenue);
    localStorage.setItem('omni_exp', expenses);
    
    // Updates the URL seamlessly so users can share their specific ledger (Virality Engine)
    const newUrl = `${window.location.pathname}?rev=${revenue}&exp=${expenses}`;
    window.history.replaceState({}, '', newUrl);
  }, [revenue, expenses]);

  // 3. Tax Logic & Math Validation (Prevents NaN crashes)
  const safeRev = Number(revenue) || 0;
  const safeExp = Number(expenses) || 0;
  const netProfit = Math.max(0, safeRev - safeExp);
  
  // Sole Prop SECA Tax (15.3% on 92.35% of net profit)
  const solePropSECA = netProfit * 0.9235 * 0.153;
  
  // S-Corp logic (Assuming reasonable W-2 salary is 40% of net profit)
  const reasonableSalary = netProfit * 0.40;
  const sCorpSECA = reasonableSalary * 0.153;
  
  const taxSavings = solePropSECA - sCorpSECA;

  // 4. Awin Affiliate Tracking with Sub-ID Parameter
  const affiliateLink = "https://www.northwestregisteredagent.com/?a_aid=YOUR_AWIN_ID&clickref=omni_tax_engine_2026";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 my-8 border border-slate-200 dark:border-slate-700">
        
        {/* Header & Print-to-PDF Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">2026 SECA Tax Engine</h1>
          <button 
            onClick={() => window.print()}
            className="hidden md:inline-block px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-sm font-semibold transition-colors print:hidden"
            aria-label="Export Tax Ledger to PDF"
          >
            Export to PDF
          </button>
        </div>
        
        {/* FTC Legal Compliance Shield */}
        <p className="text-sm italic text-slate-500 dark:text-slate-400 mb-8 print:hidden">
          *We may earn a commission if you purchase through our partner links. This does not constitute legal or tax advice.
        </p>

        {/* Inputs (with numeric keypads for mobile friction reduction) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:hidden">
          <div>
            <label className="block text-sm font-semibold mb-2">Annual 1099 Revenue ($)</label>
            <input 
              type="text" 
              inputMode="numeric"
              value={revenue} 
              onChange={(e) => setRevenue(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full p-3 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              aria-describedby="revenue-help"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Business Expenses ($)</label>
            <input 
              type="text" 
              inputMode="numeric"
              value={expenses} 
              onChange={(e) => setExpenses(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full p-3 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              aria-describedby="expenses-help"
            />
          </div>
        </div>

        {/* Results Ledger */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold border-b border-slate-300 dark:border-slate-700 pb-2 mb-4">Tax Ledger Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Net Profit:</span>
              <span className="font-mono font-semibold">${netProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>Sole Prop SECA Tax (15.3%):</span>
              <span className="font-mono font-semibold">-${solePropSECA.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-blue-600 dark:text-blue-400">
              <span>S-Corp SECA Tax (W2 Only):</span>
              <span className="font-mono font-semibold">-${sCorpSECA.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold text-lg pt-4 border-t border-slate-300 dark:border-slate-700">
              <span>S-Corp Tax Shield Savings:</span>
              <span className="font-mono">${taxSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        {/* Call to Action - Desktop */}
        <div className="text-center print:hidden hidden md:block">
          <p className="mb-4 font-medium">Capture these savings by structuring as an LLC today.</p>
          <a 
            href={affiliateLink}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            Form Your LLC for $39
          </a>
        </div>
      </div>

      {/* Conversion Rate Optimization: Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden print:hidden z-50">
          <a 
            href={affiliateLink}
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md"
          >
            Form LLC & Save ${Math.round(taxSavings).toLocaleString()}
          </a>
      </div>
    </div>
  );
}
