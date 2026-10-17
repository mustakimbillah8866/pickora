export const instant = false
import { supabase } from './supabaseClient'
import ProductCard from './ProductCard'
import CartButton from './CartButton'
import HeroBanner from './HeroBanner'

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

    const { data: catData } = await supabase.from('categories').select('name').order('id')
  const cats = ['সব', ...(catData?.map(c => c.name) || [])]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* টপ বার */}
      <div className="bg-emerald-700 text-white text-xs text-center py-1.5 px-4">
        🚚 সারা দেশে ডেলিভারি · ১০০% আসল পণ্য · ক্যাশ অন ডেলিভারি
      </div>

      {/* হেডার */}
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 py-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl">🛒</span>
            <span className="text-xl font-bold text-emerald-700">Pickora</span>
          </div>
          <div className="flex-1 min-w-[160px] relative">
            <input placeholder="পণ্য, ব্র্যান্ড বা ক্যাটাগরি খুঁজুন…"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <CartButton />
        </div>
      </header>

      {/* হিরো */}
      <HeroBanner />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* ক্যাটাগরি */}
        <div className="flex gap-2 flex-wrap mb-6">
          {cats.map((c) => (
            <span key={c as string}
              className={`px-4 py-1.5 rounded-full text-sm cursor-pointer border transition ${c === 'সব' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'}`}>
              {c}
            </span>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-4">বাছাই করা পণ্য</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products && products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        {/* ট্রাস্ট ব্যাজ */}
        <div className="flex flex-wrap gap-4 justify-center bg-white rounded-xl p-4 mt-8 text-sm text-gray-600 shadow-sm">
          <span>🚚 দ্রুত হোম ডেলিভারি</span>
          <span>💵 ক্যাশ অন ডেলিভারি</span>
          <span>🔄 সহজ রিটার্ন</span>
          <span>✅ ১০০% আসল পণ্য</span>
        </div>
      </main>

      {/* ফুটার */}
      <footer className="bg-gray-900 text-gray-300 mt-10">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm">
          <div className="text-emerald-400 font-bold text-lg mb-1">Pickora</div>
          <p>ঘরের সব প্রয়োজন, এক ঠিকানায়</p>
          <p className="mt-2 text-gray-500">© 2026 Pickora. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  )
}