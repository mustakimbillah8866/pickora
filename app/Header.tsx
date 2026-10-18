'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from './supabaseClient'
import CartButton from './CartButton'

export default function Header() {
  const [cats, setCats] = useState<any[]>([])
  useEffect(() => {
    supabase.from('categories').select('*').order('id').then(({ data }) => setCats(data || []))
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="bg-orange-600 text-white text-xs text-center py-1.5 px-4">
        🚚 সারা দেশে ডেলিভারি · ১০০% আসল পণ্য · ক্যাশ অন ডেলিভারি · হেল্পলাইন: ০৯৬XX-XXXXXX
      </div>
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 py-3 flex-wrap">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xl">🛒</span>
          <span className="text-xl font-bold text-orange-600">Pickora</span>
        </Link>
        <div className="flex-1 min-w-[160px] relative">
          <input placeholder="পণ্য, ব্র্যান্ড বা ক্যাটাগরি খুঁজুন…" className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <Link href="/track" className="text-sm text-gray-600 hover:text-orange-500 whitespace-nowrap">📦 অর্ডার ট্র্যাক</Link>
        <CartButton />
      </div>
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex gap-5 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="cursor-pointer hover:text-orange-400">সব পণ্য</Link>
          {cats.map((c: any) => <Link key={c.id} href="/" className="cursor-pointer hover:text-orange-400">{c.name}</Link>)}
        </div>
      </div>
    </header>
  )
}