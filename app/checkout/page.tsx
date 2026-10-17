'use client'
import { useState } from 'react'
import { useCart } from '../CartContext'
import { supabase } from '../supabaseClient'
import Link from 'next/link'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function placeOrder() {
    setErr('')
    if (!name || !phone || !address) { setErr('নাম, ফোন ও ঠিকানা দিন।'); return }
    if (items.length === 0) { setErr('কার্ট খালি।'); return }
    const { error } = await supabase.from('orders').insert({
      customer_name: name, customer_phone: phone, customer_address: address,
      items: items, total: total
    })
    if (error) { setErr('সমস্যা: ' + error.message); return }
    clear(); setDone(true)
  }

  const box = "w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 text-sm"

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <div className="text-5xl mb-3">✅</div>
        <h1 className="text-xl font-bold mb-2">অর্ডার সফল হয়েছে!</h1>
        <p className="text-gray-500 mb-4">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
        <Link href="/" className="text-emerald-600">আরও কেনাকাটা করুন</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3">
        <Link href="/cart" className="text-emerald-700 font-bold">← কার্টে ফিরুন</Link>
      </header>
      <main className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">চেকআউট</h1>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <input className={box} placeholder="আপনার নাম" value={name} onChange={e => setName(e.target.value)} />
          <input className={box} placeholder="মোবাইল নম্বর" value={phone} onChange={e => setPhone(e.target.value)} />
          <textarea className={box} placeholder="সম্পূর্ণ ঠিকানা" rows={3} value={address} onChange={e => setAddress(e.target.value)} />
          <div className="flex justify-between font-bold py-2 border-t mt-2">
            <span>মোট</span><span>৳{total}</span>
          </div>
          <div className="text-sm text-gray-500 mb-3">💵 ক্যাশ অন ডেলিভারি</div>
          {err && <div className="text-red-500 text-sm mb-2">{err}</div>}
          <button onClick={placeOrder} className="w-full bg-emerald-600 text-white rounded-lg py-3 font-medium">
            অর্ডার নিশ্চিত করুন
          </button>
        </div>
      </main>
    </div>
  )
}