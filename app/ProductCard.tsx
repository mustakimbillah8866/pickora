'use client'
import { useCart } from './CartContext'

export default function ProductCard({ p }: { p: any }) {
  const { add } = useCart()
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="h-32 bg-emerald-50 flex items-center justify-center overflow-hidden">
        {p.image_url
          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
          : <span className="text-4xl">📦</span>}
      </div>
      <div className="p-3">
        <div className="font-medium text-sm leading-snug min-h-[38px] line-clamp-2">{p.name}</div>
        <div className="text-gray-400 text-xs mt-0.5 mb-1">{p.category}</div>
        <div className="font-bold text-emerald-600 mb-2">৳{p.price}</div>
        <button
          onClick={() => add({ id: p.id, name: p.name, price: p.price })}
          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition active:scale-95">
          কার্টে যোগ
        </button>
      </div>
    </div>
  )
}