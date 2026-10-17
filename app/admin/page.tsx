'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import ImageCropper from '../ImageCropper'

export default function Admin() {
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loginErr, setLoginErr] = useState('')

  const [tab, setTab] = useState<'products' | 'orders' | 'banners'>('products')
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [cats, setCats] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  const [bImage, setBImage] = useState('')
  const [bTitle, setBTitle] = useState('')
  const [bSub, setBSub] = useState('')
  const [bUploading, setBUploading] = useState(false)
  const [bMsg, setBMsg] = useState('')

  // ক্রপ
  const [cropSrc, setCropSrc] = useState('')
  const [cropAspect, setCropAspect] = useState(1)
  const [cropFor, setCropFor] = useState<'product' | 'banner'>('product')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])
  useEffect(() => { if (user) { loadProducts(); loadOrders(); loadCats(); loadBanners() } }, [user])

  async function login() {
    setLoginErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setLoginErr('লগইন ব্যর্থ: ইমেইল/পাসওয়ার্ড ঠিক আছে?')
  }
  async function logout() { await supabase.auth.signOut() }
  async function loadProducts() { const { data } = await supabase.from('products').select('*').order('id', { ascending: false }); setProducts(data || []) }
  async function loadOrders() { const { data } = await supabase.from('orders').select('*').order('id', { ascending: false }); setOrders(data || []) }
  async function loadCats() { const { data } = await supabase.from('categories').select('*').order('id'); setCats(data || []) }
  async function loadBanners() { const { data } = await supabase.from('banners').select('*').order('id', { ascending: false }); setBanners(data || []) }

  async function uploadBlob(blob: Blob): Promise<string | null> {
    const auth = await (await fetch('/api/upload-auth')).json()
    const form = new FormData()
    form.append('file', blob)
    form.append('fileName', 'pickora-' + Date.now() + '.jpg')
    form.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '')
    form.append('signature', auth.signature)
    form.append('expire', auth.expire)
    form.append('token', auth.token)
    const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'POST', body: form })
    const data = await res.json()
    return data.url || null
  }

  // ফাইল বাছলে ক্রপার খুলবে
  function pickFile(file: File, forWhat: 'product' | 'banner') {
    setCropFor(forWhat)
    setCropAspect(forWhat === 'banner' ? 3 / 1 : 1)
    setCropSrc(URL.createObjectURL(file))
  }
  // ক্রপ শেষে আপলোড
  async function onCropDone(blob: Blob) {
    const forWhat = cropFor
    setCropSrc('')
    if (forWhat === 'banner') { setBUploading(true); setBMsg('') } else { setUploading(true); setMsg('') }
    const url = await uploadBlob(blob)
    if (forWhat === 'banner') {
      if (url) { setBImage(url); setBMsg('ছবি আপলোড হয়েছে ✅') } else setBMsg('আপলোড ব্যর্থ')
      setBUploading(false)
    } else {
      if (url) { setImageUrl(url); setMsg('ছবি আপলোড হয়েছে ✅') } else setMsg('আপলোড ব্যর্থ')
      setUploading(false)
    }
  }

  async function addProduct() {
    if (!name || !price) { setMsg('নাম ও দাম দিন।'); return }
    const { error } = await supabase.from('products').insert({ name, price: Number(price), category, stock: Number(stock) || 0, image_url: imageUrl })
    if (error) { setMsg('সমস্যা: ' + error.message); return }
    setMsg('"' + name + '" যোগ হয়েছে ✅')
    setName(''); setPrice(''); setCategory(''); setStock(''); setImageUrl(''); loadProducts()
  }
  async function del(id: number) { await supabase.from('products').delete().eq('id', id); loadProducts() }
  async function updateStatus(id: number, status: string) { await supabase.from('orders').update({ status }).eq('id', id); loadOrders() }

  async function addBanner() {
    if (!bImage) { setBMsg('আগে একটা ছবি আপলোড করুন।'); return }
    const { error } = await supabase.from('banners').insert({ image_url: bImage, title: bTitle, subtitle: bSub })
    if (error) { setBMsg('সমস্যা: ' + error.message); return }
    setBMsg('ব্যানার যোগ হয়েছে ✅')
    setBImage(''); setBTitle(''); setBSub(''); loadBanners()
  }
  async function delBanner(id: number) { await supabase.from('banners').delete().eq('id', id); loadBanners() }
  async function toggleBanner(id: number, active: boolean) { await supabase.from('banners').update({ is_active: !active }).eq('id', id); loadBanners() }

  const box = "w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 text-sm"
  const btn = "bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm"

  if (!user) return (
    <div className="max-w-sm mx-auto mt-20 p-6">
      <h1 className="text-xl font-bold mb-1">🔐 অ্যাডমিন লগইন</h1>
      <p className="text-gray-500 text-sm mb-4">Pickora পরিচালনায় প্রবেশ করুন</p>
      <input className={box} placeholder="ইমেইল" value={email} onChange={e => setEmail(e.target.value)} />
      <input className={box} type="password" placeholder="পাসওয়ার্ড" value={pass} onChange={e => setPass(e.target.value)} />
      {loginErr && <div className="text-red-500 text-sm mb-2">{loginErr}</div>}
      <button className={btn + ' w-full'} onClick={login}>প্রবেশ করুন</button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      {cropSrc && <ImageCropper src={cropSrc} aspect={cropAspect} onDone={onCropDone} onCancel={() => setCropSrc('')} />}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">⚙️ Pickora অ্যাডমিন</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <button onClick={logout} className="bg-gray-500 text-white rounded-lg px-4 py-2 text-sm">লগআউট</button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setTab('products')} className={`px-4 py-2 rounded-lg text-sm ${tab === 'products' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}>পণ্য</button>
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-lg text-sm ${tab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}>অর্ডার ({orders.length})</button>
        <button onClick={() => setTab('banners')} className={`px-4 py-2 rounded-lg text-sm ${tab === 'banners' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}>ব্যানার ({banners.length})</button>
      </div>

      {tab === 'products' && (
        <>
          <div className="bg-gray-50 border rounded-xl p-4 mb-5">
            <h2 className="font-semibold mb-2">নতুন পণ্য যোগ</h2>
            <input className={box} placeholder="পণ্যের নাম" value={name} onChange={e => setName(e.target.value)} />
            <input className={box} type="number" placeholder="দাম (৳)" value={price} onChange={e => setPrice(e.target.value)} />
            <select className={box} value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">ক্যাটাগরি বাছুন</option>
              {cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <input className={box} type="number" placeholder="স্টক" value={stock} onChange={e => setStock(e.target.value)} />
            <label className="block text-sm mb-1 text-gray-600">পণ্যের ছবি (বর্গাকার):</label>
            <input type="file" accept="image/*" className="mb-2 text-sm" onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f, 'product'); e.target.value = '' }} />
            {uploading && <div className="text-sm text-amber-600 mb-2">আপলোড হচ্ছে…</div>}
            {imageUrl && <img src={imageUrl} alt="preview" className="w-20 h-20 object-cover rounded mb-2" />}
            <button className={btn} onClick={addProduct}>পণ্য যোগ করুন</button>
            {msg && <div className="mt-2 text-emerald-600 text-sm">{msg}</div>}
          </div>
          <h2 className="font-semibold mb-2">সব পণ্য ({products.length})</h2>
          {products.map(p => (
            <div key={p.id} className="flex items-center gap-2 py-2 border-b">
              {p.image_url && <img src={p.image_url} alt="" className="w-10 h-10 object-cover rounded" />}
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-gray-500 text-xs">{p.category} · ৳{p.price} · স্টক: {p.stock}</div>
              </div>
              <button onClick={() => del(p.id)} className="text-red-500 border border-red-200 rounded px-2 py-1 text-xs">মুছুন</button>
            </div>
          ))}
        </>
      )}

      {tab === 'orders' && (
        <>
          <h2 className="font-semibold mb-2">অর্ডারসমূহ ({orders.length})</h2>
          {orders.length === 0 && <p className="text-gray-500 text-sm">এখনো কোনো অর্ডার নেই।</p>}
          {orders.map(o => (
            <div key={o.id} className="bg-white border rounded-xl p-3 mb-2 shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">অর্ডার #{o.id}</span>
                <span className="text-emerald-600 font-semibold">৳{o.total}</span>
              </div>
              <div className="text-sm mt-1">👤 {o.customer_name} · 📞 {o.customer_phone}</div>
              <div className="text-sm text-gray-500">📍 {o.customer_address}</div>
              <div className="text-xs text-gray-400 mt-1">
                পণ্য: {Array.isArray(o.items) ? o.items.map((i: any) => `${i.name} ×${i.qty}`).join(', ') : ''}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">অবস্থা:</span>
                <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="text-xs border rounded px-2 py-1">
                  <option value="নতুন">নতুন</option>
                  <option value="প্রসেসিং">প্রসেসিং</option>
                  <option value="পাঠানো হয়েছে">পাঠানো হয়েছে</option>
                  <option value="ডেলিভারি হয়েছে">ডেলিভারি হয়েছে</option>
                  <option value="বাতিল">বাতিল</option>
                </select>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'banners' && (
        <>
          <div className="bg-gray-50 border rounded-xl p-4 mb-5">
            <h2 className="font-semibold mb-2">নতুন ব্যানার যোগ</h2>
            <label className="block text-sm mb-1 text-gray-600">ব্যানারের ছবি (৩:১ অনুপাত):</label>
            <input type="file" accept="image/*" className="mb-2 text-sm" onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f, 'banner'); e.target.value = '' }} />
            {bUploading && <div className="text-sm text-amber-600 mb-2">আপলোড হচ্ছে…</div>}
            {bImage && <img src={bImage} alt="preview" className="w-full h-28 object-cover rounded mb-2" />}
            <input className={box} placeholder="শিরোনাম (ঐচ্ছিক)" value={bTitle} onChange={e => setBTitle(e.target.value)} />
            <input className={box} placeholder="উপশিরোনাম (ঐচ্ছিক)" value={bSub} onChange={e => setBSub(e.target.value)} />
            <button className={btn} onClick={addBanner}>ব্যানার যোগ করুন</button>
            {bMsg && <div className="mt-2 text-emerald-600 text-sm">{bMsg}</div>}
          </div>
          <h2 className="font-semibold mb-2">সব ব্যানার ({banners.length})</h2>
          {banners.map(b => (
            <div key={b.id} className="flex items-center gap-3 py-2 border-b">
              <img src={b.image_url} alt="" className="w-24 h-14 object-cover rounded" />
              <div className="flex-1 text-sm">
                <div className="font-medium">{b.title || '(শিরোনাম নেই)'}</div>
                <div className="text-gray-500 text-xs">{b.subtitle}</div>
              </div>
              <button onClick={() => toggleBanner(b.id, b.is_active)} className={`rounded px-2 py-1 text-xs border ${b.is_active ? 'text-emerald-600 border-emerald-200' : 'text-gray-400 border-gray-200'}`}>
                {b.is_active ? 'চালু ✓' : 'বন্ধ'}
              </button>
              <button onClick={() => delBanner(b.id)} className="text-red-500 border border-red-200 rounded px-2 py-1 text-xs">মুছুন</button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}