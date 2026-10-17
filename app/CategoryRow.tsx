'use client'
import { useRef } from 'react'
import ProductCard from './ProductCard'

export default function CategoryRow({ title, products }: { title: string; products: any[] }) {
  const ref = useRef<HTMLDivElement>(null)
  if (!products || products.length === 0) return null

  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold border-b-2 border-orange-500 pb-1">{title}</h3>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-orange-50 text-orange-500">‹</button>
          <button onClick={() => scroll(1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-orange-50 text-orange-500">›</button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
        {products.map(p => (
          <div key={p.id} className="flex-shrink-0 w-44">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </div>
  )
}