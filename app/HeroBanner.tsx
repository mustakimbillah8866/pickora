'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function HeroBanner() {
  const [banners, setBanners] = useState<any[]>([])
  const [i, setI] = useState(0)

  useEffect(() => {
    supabase.from('banners').select('*').eq('is_active', true).order('id', { ascending: false })
      .then(({ data }) => setBanners(data || []))
  }, [])

  useEffect(() => {
    if (banners.length < 2) return
    const t = setInterval(() => setI(p => (p + 1) % banners.length), 4000)
    return () => clearInterval(t)
  }, [banners])

  // যদি কোনো ব্যানার না থাকে — একটা ডিফল্ট দেখাই
  if (banners.length === 0) {
    return (
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">ঘরের সব প্রয়োজন, এক ঠিকানায়</h1>
          <p className="opacity-90">ফ্যাশন · পোশাক · খাঁটি খাবার · খেলনা</p>
        </div>
      </div>
    )
  }

  const b = banners[i]
  return (
    <div className="relative max-w-6xl mx-auto px-4 pt-4">
      <div className="relative rounded-2xl overflow-hidden">
         <img src={b.image_url} alt={b.title || 'banner'} className="w-full aspect-[3/1] object-cover transition-all duration-500" />
        {(b.title || b.subtitle) && (
          <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-6 md:px-10">
            {b.title && <h1 className="text-white text-xl md:text-3xl font-bold drop-shadow mb-1">{b.title}</h1>}
            {b.subtitle && <p className="text-white/90 text-sm md:text-base drop-shadow">{b.subtitle}</p>}
          </div>
        )}
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)}
              className={`w-2.5 h-2.5 rounded-full transition ${idx === i ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  )
}