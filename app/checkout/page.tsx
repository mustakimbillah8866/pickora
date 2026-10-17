'use client'
import { useState, useEffect } from 'react'
import { useCart } from '../CartContext'
import { supabase } from '../supabaseClient'
import Link from 'next/link'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState<'inside' | 'outside'>('inside')
  const [delIn, setDelIn] = useState(70)
  const [delOut, setDelOut] = useState(130)
  const [freeMin, setFreeMin] = useState(0)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [orderCode, setOrderCode] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      const m: any = {}; (data || []).forEach((s: any) => m[s.key] = s.value)
      if (m.delivery_inside_dhaka) setDelIn(Number(m.delivery_inside_dhaka))
      if (m.delivery_outside_dhaka) setDelOut(Number(m.delivery_outside_dhaka))
      if (m.free_delivery_min) setFreeMin(Number(m.free_delivery_min))
    })
  }, [])

  const isFree = freeMin > 0 && total >= freeMin
  const deliveryCharge = isFree ? 0 : (location === 'inside' ? delIn : delOut)
  const grandTotal = total + deliveryCharge

  async function placeOrder() {
    setErr('')
    if (!name || !phone || !address) { setErr('নাম, ফোন ও ঠিকানা দিন।'); return }
    if (items.length === 0) { setErr('কার্ট খালি।'); return }
    // আজকের তারিখ (YYYYMMDD)
    const d = new Date()
    const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    // আজকের অর্ডার সংখ্যা গুনে সিরিয়াল
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()
    const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', startOfDay)
    const serial = String((count || 0) + 1).padStart(2, '0')
    const random6 = String(Math.floor(100000 + Math.random() * 900000))
    const code = `PICK-${dateStr}${serial}-${random6}`

    const { data, error } = await supabase.from('orders').insert({
      order_code: code,
      customer_name: name, customer_phone: phone,
      customer_address: address + ' (' + (location === 'inside' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে') + ')',
      items: items, total: grandTotal
    }).select('id').single()
    if (error) { setErr('সমস্যা: ' + error.message); return }
    setOrderId(data?.id ?? null); setOrderCode(code); clear(); setDone(true)
  }

  const box = "w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl p-8 text-center shadow-sm max-w-sm">
        <div className="text-5xl mb-3">✅</div>
        <h1 className="text-xl font-bold mb-2">অর্ডার সফল হয়েছে!</h1>
        {orderCode && <div className="bg-orange-50 rounded-lg p-3 mb-3"><div className="text-sm text-gray-600">আপনার অর্ডার কোড</div><div className="text-lg font-bold text-orange-600 break-all">{orderCode}</div></div>}
        <p className="text-gray-500 text-sm mb-4">এই নম্বরটি রাখুন — অর্ডার ট্র্যাক করতে কাজে লাগবে। আমরা শীঘ্রই যোগাযোগ করব।</p>
        <div className="flex gap-2">
          <Link href="/" className="flex-1 border border-orange-500 text-orange-600 rounded-lg py-2 text-sm">হোমে যান</Link>
          <Link href="/track" className="flex-1 bg-orange-500 text-white rounded-lg py-2 text-sm">অর্ডার ট্র্যাক</Link>
        </div>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3">
        <Link href="/cart" className="text-orange-600 font-bold">← কার্টে ফিরুন</Link>
      </header>
      <main className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-lg mb-3">📦 ডেলিভারির তথ্য</h2>
          <input className={box} placeholder="আপনার নাম *" value={name} onChange={e => setName(e.target.value)} />
          <input className={box} placeholder="মোবাইল নম্বর *" value={phone} onChange={e => setPhone(e.target.value)} />
          <textarea className={box} placeholder="সম্পূর্ণ ঠিকানা *" rows={3} value={address} onChange={e => setAddress(e.target.value)} />
          <label className="block text-sm text-gray-600 mb-1">ডেলিভারি এলাকা:</label>
          <select className={box} value={location} onChange={e => setLocation(e.target.value as any)}>
            <option value="inside">ঢাকার ভিতরে (৳{delIn})</option>
            <option value="outside">ঢাকার বাইরে (৳{delOut})</option>
          </select>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm h-fit">
          <h2 className="font-bold text-lg mb-3">🧾 অর্ডার সামারি</h2>
          {items.map(i => (
            <div key={i.id} className="flex justify-between text-sm py-1">
              <span>{i.name} ×{i.qty}</span>
              <span>৳{i.price * i.qty}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 space-y-1 text-sm">
            <div className="flex justify-between"><span>সাবটোটাল</span><span>৳{total}</span></div>
            <div className="flex justify-between">
              <span>ডেলিভারি চার্জ</span>
              <span>{isFree ? <span className="text-green-600 font-medium">ফ্রি 🎉</span> : '৳' + deliveryCharge}</span>
            </div>
            {!isFree && freeMin > 0 && total < freeMin && (
              <div className="text-xs text-orange-600 bg-orange-50 rounded p-1.5 text-center">আর ৳{freeMin - total} কিনলে ফ্রি ডেলিভারি!</div>
            )}
            <div className="flex justify-between font-bold text-base border-t pt-2 mt-1"><span>সর্বমোট</span><span className="text-orange-600">৳{grandTotal}</span></div>
          </div>
          <div className="text-sm text-gray-500 my-3 bg-orange-50 rounded-lg p-2 text-center">💵 ক্যাশ অন ডেলিভারি</div>
          {err && <div className="text-red-500 text-sm mb-2">{err}</div>}
          <button onClick={placeOrder} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 font-medium transition">
            অর্ডার নিশ্চিত করুন
          </button>
        </div>
      </main>
    </div>
  )
}