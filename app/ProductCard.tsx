'use client'
import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'

export default function ProductCard({ p }: { p: any }) {
  const { add } = useCart()
  const router = useRouter()
  const hasDiscount = p.old_price && p.old_price > p.price

  function buyNow() {
    add({ id: p.id, name: p.name, price: p.price, image: p.image_url })
    router.push('/checkout')
  }

  function goDetail() {
    router.push(`/product/${p.id}`)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group relative">
      {/* ছাড় ব্যাজ */}
      {hasDiscount && (
        <span className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
          -{Math.round((1 - p.price / p.old_price) * 100)}%
        </span>
      )}
      {/* বড় সাদা-ব্যাকগ্রাউন্ড ছবি — ক্লিকে ডিটেইল পেজ */}
      <div onClick={goDetail} className="h-44 bg-white flex items-center justify-center overflow-hidden p-3 cursor-pointer">
        {p.image_url
          ? <img src={p.image_url} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
          : <span className="text-5xl text-gray-300">📦</span>}
      </div>
      {/* তথ্য */}
      <div className="px-3 pb-3">
        <div onClick={goDetail} className="font-medium text-sm leading-snug min-h-[40px] line-clamp-2 mb-1 cursor-pointer hover:text-orange-600 transition">{p.name}</div>
        <div className="text-gray-400 text-xs mt-0.5 mb-1">{p.brand ? `${p.brand} · ` : ''}{p.category}</div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-orange-600 text-base">৳{Number(p.price).toLocaleString('bn-BD')}</span>
          {hasDiscount && <span className="text-gray-400 text-xs line-through">৳{Number(p.old_price).toLocaleString('bn-BD')}</span>}
        </div>
        {hasDiscount && (
          <div className="inline-block bg-green-50 text-green-700 text-[11px] px-2 py-0.5 rounded mb-2">
            Save ৳{Number(p.old_price - p.price).toLocaleString('bn-BD')}
          </div>
        )}
        <div className="flex gap-1.5 mt-1">
          <button
            onClick={() => add({ id: p.id, name: p.name, price: p.price, image: p.image_url })}
            className="flex-1 py-2 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 active:scale-95">
            🛒 কার্টে
          </button>
          <button
            onClick={buyNow}
            className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition active:scale-95">
            Buy now
          </button>
        </div>
      </div>
    </div>
  )
}