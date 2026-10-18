'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../supabaseClient'
import { useCart } from '../../CartContext'
import ProductCard from '../../ProductCard'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { add } = useCart()
  const [p, setP] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase.from('products').select('*').eq('id', params.id).single()
      setP(data)
      if (data) {
        const { data: rel } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .eq('is_active', true)
          .neq('id', data.id)
          .limit(5)
        setRelated(rel || [])
      }
      setLoading(false)
    }
    if (params.id) load()
  }, [params.id])

  if (loading) return <div className="max-w-6xl mx-auto p-10 text-center text-gray-400">লোড হচ্ছে...</div>
  if (!p) return (
    <div className="max-w-6xl mx-auto p-10 text-center">
      <div className="text-5xl mb-3">😕</div>
      <div className="text-gray-500 mb-4">পণ্যটি খুঁজে পাওয়া যায়নি</div>
      <button onClick={() => router.push('/')} className="px-5 py-2 bg-orange-500 text-white rounded-lg">হোমে ফিরুন</button>
    </div>
  )

  const hasDiscount = p.old_price && p.old_price > p.price
  const inStock = p.stock > 0

  function buyNow() {
    add({ id: p.id, name: p.name, price: p.price, image: p.image_url })
    router.push('/checkout')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* breadcrumb */}
      <div className="text-xs text-gray-400 mb-4">
        <span className="cursor-pointer hover:text-orange-600" onClick={() => router.push('/')}>হোম</span>
        {' › '}{p.category}{' › '}<span className="text-gray-600">{p.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl border border-gray-100 p-5 md:p-8 shadow-sm">
        {/* বাঁয়ে — বড় ছবি */}
        <div className="bg-white rounded-xl flex items-center justify-center overflow-hidden min-h-[320px] md:min-h-[420px] border border-gray-50">
          {p.image_url
            ? <img src={p.image_url} alt={p.name} className="max-h-[420px] max-w-full object-contain" />
            : <span className="text-7xl text-gray-200">📦</span>}
        </div>

        {/* ডানে — তথ্য */}
        <div className="flex flex-col">
          <div className="text-xs text-gray-400 mb-1">{p.brand ? `${p.brand} · ` : ''}{p.category}</div>
          <h1 className="text-2xl font-bold leading-snug mb-3">{p.name}</h1>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-bold text-orange-600">৳{Number(p.price).toLocaleString('bn-BD')}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">৳{Number(p.old_price).toLocaleString('bn-BD')}</span>
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  -{Math.round((1 - p.price / p.old_price) * 100)}%
                </span>
              </>
            )}
          </div>

          {hasDiscount && (
            <div className="inline-block w-fit bg-green-50 text-green-700 text-sm px-3 py-1 rounded mb-3">
              Save ৳{Number(p.old_price - p.price).toLocaleString('bn-BD')}
            </div>
          )}

          {/* স্টক */}
          <div className="mb-4">
            {inStock
              ? <span className="text-green-600 text-sm font-medium">✓ স্টকে আছে ({p.stock}টি)</span>
              : <span className="text-red-500 text-sm font-medium">✗ স্টকে নেই</span>}
          </div>

          {/* বর্ণনা */}
          {p.description && (
            <div className="mb-5">
              <div className="font-semibold text-sm mb-1">বিবরণ</div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{p.description}</p>
            </div>
          )}

          {/* বাটন */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => add({ id: p.id, name: p.name, price: p.price, image: p.image_url })}
              disabled={!inStock}
              className="flex-1 py-3 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
              🛒 কার্টে যোগ করুন
            </button>
            <button
              onClick={buyNow}
              disabled={!inStock}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
              এখনই কিনুন
            </button>
          </div>
        </div>
      </div>

      {/* একই ক্যাটাগরির আরও পণ্য */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4">একই ক্যাটাগরির আরও পণ্য</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {related.map(rp => <ProductCard key={rp.id} p={rp} />)}
          </div>
        </div>
      )}
    </div>
  )
}