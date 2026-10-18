'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from './supabaseClient'

export default function Footer() {
  const [cats, setCats] = useState<any[]>([])
  useEffect(() => {
    supabase.from('categories').select('*').order('id').then(({ data }) => setCats(data || []))
  }, [])

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="text-orange-400 font-bold text-lg mb-2">Pickora</div>
          <p className="text-gray-400 leading-relaxed">ঘরের সব প্রয়োজন, এক ঠিকানায়। নিরাপদ ও বিশ্বস্ত অনলাইন শপিং।</p>
          <div className="mt-3 text-gray-400">📍 ঢাকা, বাংলাদেশ<br/>📞 ০৯৬XX-XXXXXX<br/>✉️ info@pickora.com</div>
        </div>
        <div>
          <div className="font-semibold text-white mb-3">তথ্য</div>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-orange-400 cursor-pointer">আমাদের সম্পর্কে</li>
            <li className="hover:text-orange-400 cursor-pointer">যোগাযোগ</li>
            <li className="hover:text-orange-400 cursor-pointer">শর্তাবলী</li>
            <li className="hover:text-orange-400 cursor-pointer">প্রাইভেসি পলিসি</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white mb-3">সাপোর্ট</div>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-orange-400 cursor-pointer"><Link href="/track">অর্ডার ট্র্যাকিং</Link></li>
            <li className="hover:text-orange-400 cursor-pointer">কীভাবে অর্ডার করবেন</li>
            <li className="hover:text-orange-400 cursor-pointer">রিটার্ন পলিসি</li>
            <li className="hover:text-orange-400 cursor-pointer">FAQ</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white mb-3">কেনাকাটা</div>
          <ul className="space-y-2 text-gray-400">
            {cats.slice(0, 5).map((c: any) => <li key={c.id} className="hover:text-orange-400 cursor-pointer"><Link href="/">{c.name}</Link></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2026 Pickora. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  )
}