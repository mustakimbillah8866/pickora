import { supabase } from './supabaseClient'

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>🛒 Pickora</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>আমাদের পণ্যসমূহ</p>

      {error && <p style={{ color: 'red' }}>সমস্যা: {error.message}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {products && products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 14 }}>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div style={{ color: '#888', fontSize: 13, margin: '4px 0' }}>{p.category}</div>
            <div style={{ fontWeight: 600, color: '#1D9E75' }}>৳{p.price}</div>
          </div>
        ))}
      </div>

      {products && products.length === 0 && <p>কোনো পণ্য নেই।</p>}
    </main>
  )
}