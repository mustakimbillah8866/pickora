'use client'
import { useCart } from './CartContext'

export default function ProductCard({ p }: { p: any }) {
  const { add } = useCart()
  const hasDiscount = p.old_price && p.old_price > p.price
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group relative">
      {/* ব্যাজ */}
      {hasDiscount && (
        <span className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
          -{Math.round((1 - p.price / p.old_price) * 100)}%
        </span>
      )}
      {/* বড় সাদা-ব্যাকগ্রাউন্ড ছবি */}
      <div className="h-44 bg-white flex items-center justify-center overflow-hidden p-3">
        {p.image_url
          ? <img src={p.image_url} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
          : <span className="text-5xl text-gray-300">📦</span>}
      </div>
      {/* তথ্য */}
      <div className="px-3 pb-3">
        <div className="font-medium text-sm leading-snug min-h-[40px] line-clamp-2 mb-2">{p.name}</div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-emerald-600 text-base">৳{Number(p.price).toLocaleString('bn-BD')}</span>
          {hasDiscount && <span className="text-gray-400 text-xs line-through">৳{Number(p.old_price).toLocaleString('bn-BD')}</span>}
        </div>
        {hasDiscount && (
          <div className="inline-block bg-green-50 text-green-700 text-[11px] px-2 py-0.5 rounded mb-2">
            Save ৳{Number(p.old_price - p.price).toLocaleString('bn-BD')}
          </div>
        )}
        <button
          onClick={() => add({ id: p.id, name: p.name, price: p.price })}
          className="w-full mt-1 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5 active:scale-95">
          🛒 কার্টে যোগ
        </button>
      </div>
    </div>
  )
}