export const instant = false
import { supabase } from './supabaseClient'
import ProductCard from './ProductCard'
import CartButton from './CartButton'
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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* টপ বার */}
      <div className="bg-orange-600 text-white text-xs text-center py-1.5 px-4">
        🚚 সারা দেশে ডেলিভারি · ১০০% আসল পণ্য · ক্যাশ অন ডেলিভারি · হেল্পলাইন: ০৯৬XX-XXXXXX
      </div>

      {/* হেডার */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 py-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xl">🛒</span>
            <span className="text-xl font-bold text-orange-600">Pickora</span>
          </div>
          <div className="flex-1 min-w-[160px] relative">
            <input placeholder="পণ্য, ব্র্যান্ড বা ক্যাটাগরি খুঁজুন…" className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <CartButton />
        </div>
        {/* ক্যাটাগরি মেনু বার */}
        <div className="bg-gray-900 text-white text-sm">
          <div className="max-w-6xl mx-auto px-4 py-2 flex gap-5 overflow-x-auto whitespace-nowrap">
            <span className="cursor-pointer hover:text-orange-400">সব পণ্য</span>
            {cats.map((c: any) => <span key={c.id} className="cursor-pointer hover:text-orange-400">{c.name}</span>)}
          </div>
        </div>
      </header>

      <HeroBanner />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Featured Categories */}
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

        {/* ক্যাটাগরি অনুযায়ী সেকশন */}
        {cats.map((c: any) => (
          <CategoryRow
            key={c.id}
            title={c.name}
            products={(products || []).filter((p) => p.category === c.name)}
          />
        ))}
        {/* ক্যাটাগরিহীন পণ্য (যদি থাকে) */}
        <CategoryRow
          title="অন্যান্য পণ্য"
          products={(products || []).filter((p) => !cats.some((c: any) => c.name === p.category))}
        />

        {/* Our Brands */}
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

        {/* ট্রাস্ট ব্যাজ */}
        <div className="flex flex-wrap gap-4 justify-center bg-white rounded-xl p-4 mt-10 text-sm text-gray-600 shadow-sm">
          <span>🚚 দ্রুত হোম ডেলিভারি</span>
          <span>💵 ক্যাশ অন ডেলিভারি</span>
          <span>🔄 সহজ রিটার্ন</span>
          <span>✅ ১০০% আসল পণ্য</span>
        </div>
      </main>

      {/* বড় ফুটার */}
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
              <li className="hover:text-orange-400 cursor-pointer">অর্ডার ট্র্যাকিং</li>
              <li className="hover:text-orange-400 cursor-pointer">কীভাবে অর্ডার করবেন</li>
              <li className="hover:text-orange-400 cursor-pointer">রিটার্ন পলিসি</li>
              <li className="hover:text-orange-400 cursor-pointer">FAQ</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">কেনাকাটা</div>
            <ul className="space-y-2 text-gray-400">
              {cats.slice(0, 5).map((c: any) => <li key={c.id} className="hover:text-orange-400 cursor-pointer">{c.name}</li>)}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
          © 2026 Pickora. সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
    </div>
  )
}