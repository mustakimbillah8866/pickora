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
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase.from('products').select('*').eq('id', params.id).single()
      setP(data)
      if (data) {
        const { data: rel } = await supabase
          .from('products').select('*')
          .eq('category', data.category).eq('is_active', true).neq('id', data.id).limit(5)
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
  const lowStock = inStock && p.stock <= 5
  const productCode = `PICK-${p.id}`
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''

  function buyNow() {
    add({ id: p.id, name: p.name, price: p.price, image: p.image_url })
    router.push('/checkout')
  }
  function copyLink() {
    navigator.clipboard.writeText(pageUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="text-xs text-gray-400 mb-4">
        <span className="cursor-pointer hover:text-orange-600" onClick={() => router.push('/')}>হোম</span>
        {' › '}{p.category}{' › '}<span className="text-gray-600">{p.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl border border-gray-100 p-5 md:p-8 shadow-sm">
        <div className="bg-white rounded-xl flex items-start justify-center overflow-hidden border border-gray-50 p-4 md:sticky md:top-20 self-start">
          {p.image_url
            ? <img src={p.image_url} alt={p.name} className="max-h-[340px] w-auto max-w-full object-contain" />
            : <span className="text-7xl text-gray-200">📦</span>}
        </div>

        <div className="flex flex-col">
          <div className="text-xs text-gray-400 mb-1">{p.brand ? `${p.brand} · ` : ''}{p.category}</div>
          <h1 className="text-2xl font-bold leading-snug mb-1">{p.name}</h1>
          <div className="text-xs text-gray-400 mb-3">পণ্য কোড: <span className="font-medium text-gray-600">{productCode}</span></div>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-bold text-orange-600">৳{Number(p.price).toLocaleString('bn-BD')}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">৳{Number(p.old_price).toLocaleString('bn-BD')}</span>
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">-{Math.round((1 - p.price / p.old_price) * 100)}%</span>
              </>
            )}
          </div>

          {hasDiscount && (
            <div className="inline-block w-fit bg-green-50 text-green-700 text-sm px-3 py-1 rounded mb-3">
              Save ৳{Number(p.old_price - p.price).toLocaleString('bn-BD')}
            </div>
          )}

          <div className="mb-4">
            {inStock ? (
              <div>
                <span className="text-green-600 text-sm font-medium">✓ স্টকে আছে ({p.stock}টি)</span>
                {lowStock && <div className="mt-1 text-red-500 text-xs font-medium bg-red-50 rounded px-2 py-1 inline-block">⚠️ মাত্র {p.stock}টি বাকি! স্টক আউটের আগেই অর্ডার করুন</div>}
              </div>
            ) : <span className="text-red-500 text-sm font-medium">✗ স্টকে নেই</span>}
          </div>

          {p.description && (
            <div className="mb-5">
              <div className="font-semibold text-sm mb-1">বিবরণ</div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{p.description}</p>
            </div>
          )}

          {/* বিস্তারিত স্পেসিফিকেশন টেবিল */}
          {(p.specs || p.weight || p.country || p.ingredients) && (
            <div className="mb-5">
              <div className="font-semibold text-sm mb-2">পণ্যের বিবরণ</div>
              <table className="w-full text-sm border border-gray-100 rounded-lg overflow-hidden">
                <tbody>
                  <tr className="border-b border-gray-100"><td className="bg-gray-50 px-3 py-2 text-gray-500 w-1/3">নাম</td><td className="px-3 py-2">{p.name}</td></tr>
                  <tr className="border-b border-gray-100"><td className="bg-gray-50 px-3 py-2 text-gray-500">ক্যাটাগরি</td><td className="px-3 py-2">{p.category}</td></tr>
                  {p.weight && <tr className="border-b border-gray-100"><td className="bg-gray-50 px-3 py-2 text-gray-500">ওজন/পরিমাণ</td><td className="px-3 py-2">{p.weight}</td></tr>}
                  {p.country && <tr className="border-b border-gray-100"><td className="bg-gray-50 px-3 py-2 text-gray-500">উৎপাদন দেশ</td><td className="px-3 py-2">{p.country}</td></tr>}
                  {p.ingredients && <tr className="border-b border-gray-100"><td className="bg-gray-50 px-3 py-2 text-gray-500">উপাদান</td><td className="px-3 py-2">{p.ingredients}</td></tr>}
                  {p.specs && p.specs.split('\n').filter((l: string) => l.includes(':')).map((line: string, idx: number) => {
                    const i = line.indexOf(':'); const k = line.slice(0, i).trim(); const v = line.slice(i + 1).trim()
                    if (!k || !v) return null
                    return <tr key={idx} className="border-b border-gray-100"><td className="bg-gray-50 px-3 py-2 text-gray-500">{k}</td><td className="px-3 py-2">{v}</td></tr>
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* সারসংক্ষেপ */}
          {p.summary && (
            <div className="mb-5">
              <div className="font-semibold text-sm mb-1">সারসংক্ষেপ</div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{p.summary}</p>
            </div>
          )}

          {/* মূল বৈশিষ্ট্য */}
          {p.features && (
            <div className="mb-5">
              <div className="font-semibold text-sm mb-2">মূল বৈশিষ্ট্য</div>
              <ul className="space-y-1">
                {p.features.split('\n').filter((l: string) => l.trim()).map((f: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-600 flex gap-2"><span className="text-green-500">✓</span>{f.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {/* প্রশ্ন-উত্তর */}
          {p.faq && (
            <div className="mb-5">
              <div className="font-semibold text-sm mb-2">সাধারণ প্রশ্ন (FAQ)</div>
              <div className="space-y-2">
                {p.faq.split('\n').filter((l: string) => l.includes('|')).map((line: string, idx: number) => {
                  const [q, a] = line.split('|')
                  return (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-800">{q.trim()}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{a?.trim()}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-auto">
            <button onClick={() => add({ id: p.id, name: p.name, price: p.price, image: p.image_url })} disabled={!inStock}
              className="flex-1 py-3 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">🛒 কার্টে যোগ করুন</button>
            <button onClick={buyNow} disabled={!inStock}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">এখনই কিনুন</button>
          </div>

          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">শেয়ার:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm">f</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(p.name + ' - ' + pageUrl)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition text-sm">🟢</a>
            <button onClick={copyLink} className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition">{copied ? '✓ কপি হয়েছে' : '🔗 লিংক কপি'}</button>
          </div>
        </div>
      </div>

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