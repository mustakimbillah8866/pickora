'use client'
import { useCart } from '../CartContext'
import Link from 'next/link'

export default function CartPage() {
  const { items, inc, dec, remove, total } = useCart()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3">
        <Link href="/" className="text-emerald-700 font-bold text-xl">🛒 Pickora</Link>
      </header>
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">আপনার কার্ট</h1>
        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            কার্ট খালি। <Link href="/" className="text-emerald-600">কেনাকাটা করুন</Link>
          </div>
        ) : (
          <>
            {items.map(i => (
              <div key={i.id} className="bg-white rounded-xl p-3 mb-2 flex items-center gap-3 shadow-sm">
                <div className="flex-1">
                  <div className="font-medium text-sm">{i.name}</div>
                  <div className="text-emerald-600 font-semibold text-sm">৳{i.price}</div>
                </div>
                <button onClick={() => dec(i.id)} className="w-7 h-7 rounded bg-gray-100">−</button>
                <span className="w-6 text-center">{i.qty}</span>
                <button onClick={() => inc(i.id)} className="w-7 h-7 rounded bg-gray-100">+</button>
                <button onClick={() => remove(i.id)} className="text-red-500 text-sm ml-2">মুছুন</button>
              </div>
            ))}
            <div className="bg-white rounded-xl p-4 mt-3 flex justify-between font-bold shadow-sm">
              <span>মোট</span><span>৳{total}</span>
            </div>
            <Link href="/checkout" className="block text-center bg-emerald-600 text-white rounded-xl py-3 mt-3 font-medium">
              অর্ডার করুন
            </Link>
          </>
        )}
      </main>
    </div>
  )
}