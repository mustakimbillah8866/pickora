import { supabase } from './supabaseClient'

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  const cats = ['সব', 'ফ্যাশন', 'পোশাক', 'অর্গানিক খাবার', 'খেলনা', 'অন্যান্য']

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1f2937', background: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: '#1D9E75', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛒</span>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Pickora</span>
        </div>
        <input placeholder="পণ্য খুঁজুন…" style={{ flex: 1, minWidth: 160, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8 }} />
        <button style={{ padding: '8px 14px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>কার্ট</button>
      </header>

      <div style={{ background: '#1D9E75', color: '#fff', padding: '28px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>ঘরের সব প্রয়োজন, এক ঠিকানায়</div>
        <div style={{ opacity: 0.9 }}>ফ্যাশন · পোশাক · খাঁটি খাবার · খেলনা</div>
      </div>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {cats.map((c) => (
            <span key={c} style={{ padding: '6px 14px', background: c === 'সব' ? '#1D9E75' : '#fff', color: c === 'সব' ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: 999, fontSize: 14, cursor: 'pointer' }}>{c}</span>
          ))}
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>আমাদের পণ্য</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 }}>
          {products && products.map((p) => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ height: 120, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📦</div>
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 14, minHeight: 38 }}>{p.name}</div>
                <div style={{ color: '#888', fontSize: 12, margin: '2px 0 6px' }}>{p.category}</div>
                <div style={{ fontWeight: 700, color: '#1D9E75', marginBottom: 8 }}>৳{p.price}</div>
                <button style={{ width: '100%', padding: 6, background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>কার্টে যোগ</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', background: '#fff', borderRadius: 12, padding: 16, marginTop: 24, justifyContent: 'center', fontSize: 13, color: '#555' }}>
          <span>🚚 দ্রুত হোম ডেলিভারি</span>
          <span>💵 ক্যাশ অন ডেলিভারি</span>
          <span>🔄 সহজ রিটার্ন</span>
          <span>✅ ১০০% আসল পণ্য</span>
        </div>
      </main>
    </div>
  )
}