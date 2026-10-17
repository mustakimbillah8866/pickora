'use client'
import { useCart } from './CartContext'

export default function CartButton() {
  const { count } = useCart()
  return (
    <a href="/cart" style={{ padding: '8px 14px', background: '#1D9E75', color: '#fff', borderRadius: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      কার্ট
      <span style={{ background: '#fff', color: '#1D9E75', borderRadius: 999, fontSize: 12, padding: '0 7px', fontWeight: 700 }}>{count}</span>
    </a>
  )
}