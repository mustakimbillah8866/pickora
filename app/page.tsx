export const revalidate = 0
import { supabase } from './supabaseClient'
import HeroBanner from './HeroBanner'
import CategoryRow from './CategoryRow'

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*').eq('is_active', true)
  const { data: catData } = await supabase.from('categories').select('*').order('id')
  const cats = catData || []
  const { data: brandData } = await supabase.from('brands').select('*').order('id', { ascending: false })
  const brands = brandData || []

  const catIcon: any = { 'ফ্যাশন': '👗', 'পোশাক': '👕', 'অর্গানিক খাবার': '🥗', 'খেলনা': '🧸', 'অন্যান্য': '🛍️', 'মধু': '🍯', 'তেল ও ঘি': '🫗', 'খেজুর': '🌴', 'মসলা': '🌶️' }

  return (
    <>
      <HeroBanner />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-center text-xl font-bold mb-5 mt-2">ক্যাটাগরি</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 mb-8 justify-start md:justify-center">
          {cats.map((c: any) => (
            <div key={c.id} className="flex flex-col items-center gap-2 flex-shrink-0 w-24 cursor-pointer group">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-3xl group-hover:shadow-md group-hover:border-orange-200 transition">
                {catIcon[c.name] || '🏷️'}
              </div>
              <span className="text-xs text-center">{c.name}</span>
            </div>
          ))}
        </div>

        {cats.map((c: any) => (
          <CategoryRow key={c.id} title={c.name} products={(products || []).filter((p) => p.category === c.name)} />
        ))}
        <CategoryRow title="অন্যান্য পণ্য" products={(products || []).filter((p) => !cats.some((c: any) => c.name === p.category))} />

        {brands.length > 0 && (
          <div className="mt-6 mb-4">
            <h2 className="text-center text-xl font-bold mb-5">আমাদের ব্র্যান্ড</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 justify-start md:justify-center">
              {brands.map((b: any) => (
                <div key={b.id} className="flex-shrink-0 w-32 h-20 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center p-3 hover:shadow-md transition">
                  <img src={b.logo_url} alt={b.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center bg-white rounded-xl p-4 mt-10 text-sm text-gray-600 shadow-sm">
          <span>🚚 দ্রুত হোম ডেলিভারি</span>
          <span>💵 ক্যাশ অন ডেলিভারি</span>
          <span>🔄 সহজ রিটার্ন</span>
          <span>✅ ১০০% আসল পণ্য</span>
        </div>
      </main>
    </>
  )
}