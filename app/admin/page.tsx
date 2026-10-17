'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loginErr, setLoginErr] = useState('')

  const [products, setProducts] = useState<any[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => { if (user) load() }, [user])

  async function login() {
    setLoginErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setLoginErr('লগইন ব্যর্থ: ইমেইল/পাসওয়ার্ড ঠিক আছে?')
  }
  async function logout() { await supabase.auth.signOut() }

  async function load() {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false })
    setProducts(data || [])
  }
  async function addProduct() {
    if (!name || !price) { setMsg('নাম ও দাম দিন।'); return }
    const { error } = await supabase.from('products').insert({ name, price: Number(price), category, stock: Number(stock) || 0 })
    if (error) { setMsg('সমস্যা: ' + error.message); return }
    setMsg('"' + name + '" যোগ হয়েছে ✅')
    setName(''); setPrice(''); setCategory(''); setStock(''); load()
  }
  async function del(id: number) { await supabase.from('products').delete().eq('id', id); load() }

  const box = { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 8, marginBottom: 8 }
  const btn = { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }

  if (!user) {
    return (
      <div style={{ fontFamily: 'sans-serif', maxWidth: 360, margin: '80px auto', padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🔐 অ্যাডমিন লগইন</h1>
        <p style={{ color: '#666', marginBottom: 16 }}>Pickora পরিচালনায় প্রবেশ করুন</p>
        <input style={box} placeholder="ইমেইল" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={box} placeholder="পাসওয়ার্ড" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        {loginErr && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 8 }}>{loginErr}</div>}
        <button style={{ ...btn, width: '100%' }} onClick={login}>প্রবেশ করুন</button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 24, color: '#1f2937' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>⚙️ Pickora অ্যাডমিন</h1>
          <p style={{ color: '#666', fontSize: 13 }}>{user.email}</p>
        </div>
        <button onClick={logout} style={{ ...btn, background: '#6b7280' }}>লগআউট</button>
      </div>

      <div style={{ background: '#f9fafb', border: '1px solid #eee', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>নতুন পণ্য যোগ</h2>
        <input style={box} placeholder="পণ্যের নাম" value={name} onChange={e => setName(e.target.value)} />
        <input style={box} placeholder="দাম (৳)" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <input style={box} placeholder="ক্যাটাগরি" value={category} onChange={e => setCategory(e.target.value)} />
        <input style={box} placeholder="স্টক" type="number" value={stock} onChange={e => setStock(e.target.value)} />
        <button style={btn} onClick={addProduct}>পণ্য যোগ করুন</button>
        {msg && <div style={{ marginTop: 10, color: '#1D9E75' }}>{msg}</div>}
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>সব পণ্য ({products.length})</h2>
      {products.map(p => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderBottom: '1px solid #eee' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div style={{ color: '#888', fontSize: 13 }}>{p.category} · ৳{p.price} · স্টক: {p.stock}</div>
          </div>
          <button onClick={() => del(p.id)} style={{ color: '#dc2626', border: '1px solid #fca5a5', background: '#fff', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>মুছুন</button>
        </div>
      ))}
    </div>
  )
}