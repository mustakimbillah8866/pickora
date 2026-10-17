'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Item = { id: number; name: string; price: number; qty: number; image?: string }
type CartType = {
  items: Item[]
  add: (p: { id: number; name: string; price: number; image?: string }) => void
  inc: (id: number) => void
  dec: (id: number) => void
  remove: (id: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartType | null>(null)
const KEY = 'pickora_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items))
  }, [items, ready])

  function add(p: { id: number; name: string; price: number; image?: string }) {
    setItems(prev => {
      const found = prev.find(i => i.id === p.id)
      if (found) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...p, qty: 1 }]
    })
  }
  function inc(id: number) { setItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)) }
  function dec(id: number) { setItems(prev => prev.flatMap(i => i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i])) }
  function remove(id: number) { setItems(prev => prev.filter(i => i.id !== id)) }
  function clear() { setItems([]) }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, add, inc, dec, remove, clear, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}