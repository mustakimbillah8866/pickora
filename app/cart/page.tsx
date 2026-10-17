'use client'
import { useCart } from '../CartContext'
import Link from 'next/link'

export default function CartPage() {
  const { items, inc, dec, remove, total } = useCart()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3">
        <Link href="/" className="text-orange-600 font-bold text-xl">🛒 Pickora</Link>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">আপনার কার্ট</h1>
        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow-sm">
            🛒 কার্ট খালি। <Link href="/" className="text-orange-600 font-medium">কেনাকাটা করুন →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {/* বাঁ — পণ্য তালিকা */}
            <div className="md:col-span-2 space-y-3">
              {items.map(i => (
                <div key={i.id} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-14 h-14 bg-white border rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {i.image ? <img src={i.image} alt={i.name} className="max-h-full max-w-full object-contain" /> : <span className="text-2xl">📦</span>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{i.name}</div>
                    <div className="text-orange-600 font-semibold text-sm">৳{i.price}</div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                    <button onClick={() => dec(i.id)} className="w-8 h-8 text-lg">−</button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button onClick={() => inc(i.id)} className="w-8 h-8 text-lg">+</button>
                  </div>
                  <div className="font-semibold text-sm w-16 text-right">৳{i.price * i.qty}</div>
                  <button onClick={() => remove(i.id)} className="text-red-400 hover:text-red-600 text-lg">🗑️</button>
                </div>
              ))}
            </div>

            {/* ডান — সামারি */}
            <div className="bg-white rounded-xl p-5 shadow-sm h-fit">
              <h2 className="font-bold mb-3">অর্ডার সামারি</h2>
              <div className="flex justify-between text-sm py-1"><span>পণ্য সংখ্যা</span><span>{items.reduce((s, i) => s + i.qty, 0)} টি</span></div>
              <div className="flex justify-between text-sm py-1"><span>সাবটোটাল</span><span>৳{total}</span></div>
              <div className="text-xs text-gray-400 py-1">ডেলিভারি চার্জ চেকআউটে হিসাব হবে</div>
              <div className="flex justify-between font-bold text-base border-t mt-2 pt-2"><span>মোট</span><span className="text-orange-600">৳{total}</span></div>
              <Link href="/checkout" className="block text-center bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 mt-4 font-medium transition">
                অর্ডার করুন →
              </Link>
              <Link href="/" className="block text-center text-orange-600 text-sm mt-3">← কেনাকাটা চালিয়ে যান</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}