'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Link from 'next/link'

export default function Track() {
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [err, setErr] = useState('')
  const [myOrders, setMyOrders] = useState<any[]>([])

  // ব্রাউজারে সেভ করা অর্ডার (অটো) লোড
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pickora_orders') || '[]')
    if (saved.length > 0) {
      supabase.from('orders').select('*').in('order_code', saved).then(({ data }) => setMyOrders(data || []))
    }
  }, [])

  async function search() {
    setErr(''); setResults([])
    if (!code && !phone) { setErr('অর্ডার কোড অথবা ফোন নম্বর দিন।'); return }
    let query = supabase.from('orders').select('*').order('id', { ascending: false })
    if (code) query = query.eq('order_code', code.trim())
    if (phone) query = query.eq('customer_phone', phone.trim())
    const { data } = await query
    if (data && data.length > 0) setResults(data)
    else setErr('কোনো অর্ডার পাওয়া যায়নি। কোড বা ফোন নম্বর ঠিক আছে কিনা দেখুন।')
  }

  const steps = ['নতুন', 'প্রসেসিং', 'পাঠানো হয়েছে', 'ডেলিভারি হয়েছে']
  const box = "w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"

  function OrderCard({ o }: { o: any }) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm break-all">{o.order_code || ('#' + o.id)}</span>
          <span className="text-orange-600 font-semibold">৳{o.total}</span>
        </div>
        <div className="text-sm text-gray-600">👤 {o.customer_name} · 📞 {o.customer_phone}</div>
        <div className="text-xs text-gray-500 mb-3">📍 {o.customer_address}</div>
        <div className="text-xs text-gray-400 mb-3">পণ্য: {Array.isArray(o.items) ? o.items.map((i: any) => `${i.name} ×${i.qty}`).join(', ') : ''}</div>
        {o.status === 'বাতিল' ? (
          <div className="bg-red-50 text-red-600 rounded-lg p-2 text-center text-sm">এই অর্ডারটি বাতিল হয়েছে</div>
        ) : (
          <div className="space-y-2">
            {steps.map((s, idx) => {
              const curIdx = steps.indexOf(o.status)
              const doneStep = idx <= curIdx
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${doneStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>{doneStep ? '✓' : idx + 1}</div>
                  <span className={`text-sm ${doneStep ? 'font-medium text-gray-800' : 'text-gray-400'}`}>{s}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3">
        <Link href="/" className="text-orange-600 font-bold text-xl">🛒 Pickora</Link>
      </header>
      <main className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">📦 অর্ডার ট্র্যাক করুন</h1>

        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
          <p className="text-sm text-gray-500 mb-3">অর্ডার কোড অথবা ফোন নম্বর — যেকোনো একটি দিন</p>
          <input className={box} placeholder="অর্ডার কোড (যেমন: PICK-...)" value={code} onChange={e => setCode(e.target.value)} />
          <input className={box} placeholder="অথবা মোবাইল নম্বর" value={phone} onChange={e => setPhone(e.target.value)} />
          {err && <div className="text-red-500 text-sm mb-2">{err}</div>}
          <button onClick={search} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 font-medium">খুঁজুন</button>
        </div>

        {results.length > 0 && <>
          <h2 className="font-semibold mb-2 text-sm">খুঁজে পাওয়া অর্ডার ({results.length})</h2>
          {results.map(o => <OrderCard key={o.id} o={o} />)}
        </>}

        {myOrders.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2 text-sm">🕑 এই ডিভাইসে করা অর্ডার</h2>
            {myOrders.map(o => <OrderCard key={o.id} o={o} />)}
          </div>
        )}
      </main>
    </div>
  )
}